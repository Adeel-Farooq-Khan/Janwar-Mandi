import AppDownload from "../components/app-download";
import "../styles/ContactUs.css";

function ContactUs() {
  return (
    <>
      <h1>
        <span className="green">Contact </span>
        <span className="highlight">Us</span>
      </h1>
      <section className="contactform">
        <form className="contact">
          <h3>Your Details</h3>
          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email Address" />
          <input type="tel" placeholder="Phone Number" />
          <input type="text" placeholder="Enter Your Message" className="message"/>
          <button type="submit">Send Message</button>
        </form>
        <div className="contactinfo">
          <div className="firstbox">
            <h2>Feel free to drop by or call to say Hello!</h2>
            <h3>Address</h3>
            <p>
              Saeed Alam Tower, 37-Commercial Zone <br />
              Liberty Market, Gulberg, Lahore, Pakistan.
            </p>
            <h3>Contact Information</h3>
            <p>Phone: 042 - 111 WHEELS (042 - 111 943 357)</p>
            <p>Email: customersupport@pakeventures.com</p>
            <p>Find anything about Dairy Farm only on janwarmandi.com</p>
          </div>
          <div className="secondboxes">
            <div className="phoneno">
              <i class="fa-solid fa-phone"></i>
              <h3>Phone Number</h3>
              <p>+923114547723</p>
            </div>
            <div className="whatsapp">
              <i class="fa-brands fa-whatsapp"></i>
              <h3>Whatsapp</h3>
              <p>+923114547723</p>
            </div>
          </div>
        </div>
      </section>
      <AppDownload />
    </>
  );
}

export default ContactUs;
