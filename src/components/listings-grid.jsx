import "../styles/listings-grid.css"

export default function ListingsGrid() {
  const listings = [
    { image: "/img/goat.png", price: "Rs: 45,000", age: "8d Ago", weight: "20kg", location: "Lahore, Pakistan" },
    { image: "/img/brownhen.png", price: "Rs: 10,000", age: "1d Ago", weight: "3kg", location: "Lahore, Pakistan" },
    {
      image: "/img/brownbull.png",
      price: "Rs: 4,00000",
      age: "2d Ago",
      weight: "100kg",
      location: "Peshawar, Pakistan",
    },
    { image: "/img/camel.png", price: "Rs: 3,00000", age: "5d Ago", weight: "80kg", location: "Lahore, Pakistan" },
    { image: "/img/white goat.png", price: "Rs: 55,000", age: "1d Ago", weight: "37kg", location: "Karachi, Pakistan" },
    { image: "/img/male hen.png", price: "Rs: 10,000", age: "5d Ago", weight: "3.5kg", location: "Multan, Pakistan" },
    {
      image: "/img/white bull.png",
      price: "Rs: 4,00000",
      age: "3d Ago",
      weight: "80kg",
      location: "Karachi, Pakistan",
    },
    {
      image: "/img/white cow.png",
      price: "Rs: 4,00000",
      age: "8d Ago",
      weight: "120kg",
      location: "Sahiwal, Pakistan",
    },
    { image: "/img/white hen.png", price: "Rs: 10,000", age: "8d Ago", weight: "3kg", location: "Lahore, Pakistan" },
    {
      image: "/img/pindi camel.png",
      price: "Rs: 250,000",
      age: "8d Ago",
      weight: "95kg",
      location: "Rawalpindi, Pakistan",
    },
    {
      image: "/img/black goat.png",
      price: "Rs: 70,000",
      age: "8d Ago",
      weight: "38kg",
      location: "Faisalabad, Pakistan",
    },
    { image: "/img/lhr cow.png", price: "Rs: 190,000", age: "9d Ago", weight: "75kg", location: "Lahore, Pakistan" },
  ]

  return (
    <section className="explore-categories">
      <h2 className="section-heading">Explore All Categories</h2>

      <div className="listings-grid">
        {listings.map((item, index) => (
          <div key={index} className="listing-card">
            <div className="listing-image">
              <img src={item.image || "/placeholder.svg"} alt="Animal listing" />
            </div>
            <div className="listing-details">
              <div className="listing-price">{item.price}</div>
              <div className="listing-age">{item.age}</div>
            </div>
            <div className="listing-specs">
              <div className="listing-weight">
                <span className="icon">⚖️</span>
                <span>{item.weight}</span>
              </div>
              <div className="listing-location">
                <span className="icon">📍</span>
                <span>{item.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

