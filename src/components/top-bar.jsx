import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "../styles/top-bar.css";

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="download-app">
        <span>📱</span>
        Download App via SMS
      </div>
      <div className="auth-buttons">
      <Link to="/signup">Sign Up</Link>
      <Link to="/login">Sign In</Link>
      </div>
    </div>
  )
}

