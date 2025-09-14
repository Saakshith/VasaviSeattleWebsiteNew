import React, { useState } from 'react';
// import { Menu, X, Home, Info, Calendar, DollarSign, Phone } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faHome, faInfo, faCalendar, faDollarSign, faPhone } from '@fortawesome/free-solid-svg-icons';
import '../styles/Navbar.css';
import logo from '../images/vasaviseattle_logo.webp'
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

  const navItems = [
    { name: 'Home', href: '/', icon: faHome },
    { name: 'About', href: '#about', icon: faInfo },
    { name: 'Events', href: '/events', icon: faCalendar },
    { name: 'Financials', href: '/financials', icon: faDollarSign },
    { name: 'Contact Us', href: '/contact', icon: faPhone },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img 
              src={logo}
              alt="Vasavi Seattle Logo" 
              className="logo-image"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav-desktop">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="nav-link"
                onClick={(e) => {
                  if (item.href.startsWith('#')) {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }
                }}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Sign In Button and Mobile Menu Toggle */}
          <div className="navbar-controls">
            <Link to="/login"><button className="signin-btn">
              Sign In
            </button></Link>
            
            <button
              onClick={toggleMenu}
              className="menu-toggle"
            >
              {isMenuOpen ? (
                <FontAwesomeIcon icon={faXmark} className="menu-icon" />
              ) : (
                <FontAwesomeIcon icon={faBars} className="menu-icon" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="mobile-menu-content">
                      {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="mobile-nav-link"
              onClick={(e) => {
                setIsMenuOpen(false);
                if (item.href.startsWith('#')) {
                  e.preventDefault();
                  scrollToSection(item.href);
                }
              }}
            >
              <FontAwesomeIcon icon={item.icon} className="mobile-nav-icon" />
              <span>{item.name}</span>
            </a>
          ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;