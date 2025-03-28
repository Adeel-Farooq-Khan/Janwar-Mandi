"use client"

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { auth } from "../firebase/firebase"
import { onAuthStateChanged } from "firebase/auth"
import "../styles/loading.css"

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {

    return <>
    
    <div className="loading-container">Loading...</div><div className="loader-overlay">
    <div className="loader-spinner"></div>
    <div className="loader-text">Loading</div>
  </div>
    </>
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

