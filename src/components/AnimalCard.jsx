"use client"

import { useState, useEffect } from "react"
import { FaEdit, FaTrash, FaHeart, FaRegHeart } from "react-icons/fa"
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore"
import { db } from "../firebase/firebase"
import AnimalDetailModal from "./AnimalDetailModal"

export default function AnimalCard({ animal, currentUserId, onEdit, onDelete }) {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)


  useEffect(() => {
    const checkIfFavorite = async () => {
      if (!currentUserId || !animal.id) return

      try {
        console.log("Checking favorite status for:", animal.id, "User:", currentUserId)
        const favoriteRef = doc(db, "favorites", `${currentUserId}_${animal.id}`)

        try {
          const favoriteDoc = await getDoc(favoriteRef)
          const exists = favoriteDoc.exists()
          console.log("Favorite exists:", exists)
          setIsFavorite(exists)
        } catch (error) {
          console.error("Error checking favorite document:", error)
          
          setIsFavorite(false)
        }
      } catch (error) {
        console.error("Error in checkIfFavorite:", error)
        setIsFavorite(false)
      }
    }

    checkIfFavorite()
  }, [animal.id, currentUserId])

  // Format the animal type for display
  const formatAnimalType = (type) => {
    if (!type) return ""
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Check if the current user is the owner of this animal
  const isOwner = currentUserId && animal.userId === currentUserId

  // Format relative time
  const formatTimeAgo = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      return "Recently added"
    }

    try {
      const now = new Date()
      const date = timestamp.toDate()
      const diffInSeconds = Math.floor((now - date) / 1000)

      if (diffInSeconds < 60) {
        return "Just now"
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400)
        return `${days} ${days === 1 ? "day" : "days"} ago`
      } else {
        // Format as date for older posts
        return date.toLocaleDateString()
      }
    } catch (error) {
      console.error("Error formatting time:", error)
      return "Recently added"
    }
  }

  // Handle image display with error fallback
  const renderImage = () => {
    // Check if image exists
    if (!animal.imageBase64) {
      return <img src="/placeholder.svg" alt="No image available" className="animal-image" />
    }

    // Check if the image is a valid base64 string
    const isBase64 =
      typeof animal.imageBase64 === "string" &&
      (animal.imageBase64.startsWith("data:image") || animal.imageBase64.startsWith("/9j/"))

    // If it's a valid base64 string
    if (isBase64) {
      // Make sure it has the proper prefix if it's just the base64 data
      const imgSrc = animal.imageBase64.startsWith("data:image")
        ? animal.imageBase64
        : `data:image/jpeg;base64,${animal.imageBase64}`

      return (
        <img
          src={imgSrc || "/placeholder.svg"}
          alt={animal.title}
          className="animal-image"
          onError={(e) => {
            console.error("Image failed to load:", animal.id)
            e.target.src = "/placeholder.svg"
            e.target.alt = "Image failed to load"
          }}
        />
      )
    }

    // If it's a URL
    if (
      typeof animal.imageBase64 === "string" &&
      (animal.imageBase64.startsWith("http://") || animal.imageBase64.startsWith("https://"))
    ) {
      return (
        <img
          src={animal.imageBase64 || "/placeholder.svg"}
          alt={animal.title}
          className="animal-image"
          onError={(e) => {
            console.error("Image URL failed to load:", animal.id)
            e.target.src = "/placeholder.svg"
            e.target.alt = "Image failed to load"
          }}
        />
      )
    }

    // Fallback
    return <img src="/placeholder.svg" alt="Image format not supported" className="animal-image" />
  }

  const handleCardClick = () => {
    setShowDetailModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailModal(false)
  }

  const handleEdit = (e) => {
    e.stopPropagation() // Prevent card click
    if (onEdit) {
      onEdit(animal)
    }
  }

  const handleDelete = (e) => {
    e.stopPropagation() // Prevent card click
    if (onDelete) {
      if (window.confirm("Are you sure you want to delete this animal listing?")) {
        onDelete(animal.id)
      }
    }
  }

  // Update the toggleFavorite function to handle errors better and ensure it works for own listings
  const toggleFavorite = async (e) => {
    e.stopPropagation() // Prevent opening the modal

    if (!currentUserId) {
      alert("You need to be logged in to save favorites")
      return
    }

    if (isTogglingFavorite) return

    try {
      setIsTogglingFavorite(true)
      console.log("Toggling favorite for animal:", animal.id, "Current user:", currentUserId)

      // Create a unique ID for the favorite document
      const favoriteId = `${currentUserId}_${animal.id}`
      console.log("Favorite document ID:", favoriteId)

      const favoriteRef = doc(db, "favorites", favoriteId)

      // First check if the document exists
      try {
        const favoriteDoc = await getDoc(favoriteRef)

        if (favoriteDoc.exists()) {
          // Remove from favorites
          console.log("Document exists, removing from favorites")
          await deleteDoc(favoriteRef)
          setIsFavorite(false)
          console.log("Successfully removed from favorites")
        } else {
          // Add to favorites
          console.log("Document doesn't exist, adding to favorites")
          const animalData = {
            title: animal.title || "",
            price: animal.price || 0,
            type: animal.type || "",
            location: animal.location || "",
            imageBase64: animal.imageBase64 || "",
            userId: animal.userId || "",
            userEmail: animal.userEmail || "",
            description: animal.description || "",
            createdAt: animal.createdAt || new Date(),
          }

          // Only add these fields if they exist
          if (animal.userPhone) animalData.userPhone = animal.userPhone
          if (animal.color) animalData.color = animal.color
          if (animal.age) animalData.age = animal.age
          if (animal.weight) animalData.weight = animal.weight

          const favoriteData = {
            userId: currentUserId,
            animalId: animal.id,
            createdAt: new Date(),
            animalData: animalData,
          }

          await setDoc(favoriteRef, favoriteData)
          setIsFavorite(true)
          console.log("Successfully added to favorites")
        }
      } catch (error) {
        console.error("Error checking favorite document:", error)

        // If there's an error checking the document, try to create it anyway
        console.log("Attempting to create favorite document directly")
        const animalData = {
          title: animal.title || "",
          price: animal.price || 0,
          type: animal.type || "",
          location: animal.location || "",
          imageBase64: animal.imageBase64 || "",
          userId: animal.userId || "",
          userEmail: animal.userEmail || "",
          description: animal.description || "",
          createdAt: animal.createdAt || new Date(),
        }

        // Only add these fields if they exist
        if (animal.userPhone) animalData.userPhone = animal.userPhone
        if (animal.color) animalData.color = animal.color
        if (animal.age) animalData.age = animal.age
        if (animal.weight) animalData.weight = animal.weight

        const favoriteData = {
          userId: currentUserId,
          animalId: animal.id,
          createdAt: new Date(),
          animalData: animalData,
        }

        await setDoc(favoriteRef, favoriteData)
        setIsFavorite(true)
        console.log("Successfully added to favorites after error")
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      alert("Failed to update favorites. Please try again.")
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  return (
    <>
      <div className="animal-card" onClick={handleCardClick}>
        <div className="animal-image-container">
          {renderImage()}
          <div className="animal-price">Rs. {animal.price?.toLocaleString() || "N/A"}</div>

          {/* Favorite button - always show this regardless of ownership */}
          <button
            className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
            onClick={toggleFavorite}
            disabled={isTogglingFavorite}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>

          {/* Owner actions */}
          {isOwner && (
            <div className="animal-actions">
              <button className="animal-action-button edit" onClick={handleEdit} title="Edit">
                <FaEdit />
              </button>
              <button className="animal-action-button delete" onClick={handleDelete} title="Delete">
                <FaTrash />
              </button>
            </div>
          )}
        </div>
        <div className="animal-details">
          <h3 className="animal-title">{animal.title}</h3>
          <div className="animal-meta">
            <span className="animal-type">{formatAnimalType(animal.type)}</span>
            <span className="animal-location">{animal.location}</span>
          </div>
          {animal.description && <p className="animal-description">{animal.description}</p>}
          <div className="animal-specs">
            {animal.color && <span className="animal-spec">Color: {animal.color}</span>}
            {animal.age && <span className="animal-spec">Age: {animal.age}</span>}
            {animal.weight && <span className="animal-spec">Weight: {animal.weight}</span>}
          </div>
          <div className="animal-time">{formatTimeAgo(animal.createdAt)}</div>
          {animal.userEmail && (
            <div className="animal-seller">
              <span>Seller: {animal.userEmail}</span>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <AnimalDetailModal
          animal={{ ...animal, isFavorite }}
          onClose={handleCloseModal}
          isOwner={isOwner}
          onEdit={isOwner ? handleEdit : null}
          onDelete={isOwner ? handleDelete : null}
          onToggleFavorite={toggleFavorite}
          formatTimeAgo={formatTimeAgo}
          formatAnimalType={formatAnimalType}
          currentUserId={currentUserId}
        />
      )}
    </>
  )
}

