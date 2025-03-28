"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase/firebase"

export default function AuthRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    // Set up an auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        navigate("/dashboard")
      } else {
        // User is signed out, redirect to login
        navigate("/login")
      }
    })

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [navigate])

  return null // This component doesn't render anything
}

