import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faClock } from '@fortawesome/free-solid-svg-icons';
import '../styles/LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <Navbar />
      
      {/* Coming Soon Section */}
      <section className="coming-soon-section">
        <div className="coming-soon-content">
          <div className="coming-soon-icon">
            <FontAwesomeIcon icon={faLock} className="lock-icon" />
            <FontAwesomeIcon icon={faClock} className="clock-icon" />
          </div>
          
          <h1>Login</h1>
          <h2>Coming Soon</h2>
          <p className="coming-soon-description">
            We're working hard to bring you a secure and user-friendly login system. 
            Soon you'll be able to access your account, manage your profile, and 
            stay connected with the Vasavi Seattle community.
          </p>
          
          <div className="features-preview">
            <h3>What's Coming:</h3>
            <ul className="features-list">
              <li>Secure user authentication</li>
              <li>Personal profile management</li>
              <li>Event registration and RSVPs</li>
              <li>Donation history and receipts</li>
              <li>Community updates and notifications</li>
            </ul>
          </div>
          
          <div className="back-to-home">
            <a href="/" className="home-link">
              ← Back to Home
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LoginPage;