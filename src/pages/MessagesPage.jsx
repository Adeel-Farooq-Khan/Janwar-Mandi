"use client"

import { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  limit,
  setDoc,
} from "firebase/firestore"
import { db, auth } from "../firebase/firebase"
import { FaArrowLeft, FaPaperPlane, FaUser } from "react-icons/fa"
import ConversationsList from "../components/ConversationsList"
import "../styles/messages.css"

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [otherUser, setOtherUser] = useState(null)
  const [animal, setAnimal] = useState(null)
  const [error, setError] = useState("")
  const messagesEndRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = auth.currentUser
  const initialMessageSent = useRef(false)

  // Parse URL parameters
  useEffect(() => {
    if (location.search && currentUser) {
      const params = new URLSearchParams(location.search)
      const conversationId = params.get("conversation")
      const sellerId = params.get("seller")
      const animalId = params.get("animalId")
      const interested = params.get("interested")
      const animalTitle = params.get("animalTitle")

      if (conversationId && sellerId) {
        // Set active conversation from URL
        setActiveConversation(conversationId)

        // Fetch seller info
        fetchUserInfo(sellerId)

        // Fetch animal info if provided
        if (animalId) {
          fetchAnimalInfo(animalId)
        }

        // If user clicked "I'm interested", send an automatic message
        if (interested === "true" && animalTitle && !initialMessageSent.current) {
          initialMessageSent.current = true

          // Send the interested message after a short delay to ensure everything is loaded
          setTimeout(() => {
            sendInterestedMessage(conversationId, sellerId, animalTitle)
          }, 1000)
        }
      }
    }
  }, [location.search, currentUser])

  // Fetch user's conversations
  useEffect(() => {
    if (!currentUser) return

    const fetchConversations = async () => {
      try {
        // Query conversations where the current user is a participant
        const q = query(collection(db, "conversations"), where("participants", "array-contains", currentUser.uid))

        const unsubscribe = onSnapshot(
          q,
          async (snapshot) => {
            const conversationsData = []

            for (const docSnapshot of snapshot.docs) {
              const conversationData = docSnapshot.data()
              const conversationId = docSnapshot.id

              // Find the other participant's ID
              const otherParticipantId = conversationData.participants.find((id) => id !== currentUser.uid)

              // Get the other user's info
              let otherParticipantInfo = { displayName: "Unknown User", email: "" }
              try {
                const userDoc = await getDoc(doc(db, "users", otherParticipantId))
                if (userDoc.exists()) {
                  otherParticipantInfo = userDoc.data()
                } else {
                  // If user doc doesn't exist, try to get email from animal listings
                  const usersQuery = query(
                    collection(db, "animalListings"),
                    where("userId", "==", otherParticipantId),
                    limit(1),
                  )
                  const userDocs = await getDocs(usersQuery)
                  if (!userDocs.empty) {
                    otherParticipantInfo.email = userDocs.docs[0].data().userEmail
                    otherParticipantInfo.displayName = userDocs.docs[0].data().userEmail.split("@")[0]
                    if (userDocs.docs[0].data().userPhone) {
                      otherParticipantInfo.phone = userDocs.docs[0].data().userPhone
                    }
                  }
                }
              } catch (error) {
                console.error("Error fetching user info:", error)
              }

              conversationsData.push({
                id: conversationId,
                ...conversationData,
                otherParticipant: {
                  id: otherParticipantId,
                  ...otherParticipantInfo,
                },
                lastMessage: conversationData.lastMessage || { text: "No messages yet", timestamp: null },
              })
            }

            // Sort by last message timestamp (newest first)
            conversationsData.sort((a, b) => {
              const timeA = a.lastMessage?.timestamp?.toDate?.() || new Date(0)
              const timeB = b.lastMessage?.timestamp?.toDate?.() || new Date(0)
              return timeB - timeA
            })

            setConversations(conversationsData)
            setLoading(false)
          },
          (error) => {
            console.error("Error fetching conversations:", error)
            setError("Failed to load conversations. Please try again.")
            setLoading(false)
          },
        )

        return unsubscribe
      } catch (error) {
        console.error("Error setting up conversations listener:", error)
        setLoading(false)
      }
    }

    fetchConversations()
  }, [currentUser])

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConversation || !currentUser) return

    const fetchMessages = async () => {
      try {
        // First ensure the conversation exists with both participants
        const otherParticipantId = activeConversation.split("_").find((id) => id !== currentUser.uid)

        // Create or update the conversation document first
        await setDoc(
          doc(db, "conversations", activeConversation),
          {
            participants: [currentUser.uid, otherParticipantId],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        )

        // Now query the messages
        const q = query(collection(db, "conversations", activeConversation, "messages"), orderBy("timestamp", "asc"))

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))

            setMessages(messagesData)
          },
          (error) => {
            console.error("Error fetching messages:", error)
            setError("Failed to load messages. Please try again.")
          },
        )

        // Mark conversation as read after messages are loaded
        markConversationAsRead()

        return unsubscribe
      } catch (error) {
        console.error("Error setting up messages listener:", error)
        setError("Failed to load messages. Please try again.")
      }
    }

    fetchMessages()

    // Don't try to mark as read immediately - wait until we know the conversation exists
  }, [activeConversation, currentUser])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const fetchUserInfo = async (userId) => {
    try {
      // First try to get from users collection
      const userDoc = await getDoc(doc(db, "users", userId))

      if (userDoc.exists()) {
        setOtherUser({
          id: userId,
          ...userDoc.data(),
        })
      } else {
        // If not found, try to get from animal listings
        const q = query(collection(db, "animalListings"), where("userId", "==", userId), limit(1))

        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          setOtherUser({
            id: userId,
            displayName: userData.userEmail.split("@")[0],
            email: userData.userEmail,
            phone: userData.userPhone || null,
          })
        } else {
          setOtherUser({
            id: userId,
            displayName: "Unknown User",
            email: "",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
    }
  }

  const fetchAnimalInfo = async (animalId) => {
    try {
      const animalDoc = await getDoc(doc(db, "animalListings", animalId))

      if (animalDoc.exists()) {
        setAnimal({
          id: animalId,
          ...animalDoc.data(),
        })
      }
    } catch (error) {
      console.error("Error fetching animal info:", error)
    }
  }

  const markConversationAsRead = async () => {
    if (!activeConversation || !currentUser) return

    try {
      // Get the other participant ID
      const otherParticipantId = activeConversation.split("_").find((id) => id !== currentUser.uid)

      // Ensure the conversation exists first
      await setDoc(
        doc(db, "conversations", activeConversation),
        {
          participants: [currentUser.uid, otherParticipantId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      const conversationRef = doc(db, "conversations", activeConversation)
      const conversationDoc = await getDoc(conversationRef)

      if (conversationDoc.exists()) {
        const data = conversationDoc.data()

        // If there are unread messages for the current user
        if (data.unreadCount && data.unreadCount[currentUser.uid] > 0) {
          // Update unread count
          const unreadCount = { ...data.unreadCount }
          unreadCount[currentUser.uid] = 0

          await updateDoc(conversationRef, { unreadCount })
        }
      }
    } catch (error) {
      console.error("Error marking conversation as read:", error)
      // Don't show this error to the user as it's not critical
    }
  }

  const sendInterestedMessage = async (conversationId, otherParticipantId, animalTitle) => {
    if (!currentUser || !conversationId || !otherParticipantId || !animalTitle) return

    try {
      // First ensure the conversation document exists with merge option
      await setDoc(
        doc(db, "conversations", conversationId),
        {
          participants: [currentUser.uid, otherParticipantId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          unreadCount: {},
        },
        { merge: true },
      )

      const interestedMessage = `I'm interested in your ${animalTitle}. Is it still available?`

      // Add message to the conversation
      await addDoc(collection(db, "conversations", conversationId, "messages"), {
        text: interestedMessage,
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        timestamp: serverTimestamp(),
      })

      // Update conversation with last message
      const conversationRef = doc(db, "conversations", conversationId)

      // Update unread count for the other user
      const unreadCount = {}
      unreadCount[otherParticipantId] = 1

      await updateDoc(conversationRef, {
        lastMessage: {
          text: interestedMessage,
          senderId: currentUser.uid,
          timestamp: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
        unreadCount,
      })

      console.log("Interested message sent successfully")
      setError("") // Clear any previous errors
    } catch (error) {
      console.error("Error sending interested message:", error)
      setError("Failed to send message. Please try again.")
    }
  }

  const ensureConversationExists = async (conversationId, otherParticipantId) => {
    if (!currentUser) return false

    try {
      // Try to create the conversation document first without checking if it exists
      // This avoids the permission error when trying to read a non-existent document
      await setDoc(
        doc(db, "conversations", conversationId),
        {
          participants: [currentUser.uid, otherParticipantId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          unreadCount: {},
        },
        { merge: true }, // Use merge to avoid overwriting if it already exists
      )

      console.log("Conversation created or updated successfully")
      return true
    } catch (error) {
      console.error("Error ensuring conversation exists:", error)
      throw error
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !activeConversation || !currentUser) return

    try {
      // Get the other participant ID
      const otherParticipantId = activeConversation.split("_").find((id) => id !== currentUser.uid)

      // Make sure conversation exists first with merge option
      await setDoc(
        doc(db, "conversations", activeConversation),
        {
          participants: [currentUser.uid, otherParticipantId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      // Add message to the conversation
      await addDoc(collection(db, "conversations", activeConversation, "messages"), {
        text: newMessage.trim(),
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        timestamp: serverTimestamp(),
      })

      // Update conversation with last message
      const conversationRef = doc(db, "conversations", activeConversation)

      // Update unread count for the other user
      const unreadCount = {}
      unreadCount[otherParticipantId] = 1

      await updateDoc(conversationRef, {
        lastMessage: {
          text: newMessage.trim(),
          senderId: currentUser.uid,
          timestamp: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
        unreadCount,
      })

      // Clear input
      setNewMessage("")
      setError("") // Clear any previous errors
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message. Please try again.")
    }
  }

  const handleConversationSelect = (conversationId) => {
    setActiveConversation(conversationId)
    setError("")

    // Update URL without reloading the page
    const otherParticipantId = conversationId.split("_").find((id) => id !== currentUser.uid)

    navigate(`/dashboard/messages?conversation=${conversationId}&seller=${otherParticipantId}`)

    // Fetch other user info
    fetchUserInfo(otherParticipantId)
  }

  const formatTime = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return ""

    const date = timestamp.toDate()
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleBackToList = () => {
    setActiveConversation(null)
    setOtherUser(null)
    setAnimal(null)
    setError("")
    navigate("/dashboard/messages")
  }

  const handleBackToDashboard = () => {
    navigate("/dashboard")
  }

  if (loading) {
    return (
      <div className="messages-loading">
        <div className="messages-spinner"></div>
        <p>Loading conversations...</p>
      </div>
    )
  }

  return (
    <>
      <div className="messages-page-header">
        <button className="back-to-dashboard" onClick={handleBackToDashboard}>
          <FaArrowLeft /> Back to Dashboard
        </button>
      </div>
      
      <div className="messages-container">
        {/* Conversations List (Left Sidebar) */}
        <div className={`conversations-sidebar ${activeConversation ? "hidden-mobile" : ""}`}>
          <div className="conversations-header">
            <h2>Messages</h2>
          </div>

          <ConversationsList
            conversations={conversations}
            activeConversationId={activeConversation}onId={activeConversation}
            onSelectConversation={handleConversationSelect}
            currentUserId={currentUser?.uid}
          />

          {conversations.length === 0 && (
            <div className="no-conversations">
              <p>No conversations yet</p>
              <small>When you message a seller, it will appear here</small>
            </div>
          )}
        </div>

        {/* Chat Window (Right Side) */}
        <div className={`chat-window ${!activeConversation ? "hidden-mobile" : ""}`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <button className="back-button" onClick={handleBackToList}>
                  <FaArrowLeft />
                </button>

                <div className="chat-user-info">
                  <div className="chat-user-avatar">
                    {otherUser?.photoURL ? <img src={otherUser.photoURL || "/placeholder.svg"} alt="User" /> : <FaUser />}
                  </div>
                  <div className="chat-user-details">
                    <h3>{otherUser?.displayName || "User"}</h3>
                    <small>{otherUser?.email || ""}</small>
                    {otherUser?.phone && <small className="chat-user-phone">Phone: {otherUser.phone}</small>}
                  </div>
                </div>
              </div>

              {/* Animal Info (if available) */}
              {animal && (
                <div className="chat-animal-info">
                  <div className="chat-animal-image">
                    {animal.imageBase64 ? (
                      <img
                        src={
                          animal.imageBase64.startsWith("data:")
                            ? animal.imageBase64
                            : `data:image/jpeg;base64,${animal.imageBase64}`
                        }
                        alt={animal.title}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                          console.log("Image failed to load, using placeholder")
                        }}
                      />
                    ) : (
                      <img src="/placeholder.svg" alt="Animal" />
                    )}
                  </div>
                  <div className="chat-animal-details">
                    <h4>{animal.title}</h4>
                    <p className="chat-animal-price">Rs. {animal.price?.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && <div className="chat-error">{error}</div>}

              {/* Messages */}
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>No messages yet</p>
                    <small>Start the conversation by sending a message</small>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.senderId === currentUser?.uid ? "sent" : "received"}`}
                    >
                      <div className="message-content">
                        <p>{message.text}</p>
                        <span className="message-time">
                          {message.timestamp ? formatTime(message.timestamp) : "Sending..."}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form className="message-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" disabled={!newMessage.trim()}>
                  <FaPaperPlane />
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="no-conversation-content">
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list or start a new one by messaging a seller</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
