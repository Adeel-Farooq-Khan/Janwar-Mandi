import React from "react";
import "../styles/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-company">
          <div className="footer-logo">
            <img src="/img/logo.png" alt="Janwar Mandi Logo" />
            <h3>Janwar Mandi</h3>
          </div>
          <p className="company-tagline">Pakistan's #1 Marketplace for<br />Dairy & Qurbani Animals.</p>
          <p className="company-description">Find verified sellers and buy<br />with ease!</p>
        </div>

        {/* About Links */}
        <div className="footer-links">
          <h4>About Janwar Mandi</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Browse Animals</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-links">
          <h4>Categories</h4>
          <ul>
            <li><a href="#">Dairy Animals</a></li>
            <li><a href="#">Goats</a></li>
            <li><a href="#">Hens</a></li>
            <li><a href="#">Qurbani Animals</a></li>
            <li><a href="#">Farm Accessories</a></li>
            <li><a href="#">Business</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h4>Contact</h4>
          <ul>
            <li>
              <span className="contact-icon">📞</span>
              <a href="tel:+923114547723">+923114547723</a>
            </li>
            <li>
              <span className="contact-icon">✉️</span>
              <a href="mailto:ahmednayat096@gmail.com">ahmednayat096@gmail.com</a>
            </li>
            <li>
              <span className="contact-icon">📍</span>
              <span>Lahore, Pakistan</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media and App Downloads */}
      <div className="footer-social">
        <div className="social-icons">
          <a href="#" className="social-icon facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-icon twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="social-icon youtube">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="#" className="social-icon linkedin">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="#" className="social-icon instagram">
            <i className="fab fa-instagram"></i>
          </a>
        </div>

        <div className="app-downloads">
          <a href="#" className="app-download-btn">
            <img src="/img/google-play.png" alt="Get it on Google Play" />
          </a>
          <a href="#" className="app-download-btn">
            <img src="/img/apple.png" alt="Download on App Store" />
          </a>
        </div>

        <div className="language-location">
          <div className="language-selector">
            <span className="globe-icon">🌐</span>
            <span>English</span>
          </div>
          <div className="location-selector">
            <span className="location-icon">📍</span>
            <span>Lahore, Pakistan</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {currentYear} Janwar Mandi. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Accessibility</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}
