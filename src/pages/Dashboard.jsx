"use client"

import { useState, useEffect } from "react"
import { auth, db } from "../firebase/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore"
import { FaPlus, FaTimes, FaUpload, FaFilter } from "react-icons/fa"
import "../styles/dashboard.css"
import Navbar from "../components/Navbar"
import AnimalCard from "../components/AnimalCard"

export default function Dashboard() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddAnimalForm, setShowAddAnimalForm] = useState(false)
  const [animals, setAnimals] = useState([])
  const [filteredAnimals, setFilteredAnimals] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    type: "",
    location: "",
    color: "",
    age: "",
    weight: "",
    description: "",
    image: null,
    imageBase64: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingAnimalId, setEditingAnimalId] = useState(null)

  // Default categories as fallback
  const defaultCategories = [
    { value: "cow", label: "Cow" },
    { value: "dairy-cow", label: "Dairy Cow" },
    { value: "goat", label: "Goat" },
    { value: "camel", label: "Camel" },
    { value: "hen", label: "Hen" },
    { value: "ram", label: "Ram" },
    { value: "qurbani", label: "Qurbani" },
  ]

  useEffect(() => {
    // Fetch user data
    const currentUser = auth.currentUser
    setUser(currentUser)

    // Fetch categories first, then animals
    fetchCategories().then(() => {
      fetchAllAnimals()
    })

    // Add a small delay to show the loader animation
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  // Filter animals when category or animals list changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredAnimals(animals)
    } else {
      setFilteredAnimals(animals.filter((animal) => animal.type === selectedCategory))
    }
  }, [selectedCategory, animals])

  const fetchCategories = async () => {
    try {
      // Fetch categories from Firestore
      const categoriesRef = collection(db, "categories")
      const q = query(categoriesRef, orderBy("label", "asc"))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        console.log("No categories found, using defaults")
        setCategories([{ value: "all", label: "All Animals" }, ...defaultCategories])
        return
      }

      const categoriesList = []
      querySnapshot.forEach((doc) => {
        // Only include active categories
        if (doc.data().isActive !== false) {
          categoriesList.push({
            id: doc.id,
            ...doc.data(),
          })
        }
      })

      // Add "All Animals" option at the beginning
      setCategories([{ value: "all", label: "All Animals" }, ...categoriesList])
      console.log("Categories loaded:", categoriesList.length)
    } catch (error) {
      console.error("Error fetching categories:", error)
      // Fallback to default categories if there's an error
      setCategories([{ value: "all", label: "All Animals" }, ...defaultCategories])
    }
  }

  const fetchAllAnimals = async () => {
    try {
      // Use the correct collection name that matches your security rules
      const animalsRef = collection(db, "animalListings")

      // Get all animals, ordered by creation date (newest first)
      // Limit to 50 for performance
      const q = query(animalsRef, orderBy("createdAt", "desc"), limit(50))

      const querySnapshot = await getDocs(q)
      const animalsList = []

      querySnapshot.forEach((doc) => {
        animalsList.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      setAnimals(animalsList)
      console.log("Animals loaded:", animalsList.length)
    } catch (error) {
      console.error("Error fetching animals:", error)
      setError("Failed to load animals. Please try again later.")
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true) // Show loader while signing out
      await auth.signOut()
      // Redirect will be handled by your auth state listener
    } catch (error) {
      console.error("Error signing out:", error)
      setLoading(false)
    }
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const toggleAddAnimalForm = () => {
    setShowAddAnimalForm(!showAddAnimalForm)
    // Reset form data and messages when toggling
    if (!showAddAnimalForm) {
      // If we're not editing, reset the form
      if (!isEditing) {
        resetForm()
      }
    } else {
      // If we're closing the form, reset everything
      resetForm()
      setIsEditing(false)
      setEditingAnimalId(null)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      type: "",
      location: "",
      color: "",
      age: "",
      weight: "",
      description: "",
      image: null,
      imageBase64: "",
    })
    setError("")
    setSuccess("")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      setFormData({
        ...formData,
        image: file,
      })

      // Convert image to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result
        console.log("Image loaded, size:", Math.round(base64String.length / 1024), "KB")

        // Warn if image is too large for Firestore (approaching 1MB limit)
        if (base64String.length > 900000) {
          console.warn("Image is large, might cause issues with Firestore")
        }

        setFormData((prev) => ({
          ...prev,
          imageBase64: base64String,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditAnimal = (animal) => {
    // Set form data with animal details
    setFormData({
      title: animal.title || "",
      price: animal.price?.toString() || "",
      type: animal.type || "",
      location: animal.location || "",
      color: animal.color || "",
      age: animal.age || "",
      weight: animal.weight || "",
      description: animal.description || "",
      image: null,
      imageBase64: animal.imageBase64 || "",
    })

    // Set editing state
    setIsEditing(true)
    setEditingAnimalId(animal.id)

    // Show the form
    setShowAddAnimalForm(true)
  }

  const handleDeleteAnimal = async (animalId) => {
    try {
      // Verify the current user is the owner of the animal
      const animalToDelete = animals.find((animal) => animal.id === animalId)

      if (!animalToDelete) {
        throw new Error("Animal not found")
      }

      const currentUser = auth.currentUser

      if (!currentUser) {
        throw new Error("You must be logged in to delete an animal")
      }

      if (animalToDelete.userId !== currentUser.uid) {
        throw new Error("You can only delete your own listings")
      }

      // Confirm deletion
      if (!window.confirm("Are you sure you want to delete this animal listing?")) {
        return
      }

      // Delete the animal from Firestore
      await deleteDoc(doc(db, "animalListings", animalId))

      // Update the state
      setAnimals(animals.filter((animal) => animal.id !== animalId))

      // Show success message
      alert("Animal listing deleted successfully")
    } catch (error) {
      console.error("Error deleting animal:", error)
      alert(`Failed to delete animal listing: ${error.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate form
    if (!formData.title || !formData.price || !formData.type || !formData.location) {
      setError("Please fill in all required fields")
      return
    }

    if (!formData.imageBase64 && !isEditing) {
      setError("Please upload an image")
      return
    }

    // Validate price is a number
    if (isNaN(Number.parseFloat(formData.price))) {
      setError("Price must be a valid number")
      return
    }

    setIsSubmitting(true)

    try {
      const currentUser = auth.currentUser

      // Add this check before creating the animal document
      if (!currentUser) {
        setError("You must be logged in to add an animal")
        setIsSubmitting(false)
        return
      }

      // Check if image is too large (Firestore has a 1MB document size limit)
      const imageToStore = formData.imageBase64
      if (imageToStore && imageToStore.length > 900000) {
        // If image is too large, we'll need to resize or compress it
        // For now, let's just warn the user
        console.warn("Image is large, might cause issues with Firestore")
      }

      // Create animal data object
      const animalData = {
        title: formData.title,
        price: Number.parseFloat(formData.price),
        description: formData.description || "",
        location: formData.location,
        type: formData.type,
        color: formData.color || "",
        age: formData.age || "",
        weight: formData.weight || "",
        userId: currentUser.uid,
        userEmail: currentUser.email,
      }

      // Only include image if it's provided or changed
      if (formData.imageBase64) {
        animalData.imageBase64 = imageToStore
      }

      if (isEditing) {
        // Verify the current user is the owner of the animal
        const animalToEdit = animals.find((animal) => animal.id === editingAnimalId)

        if (animalToEdit && animalToEdit.userId !== currentUser.uid) {
          throw new Error("You can only edit your own listings")
        }

        // Update existing animal
        const animalRef = doc(db, "animalListings", editingAnimalId)

        // Add updated timestamp
        animalData.updatedAt = serverTimestamp()

        await updateDoc(animalRef, animalData)

        // Update the animal in the state
        setAnimals(animals.map((animal) => (animal.id === editingAnimalId ? { ...animal, ...animalData } : animal)))

        setSuccess("Animal updated successfully!")
      } else {
        // Add new animal
        animalData.createdAt = serverTimestamp()

        // Use the correct collection name that matches your security rules
        const docRef = await addDoc(collection(db, "animalListings"), animalData)

        // Add the new animal to the state with its ID
        setAnimals((prevAnimals) => [
          {
            id: docRef.id,
            ...animalData,
            createdAt: { toDate: () => new Date() }, // Temporary timestamp for UI
          },
          ...prevAnimals,
        ])

        setSuccess("Animal added successfully!")
      }

      // Reset form
      resetForm()

      // Close form after a delay
      setTimeout(() => {
        setShowAddAnimalForm(false)
        setSuccess("")
        setIsEditing(false)
        setEditingAnimalId(null)
      }, 2000)
    } catch (error) {
      console.error("Error saving animal:", error)
      // More detailed error message
      setError(`Failed to ${isEditing ? "update" : "add"} animal: ${error.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Simple loader component
  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-spinner"></div>
        <div className="loader-text">Loading</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <Navbar
        user={user}
        showProfileMenu={showProfileMenu}
        toggleProfileMenu={toggleProfileMenu}
        handleSignOut={handleSignOut}
      />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Animal Marketplace</h1>
          <button className="add-animal-button" onClick={toggleAddAnimalForm}>
            <FaPlus /> Add Animal
          </button>
        </div>

        <div className="dashboard-filters">
          <div className="filter-group">
            <label htmlFor="category-filter">
              <FaFilter className="filter-icon" /> Filter by Category:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && !showAddAnimalForm && <div className="dashboard-error">{error}</div>}

        {showAddAnimalForm && (
          <div className="add-animal-overlay">
            <div className="add-animal-form-container">
              <div className="add-animal-form-header">
                <h2>{isEditing ? "Edit Animal" : "Add New Animal"}</h2>
                <button className="close-form-button" onClick={toggleAddAnimalForm}>
                  <FaTimes />
                </button>
              </div>

              {error && <div className="form-error">{error}</div>}
              {success && <div className="form-success">{success}</div>}

              <form onSubmit={handleSubmit} className="add-animal-form">
                <div className="form-group">
                  <label>Upload Photo{!isEditing && "*"}</label>
                  <div className="image-upload-container">
                    {formData.imageBase64 ? (
                      <div className="image-preview-container">
                        <img src={formData.imageBase64 || "/placeholder.svg"} alt="Preview" className="image-preview" />
                        <button
                          type="button"
                          className="remove-image-button"
                          onClick={() => setFormData({ ...formData, image: null, imageBase64: "" })}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <FaUpload />
                        <span>Click to upload</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                      </div>
                    )}
                  </div>
                  <small>Max size: 5MB {isEditing && "(Leave unchanged to keep current image)"}</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Healthy Dairy Cow"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Price (PKR)*</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g. 50000"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Animal Type*</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} required>
                      <option value="">Select Type</option>
                      {categories
                        .filter((category) => category.value !== "all")
                        .map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Location*</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, Province"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="e.g. Black & White"
                    />
                  </div>

                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="e.g. 3 years"
                    />
                  </div>

                  <div className="form-group">
                    <label>Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="e.g. 400 kg"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about the animal..."
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={toggleAddAnimalForm}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting
                      ? isEditing
                        ? "Updating..."
                        : "Adding..."
                      : isEditing
                        ? "Update Animal"
                        : "Add Animal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="animals-grid">
          {filteredAnimals.length > 0 ? (
            filteredAnimals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                currentUserId={user?.uid}
                onEdit={handleEditAnimal}
                onDelete={handleDeleteAnimal}
              />
            ))
          ) : (
            <div className="no-animals">
              {selectedCategory !== "all" ? (
                <p>No animals found in this category. Try a different category or add a new animal.</p>
              ) : (
                <p>No animals found. Be the first to add an animal!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
