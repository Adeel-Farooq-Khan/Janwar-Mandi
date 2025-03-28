import { useState, useEffect } from "react";
import { auth, googleProvider, facebookProvider } from "../firebase/firebase";
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/auth.css"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already signed in, redirect to dashboard
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Successful login - redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // Successful login - redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signInWithPopup(auth, facebookProvider);
      // Successful login - redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-image-container">
        <img 
          src="/img/signup-image.jpg" 
          alt="Login" 
          className="auth-image" 
        />
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
            <button 
              className="auth-social-button google" 
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FaGoogle className="auth-social-icon" />
              <span>Continue with Google</span>
            </button>
            
            <button 
              className="auth-social-button facebook" 
              onClick={handleFacebookLogin}
              disabled={isLoading}
            >
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
              <button 
                type="button" 
                onClick={togglePasswordVisibility} 
                className="auth-password-toggle"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
            </div>
            
            <button 
              type="submit" 
              className="auth-submit-button" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
