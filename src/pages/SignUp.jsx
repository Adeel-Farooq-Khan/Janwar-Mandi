"use client"

import { useState, useEffect } from "react"
import { auth, googleProvider, facebookProvider } from "../firebase/firebase"
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile, onAuthStateChanged } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { FaGoogle, FaFacebook, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa"
import "../styles/auth.css"

export default function Signup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already signed in, redirect to dashboard
        navigate("/dashboard")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with display name
      if (fullName) {
        await updateProfile(userCredential.user, {
          displayName: fullName,
        })
      }

      // Successful signup - redirect to dashboard
      navigate("/dashboard")
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError("")
    setIsLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      // Successful signup - redirect to dashboard
      navigate("/dashboard")
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const handleFacebookSignup = async () => {
    setError("")
    setIsLoading(true)
    try {
      await signInWithPopup(auth, facebookProvider)
      // Successful signup - redirect to dashboard
      navigate("/dashboard")
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="auth-page">
      <div className="auth-image-container">
        <img src="/img/signup-image.jpg" alt="Sign up" className="auth-image" />
        <div className="auth-image-overlay">
          <div className="auth-image-content">
            <h1>Join Our Community</h1>
            <p>Create an account to get started</p>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Sign up to get started</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-social-buttons">
            <button className="auth-social-button google" onClick={handleGoogleSignup} disabled={isLoading}>
              <FaGoogle className="auth-social-icon" />
              <span>Continue with Google</span>
            </button>

            <button className="auth-social-button facebook" onClick={handleFacebookSignup} disabled={isLoading}>
              <FaFacebook className="auth-social-icon" />
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <form onSubmit={handleSignup} className="auth-form">
            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FaUser />
              </div>
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isLoading}
                className="auth-input"
              />
            </div>

            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FaEnvelope />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="auth-input"
              />
            </div>

            <div className="auth-input-group">
              <div className="auth-input-icon">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="auth-input"
              />
              <button type="button" onClick={togglePasswordVisibility} className="auth-password-toggle">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="auth-terms">
              <label className="auth-checkbox">
                <input type="checkbox" required />
                <span>
                  I agree to the{" "}
                  <Link to="/terms" className="auth-link">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="auth-link">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button type="submit" className="auth-submit-button" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

