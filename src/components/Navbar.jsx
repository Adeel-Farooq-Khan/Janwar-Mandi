"use client"

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaCog, FaSignOutAlt, FaBell, FaComment, FaUserCircle } from "react-icons/fa";

export default function Navbar({ user, showProfileMenu, toggleProfileMenu, handleSignOut }) {
  const location = useLocation();
  const navigate = useNavigate();
  
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
          <Link to="/dashboard/messages" className={`navbar-link ${isActive('/dashboard/messages') ? 'active' : ''}`}>
            Messages
          </Link>
          <Link to="/dashboard/favorites" className={`navbar-link ${isActive('/dashboard/favorites') ? 'active' : ''}`}>
            Favorites
          </Link>
          <Link to="/dashboard/settings" className={`navbar-link ${isActive('/dashboard/settings') ? 'active' : ''}`}>
            Settings
          </Link>
        </div>

        <div className="navbar-actions">
          <Link to="/dashboard/messages" className="navbar-icon-button">
            <FaComment />
            {/* You can add a notification badge here if there are unread messages */}
          </Link>
          
          <button className="navbar-icon-button">
            <FaBell />
            <span className="navbar-notification-badge">3</span>
          </button>

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