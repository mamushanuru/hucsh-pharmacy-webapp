/* eslint-disable react/no-unescaped-entities */
import "./contact.css";

const Contact = () => {
  return (
    <div className="jcontact-container">
      <section className="jhero-section">
        <h1>Get in Touch</h1>
        <p>We're here to assist you with any questions or concerns.</p>
      </section>

      <section className="jcontact-section">
        <div className="jcontact-info">
          <h2>Contact Information</h2>
          <ul>
            <li>
              <i className="jfas fa-map-marker-alt"></i>
              <span>Referral circle, Hawassa Ethiopia</span>
            </li>
            <li>
              <i className="jfas fa-phone-alt"></i>
              <span>+251 (952) 99-6982</span>
            </li>
            <li>
              <i className="jfas fa-envelope"></i>
              <span>info@hucsh.com</span>
            </li>
          </ul>
        </div>

        <div className="jcontact-form">
          <h2>Send Us a Message</h2>
          <form>
            <div className="jform-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="jform-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="jform-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit" className="jsubmit-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
