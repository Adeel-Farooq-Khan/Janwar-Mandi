import { Button } from "./ui/button"
import "../styles/hero-section.css"

export default function HeroSection() {
  return (
    <>
     
      <div className="hero-background"></div>
      
      <section className="hero">
        <h1>
          Pakistan's #1 Marketplace for Dairy Farm Animals
        </h1>
        <p>
          Buy & explore a wide range of Dairy Animals, Qurbani Janwar, Goats, Hens, and Farm Accessories
        </p>
        
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for Animals, Categories, or Locations..."
          />
          <Button className="search-btn">
            Search
          </Button>
        </div>
        
        <Button className="contact-seller">
          Contact a Seller
        </Button>
      </section>
    </>
  );
}
