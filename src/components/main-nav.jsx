import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import "../styles/main-nav.css";

export default function MainNav() {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".main-nav") && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <nav className="main-nav">
      {/* Logo */}
      <NavLink to="/">
        <img src="/img/logo.png" alt="JM Logo" className="logo" />
      </NavLink>

      {/* Hamburger Menu */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/aboutus" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsOpen(false)}>
          About Us
        </NavLink>
        <NavLink to="/contactus" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsOpen(false)}>
          Contact Us
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsOpen(false)}>
          All Categories  
        </NavLink>
        <NavLink to="/privacy" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsOpen(false)}>
          Privacy Policy
        </NavLink>
        <NavLink to="/terms" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsOpen(false)}>
          Terms & Conditions
        </NavLink>
        <NavLink to="/services" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={() => setIsOpen(false)}>
          Services
        </NavLink>
      </div>

      {/* Explore Button */}
      <Button className="explore-btn">Explore Animals</Button>
    </nav>
  );
}
