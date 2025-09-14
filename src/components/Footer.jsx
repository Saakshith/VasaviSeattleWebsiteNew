import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faYoutube, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import logo from '../images/vasaviseattle_logo.webp';

const Footer = () => {
  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left Column - Organization Information */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="Vasavi Seattle Logo" className="footer-logo-image" />
          </div>
          <h3 className="organization-name">Vasavi Seattle</h3>
          <div className="tax-info">
            <p>Tax Code: 8804324038-7CE</p>
            <p>501(c)3</p>
          </div>
        </div>

        {/* Middle Column - Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li>
              <a 
                href="#about" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#about');
                }}
                className="footer-link"
              >
                About
              </a>
            </li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/financials">Financials</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Right Column - Contact Information */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact</h4>
          <div className="contact-info">
            <a href="mailto:seattlevasavi@gmail.com" className="contact-link">
              seattlevasavi@gmail.com
            </a>
            <p className="phone-number">123-456-7890</p>
            <div className="social-media">
              <a href="/" className="social-link">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="/" className="social-link">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="/" className="social-link">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="/" className="social-link">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="footer-bottom">
        <div className="copyright">
          © Vasavi Seattle 2025
        </div>
        <div className="copyright">
          Pixel Hatchery Web Solutions | Saakshith Chikoti
        </div>
        <div className="footer-bottom-right">
          <Link to="/privacy" className="privacy-link">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;