import "bootstrap/dist/css/bootstrap.min.css";
import './footer.css';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <h5 className="footer-heading">About Us</h5>
            <p className="footer-text">
              <strong>We are a leading hospital service provider, committed to
              delivering high-quality healthcare to our community.</strong> 
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/service" className="footer-link">Services</Link></li>
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h5 className="footer-heading">Contact Us</h5>
            <p className="footer-text">
              Referral Circle, Hawassa Ethiopia<br />
              Phone: (+251) 9 -529-969-82<br />
              Email: hucsh@hucsh.com
            </p>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Footer Bottom with Developer */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 HUCSH Service System. All rights reserved.
          </p>
          <Link to="/developer" className="developer-link">
            💻 Meet the Developer
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
