"use client"

import { useState, useEffect } from "react"
import { auth, googleProvider, facebookProvider } from "../firebase/firebase"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
} from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { FaGoogle, FaFacebook, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"
import "../styles/auth.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState("")
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

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Set the persistence based on rememberMe checkbox
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence

      // First set the persistence
      await setPersistence(auth, persistenceType)

      // Then sign in
      await signInWithEmailAndPassword(auth, email, password)

      // Successful login - redirect to dashboard
      navigate("/dashboard")
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setIsLoading(true)
    try {
      // Set the persistence based on rememberMe checkbox
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence
      await setPersistence(auth, persistenceType)

      await signInWithPopup(auth, googleProvider)
      // Successful login - redirect to dashboard
      navigate("/dashboard")
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setError("")
    setIsLoading(true)
    try {
      // Set the persistence based on rememberMe checkbox
      const persistenceType = rememberMe ? browserLocalPersistence : browserSessionPersistence
      await setPersistence(auth, persistenceType)

      await signInWithPopup(auth, facebookProvider)
      // Successful login - redirect to dashboard
      navigate("/dashboard")
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setResetError("")
    setResetLoading(true)

    try {
      await sendPasswordResetEmail(auth, resetEmail)
      setResetEmailSent(true)
      setResetLoading(false)
    } catch (error) {
      setResetError(error.message)
      setResetLoading(false)
    }
  }

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword)
    setResetEmail(email) // Pre-fill with the email from login form
    setResetEmailSent(false)
    setResetError("")
  }

  return (
    <div className="auth-page">
      <div className="auth-image-container">
        <img src="/img/signup-image.jpg" alt="Login" className="auth-image" />
        <div className="auth-image-overlay">
          <div className="auth-image-content">
            <h1>Welcome Back</h1>
            <p>Sign in to continue your journey with us</p>
          </div>
        </div>
      </div>

      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h1>Login</h1>
            <p>Please sign in to your account</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-social-buttons">
            <button className="auth-social-button google" onClick={handleGoogleLogin} disabled={isLoading}>
              <FaGoogle className="auth-social-icon" />
              <span>Continue with Google</span>
            </button>

            <button className="auth-social-button facebook" onClick={handleFacebookLogin} disabled={isLoading}>
              <FaFacebook className="auth-social-icon" />
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
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

            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <button type="button" onClick={toggleForgotPassword} className="auth-forgot">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="auth-submit-button" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <div className="auth-modal-header">
              <h2>Reset Password</h2>
              <button className="auth-modal-close" onClick={toggleForgotPassword}>
                &times;
              </button>
            </div>

            <div className="auth-modal-body">
              {resetEmailSent ? (
                <div className="auth-success">
                  <p>Password reset email sent! Check your inbox for further instructions.</p>
                  <button className="auth-submit-button" onClick={toggleForgotPassword}>
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <p>Enter your email address and we'll send you a link to reset your password.</p>

                  {resetError && <div className="auth-error">{resetError}</div>}

                  <div className="auth-input-group">
                    <div className="auth-input-icon">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      placeholder="Email address"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      disabled={resetLoading}
                      className="auth-input"
                    />
                  </div>

                  <button type="submit" className="auth-submit-button" disabled={resetLoading}>
                    {resetLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
