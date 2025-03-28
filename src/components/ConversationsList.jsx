"use client"

import { FaUser } from "react-icons/fa"

export default function ConversationsList({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUserId,
}) {
  // Format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      return ""
    }

    try {
      const now = new Date()
      const date = timestamp.toDate()
      const diffInSeconds = Math.floor((now - date) / 1000)

      if (diffInSeconds < 60) {
        return "Just now"
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes}m`
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours}h`
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400)
        return `${days}d`
      } else {
        // Format as date for older messages
        return date.toLocaleDateString([], { month: "short", day: "numeric" })
      }
    } catch (error) {
      console.error("Error formatting time:", error)
      return ""
    }
  }

  return (
    <div className="conversations-list">
      {conversations.map((conversation) => {
        const isActive = conversation.id === activeConversationId
        const hasUnread = conversation.unreadCount && conversation.unreadCount[currentUserId] > 0

        return (
          <div
            key={conversation.id}
            className={`conversation-item ${isActive ? "active" : ""} ${hasUnread ? "unread" : ""}`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="conversation-avatar">
              {conversation.otherParticipant.photoURL ? (
                <img src={conversation.otherParticipant.photoURL || "/placeholder.svg"} alt="User" />
              ) : (
                <FaUser />
              )}
            </div>

            <div className="conversation-details">
              <div className="conversation-header">
                <h3 className="conversation-name">{conversation.otherParticipant.displayName || "User"}</h3>
                <span className="conversation-time">{formatTimeAgo(conversation.lastMessage?.timestamp)}</span>
              </div>

              <div className="conversation-preview">
                <p className="conversation-last-message">{conversation.lastMessage?.text || "No messages yet"}</p>

                {hasUnread && (
                  <span className="conversation-unread-badge">{conversation.unreadCount[currentUserId]}</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

