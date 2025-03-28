import { Button } from "./ui/button"
import "../styles/featured-banner.css"

export default function FeaturedBanner() {
  return (
    <section className="featured-banner">
      <div className="banner-content">
        <div className="main-heading">
          <h1>
            Pakistan's #1 Marketplace <br />
            for <span className="highlight">Dairy & Qurbani Animals!</span>
          </h1>
        </div>

        <div className="trust-badges">
          <span>Verified Sellers</span>
          <span className="divider">|</span>
          <span>Best Prices</span>
          <span className="divider">|</span>
          <span>Direct Contact</span>
        </div>

        <div className="signup-section">
          <Button className="signup-btn">FREE SIGNUP</Button>

          <div className="urdu-text">
            <p>اگر آپ سائن اپ نہیں کر سکتے</p>
            <p>اپنے مویشی کے معلومات ہمیں Whatsapp کریں اور</p>
            <p>ہم اپ ک لئے اپ لوڈ کریں گے</p>
          </div>

          <div className="phone-number">
            <a href="tel:+923114547723">+923114547723</a>
          </div>
        </div>
      </div>
    </section>
  )
}

