"use client"

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaComment, FaUserCircle, FaHeart } from "react-icons/fa";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";

export default function Navbar({ user, showProfileMenu, toggleProfileMenu, handleSignOut }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleProfileClick = () => {
    navigate("/dashboard/profile");
    if (showProfileMenu) {
      toggleProfileMenu();
    }
  };

  // Check for unread messages
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let count = 0;
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.unreadCount && data.unreadCount[user.uid] > 0) {
          count += data.unreadCount[user.uid];
        }
      });
      setUnreadMessages(count);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/dashboard">Janwar Mandi</Link>
        </div>

        <div className="navbar-links">
          <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>
            My Animals
          </Link>
          <Link to="/dashboard/favorites" className={`navbar-link ${isActive('/dashboard/favorites') ? 'active' : ''}`}>
            {/* <FaHeart className="navbar-link-icon" /> */}
             Favorites
          </Link>
          <Link 
            to="/dashboard/messages" 
            className={`navbar-link ${isActive('/dashboard/messages') ? 'active' : ''} ${unreadMessages > 0 ? 'has-unread' : ''}`}
          >
            {/* <FaComment className="navbar-link-icon" /> */}
             Messages
            {unreadMessages > 0 && <span className="unread-badge">{unreadMessages}</span>}
          </Link>
        </div>

        <div className="navbar-actions">
          <div className="navbar-profile">
            <button className="navbar-profile-button" onClick={toggleProfileMenu}>
              {user?.photoURL ? (
                <img src={user.photoURL || "/placeholder.svg"} alt="Profile" className="navbar-profile-image" />
              ) : (
                <div className="navbar-profile-avatar">
                  {user?.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </button>

            {showProfileMenu && (
              <div className="navbar-profile-menu">
                <div className="navbar-profile-header">
                  <div className="navbar-profile-info">
                    <p className="navbar-profile-name">{user?.displayName || "User"}</p>
                    <p className="navbar-profile-email">{user?.email}</p>
                  </div>
                </div>

                <div className="navbar-profile-menu-items">
                  <Link to="/dashboard/profile" className="navbar-profile-menu-item" onClick={handleProfileClick}>
                    <FaUserCircle className="navbar-profile-menu-icon" />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/dashboard/settings" className="navbar-profile-menu-item">
                    <FaCog className="navbar-profile-menu-icon" />
                    <span>Settings</span>
                  </Link>
                  <button onClick={handleSignOut} className="navbar-profile-menu-item navbar-profile-menu-item-button">
                    <FaSignOutAlt className="navbar-profile-menu-icon" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
