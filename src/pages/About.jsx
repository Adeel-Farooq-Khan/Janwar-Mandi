import AppDownload from "../components/app-download";
import "../styles/AboutUS.css";

function AboutUS() {
  return (
    <>
      <section className="featured">
        <div className="banner-content">
          <div className="main-heading">
            <h1>
              <span className="highlight">About </span> US
            </h1>
          </div>
        </div>
      </section>
      <section className="aboutus-content">
        <h1 className="welcome-heading">Welcome To Janwar Mandi</h1>
        <p>
          Janwar Mandi is Pakistan’s leading online marketplace for dairy farm
          animals, qurbani livestock, and farm accessories. We connect buyers
          and sellers from across the country, making it easier than ever to
          find high-quality animals without the hassle of visiting physical
          markets. Our platform ensures reliable listings, verified sellers, and
          secure communication, giving you the confidence to choose the best
          livestock from the comfort of your home.
        </p>
        <p>
          At Janwar Mandi, we understand the importance of healthy and well-bred
          animals, whether it’s for daily dairy needs or for the sacred occasion
          of qurbani. That’s why we provide detailed animal profiles, including
          high-quality images, pricing, seller details, and direct contact
          options. No more long market visits – simply browse, compare, and
          connect with sellers instantly!
        </p>
        <h1>Our Mission</h1>
        <p>
          Our mission is to digitize the livestock industry in Pakistan,
          offering farmers, breeders, and buyers a seamless platform to trade.
          Whether you’re looking for cows, goats, camels, hens, or farm
          equipment, Janwar Mandi is your trusted partner in finding the best
          deals. Join us today and experience a smarter, faster, and more
          reliable way to buy and sell farm animals!
        </p>
      </section>
      <section className="whychose">
        <h1>
          Why Chose <span className="highlight">Janwar Mandi?</span>
        </h1>
        <p>
          At Janwar Mandi, we are revolutionizing the way people buy and sell
          farm animals in Pakistan. Whether you need a healthy dairy cow, a
          premium qurbani animal, or essential farm accessories, we provide a
          safe, convenient, and reliable platform for all your livestock needs.
          No more crowded markets or time-consuming searches—simply explore
          listings, compare options, and connect with sellers instantly.
        </p>
      </section>
      <div className="whyus">
        <img src="/img/whychose.png" alt="" />
      </div>
      <AppDownload />
    </>
  );
}

export default AboutUS;
