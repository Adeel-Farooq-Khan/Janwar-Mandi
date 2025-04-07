"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db, auth } from "../firebase/firebase"
import AnimalCard from "../components/AnimalCard"
import AnimalDetailModal from "../components/AnimalDetailModal"
import { FaArrowLeft } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import "../styles/favorites.css"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const navigate = useNavigate()
  const currentUser = auth.currentUser

  useEffect(() => {
    if (!currentUser) return

    const fetchFavorites = async () => {
      try {
        console.log("Fetching favorites for user:", currentUser.uid)
        const q = query(collection(db, "favorites"), where("userId", "==", currentUser.uid))

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            console.log("Favorites snapshot received, count:", snapshot.docs.length)
            const favoritesData = snapshot.docs.map((doc) => {
              const data = doc.data()
              console.log("Favorite item:", data.animalId)
              return {
                id: data.animalId,
                ...data.animalData,
                isFavorite: true,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
              }
            })

            setFavorites(favoritesData)
            setLoading(false)
          },
          (error) => {
            console.error("Error in favorites snapshot:", error)
            setLoading(false)
          },
        )

        return unsubscribe
      } catch (error) {
        console.error("Error setting up favorites listener:", error)
        setLoading(false)
        return () => {}
      }
    }

    fetchFavorites()
  }, [currentUser])

  const handleAnimalClick = (animal) => {
    setSelectedAnimal(animal)
  }

  const handleCloseModal = () => {
    setSelectedAnimal(null)
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown time"

    const now = new Date()
    const diffInSeconds = Math.floor((now - timestamp) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

    return new Date(timestamp).toLocaleDateString()
  }

  const formatAnimalType = (type) => {
    if (!type) return "Unknown"

    // Convert first letter to uppercase and the rest to lowercase
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <button className="back-to-dashboard" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>My Favorites</h1>
        <p>Animals you've saved</p>
      </div>

      {loading ? (
        <div className="favorites-loading">
          <div className="favorites-spinner"></div>
          <p>Loading your favorites...</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.length > 0 ? (
            favorites.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                currentUserId={currentUser?.uid}
                onClick={() => handleAnimalClick(animal)}
              />
            ))
          ) : (
            <div className="no-favorites">
              <h2>No favorites yet</h2>
              <p>Animals you save will appear here</p>
              <button className="browse-animals-button" onClick={() => navigate("/dashboard")}>
                Browse Animals
              </button>
            </div>
          )}
        </div>
      )}

      {selectedAnimal && (
        <AnimalDetailModal
          animal={selectedAnimal}
          onClose={handleCloseModal}
          isOwner={currentUser?.uid === selectedAnimal.userId}
          formatTimeAgo={formatTimeAgo}
          formatAnimalType={formatAnimalType}
          currentUserId={currentUser?.uid}
        />
      )}
    </div>
  )
}

