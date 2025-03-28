"use client"

import { useState } from "react"
import "../styles/categories-section.css"

export default function CategoriesSection() {
  const [activeDot, setActiveDot] = useState(0)

  const categories = [
    { name: "Dairy Cows", imgClass: "dairy-img", bgImage: "/img/card1.png" },
    { name: "Qurbani", imgClass: "qurbani-img", bgImage: "/img/card2.png" },
    { name: "Goats", imgClass: "goats-img", bgImage: "/img/card3.png" },
    { name: "Hens", imgClass: "hens-img", bgImage: "/img/card4.png" },
  ]

  return (
    <section className="categories-section">
      <h2 className="categories-heading">Browse Categories</h2>

      <div className="categories-container">
        <div className="nav-arrow arrow-left">❮</div>

        {categories.map((category, index) => (
          <div key={index} className="category-card">
            <div className="category-img" style={{ backgroundImage: `url('${category.bgImage}')` }}></div>
            <div className="category-name">{category.name}</div>
          </div>
        ))}

        <div className="nav-arrow arrow-right">❯</div>
      </div>

      <div className="pagination">
        {[0, 1, 2, 3].map((dot) => (
          <div key={dot} className={`dot ${activeDot === dot ? "active" : ""}`} onClick={() => setActiveDot(dot)}></div>
        ))}
      </div>
    </section>
  )
}