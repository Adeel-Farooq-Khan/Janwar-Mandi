import "../styles/app-download.css"

export default function AppDownload() {
  return (
    <section className="app-download">
      <div className="app-info">
        <h2>Get The Janwar Mandi App</h2>
        <p>The easiest way to browse, compare, and contact sellers for Dairy & Qurbani Animals - all in one app!</p>

        <div className="app-store-buttons">
          <a href="#" className="play-store">
            <img src="/img/google-play.png" alt="Download on Google Play" />
          </a>
          <a href="#" className="app-store">
            <img src="/img/apple.png" alt="Download on App Store" />
          </a>
        </div>
      </div>

      <div className="qr-section">
        <div className="qr-code">
          <img src="/img/qr code.png" alt="QR Code" />
        </div>
        <p>
          Scan the QR
          <br />
          to get the App
        </p>
      </div>

      <div className="phone-mockup">
        <img src="/img/app mockup.jpg" alt="Janwar Mandi App Mockup" />
      </div>
    </section>
  )
}

