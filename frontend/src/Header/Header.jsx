import { Link } from "react-router-dom";
import logo from "../assets/images/the hu logo.png";
import { useAuth } from "../../src/Contexts/AuthContext";
import { useState } from "react";
import "./header.css";
import WelcomeMessage from "./dateTeller";

function Header() {
  const { isLogged, employee, user } = useAuth(); // Subscribe to AuthContext
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logOut = async () => {
    try {
      localStorage.removeItem("user_token");
      localStorage.removeItem("employee_token");
      window.location.href = "/login"; // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header-container">
      {/* Top Header Section */}
      <div className="header-top">
        <div className="header-top-content">
          <div className="header-top-left">
            <div className="header-top-text">
              Bridging the Gap in Medical Information with HUCSH!
            </div>
            <div className="header-top-hours">24/7 Service</div>
          </div>
          <div className="header-top-right">
            {isLogged ? (
              <div className="welcome-message">
                Welcome {employee?.employee_first_name || user?.user_first_name}! 👋
              </div>
            ) : (
              <div className="welcome-message">
                <WelcomeMessage />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Section */}
      <div className="header-main">
        <div className="header-main-content">
          {/* Logo */}
          <div className="header-logo">
            <Link to="/">
              <img
                src={logo}
                alt="HUCSH Logo"
                width="100"
                height="100"
                loading="lazy"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="header-nav" aria-label="Main navigation">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </nav>

          {/* Login/Logout Button */}
          <div className="header-auth">
            {isLogged ? (
              <button
                className="auth-button logout"
                onClick={logOut}
                aria-label="Log out"
              >
                Log out
              </button>
            ) : (
              <Link to="/login" className="auth-button login">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggler */}
          <div
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`mobile-dropdown ${isMobileMenuOpen ? "open" : ""}`}
        aria-hidden={!isMobileMenuOpen}
        tabIndex={isMobileMenuOpen ? 0 : -1}
      >
        <button
          className="close-button"
          onClick={toggleMobileMenu}
          aria-label="Close menu"
        >
          &times;
        </button>
        <ul className="mobile-nav-list">
          <li className="mobile-nav-item">
            <Link to="/" onClick={toggleMobileMenu}>
              Home
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/about" onClick={toggleMobileMenu}>
              About Us
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/services" onClick={toggleMobileMenu}>
              Services
            </Link>
          </li>
          <li className="mobile-nav-item">
            <Link to="/contact" onClick={toggleMobileMenu}>
              Contact Us
            </Link>
          </li>
          <li className="mobile-nav-item">
            {isLogged ? (
              <button
                className="auth-button logout"
                onClick={logOut}
                aria-label="Log out"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="auth-button login"
                onClick={toggleMobileMenu}
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;