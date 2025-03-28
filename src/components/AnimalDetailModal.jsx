"use client"

import { FaEdit, FaTrash, FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaComment, FaHeart } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

export default function AnimalDetailModal({
  animal,
  onClose,
  isOwner,
  onEdit,
  onDelete,
  formatTimeAgo,
  formatAnimalType,
  currentUserId,
}) {
  const navigate = useNavigate()

  // Handle image display with error fallback
  const renderImage = () => {
    // Check if image exists
    if (!animal.imageBase64) {
      return <img src="/placeholder.svg" alt="No image available" className="modal-animal-image" />
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
          className="modal-animal-image"
          onError={(e) => {
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
          className="modal-animal-image"
          onError={(e) => {
            e.target.src = "/placeholder.svg"
            e.target.alt = "Image failed to load"
          }}
        />
      )
    }

    // Fallback
    return <img src="/placeholder.svg" alt="Image format not supported" className="modal-animal-image" />
  }

  const handleMessageSeller = (isInterested = false) => {
    if (!currentUserId) {
      alert("You need to be logged in to send messages")
      return
    }

    if (isOwner) {
      alert("You cannot message yourself")
      return
    }

    // Create a conversation ID that combines both user IDs
    // This ensures the same conversation is used if they message each other again
    const conversationId = [currentUserId, animal.userId].sort().join("_")

    // Navigate to messages page with the conversation ID and additional parameters
    const params = new URLSearchParams()
    params.set("conversation", conversationId)
    params.set("seller", animal.userId)
    params.set("animalId", animal.id)

    // Add a parameter to indicate interest
    if (isInterested) {
      params.set("interested", "true")
      params.set("animalTitle", animal.title)
    }

    navigate(`/dashboard/messages?${params.toString()}`)

    // Close the modal
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{animal.title}</h2>
          <button className="modal-close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-image-container">
            {renderImage()}
            <div className="modal-price">Rs. {animal.price?.toLocaleString() || "N/A"}</div>
          </div>

          <div className="modal-details">
            <div className="modal-section">
              <h3>Details</h3>
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-info-label">Type:</span>
                  <span className="modal-info-value">{formatAnimalType(animal.type)}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Location:</span>
                  <span className="modal-info-value">
                    <FaMapMarkerAlt className="modal-info-icon" /> {animal.location}
                  </span>
                </div>
                {animal.color && (
                  <div className="modal-info-item">
                    <span className="modal-info-label">Color:</span>
                    <span className="modal-info-value">{animal.color}</span>
                  </div>
                )}
                {animal.age && (
                  <div className="modal-info-item">
                    <span className="modal-info-label">Age:</span>
                    <span className="modal-info-value">{animal.age}</span>
                  </div>
                )}
                {animal.weight && (
                  <div className="modal-info-item">
                    <span className="modal-info-label">Weight:</span>
                    <span className="modal-info-value">{animal.weight}</span>
                  </div>
                )}
                <div className="modal-info-item">
                  <span className="modal-info-label">Posted:</span>
                  <span className="modal-info-value">{formatTimeAgo(animal.createdAt)}</span>
                </div>
              </div>
            </div>

            {animal.description && (
              <div className="modal-section">
                <h3>Description</h3>
                <p className="modal-description">{animal.description}</p>
              </div>
            )}

            <div className="modal-section">
              <h3>Seller Information</h3>
              <div className="modal-seller-info">
                <div className="modal-seller-email">
                  <FaEnvelope className="modal-info-icon" /> {animal.userEmail}
                </div>
                {animal.userPhone && (
                  <div className="modal-seller-phone">
                    <FaPhone className="modal-info-icon" /> {animal.userPhone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {isOwner ? (
            <div className="modal-actions">
              <button className="modal-action-button edit" onClick={onEdit}>
                <FaEdit /> Edit Listing
              </button>
              <button className="modal-action-button delete" onClick={onDelete}>
                <FaTrash /> Delete Listing
              </button>
            </div>
          ) : (
            <div className="modal-contact">
              <button className="modal-action-button interested" onClick={() => handleMessageSeller(true)}>
                <FaHeart /> I'm Interested
              </button>
              <button className="modal-contact-button" onClick={() => handleMessageSeller(false)}>
                <FaComment /> Message Seller
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}