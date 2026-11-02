import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const scrollToSection = (sectionId) => {
    setIsNavCollapsed(true);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top agri-navbar py-3 shadow-sm">
      <div className="container">
        {/* Brand Logo & Name */}
        <Link to="/" className="navbar-brand d-flex align-items-center text-forest fw-bold fs-4">
          <span className="me-2 d-inline-flex align-items-center justify-content-center bg-forest text-white rounded-circle" style={{ width: '38px', height: '38px' }}>
            <i className="bi bi-sprout-fill"></i>
          </span>
          <span>Agri<span className="text-mint">Tech</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#agriNavbarContent"
          aria-controls="agriNavbarContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <i className="bi bi-list fs-2 text-forest"></i>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="agriNavbarContent">
          <ul className="navbar-navbar navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link agri-nav-link" href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link agri-nav-link" href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link agri-nav-link" href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>
                How It Works
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link agri-nav-link" href="#marketplace" onClick={(e) => { e.preventDefault(); scrollToSection('marketplace'); }}>
                Marketplace
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link agri-nav-link" href="#experts" onClick={(e) => { e.preventDefault(); scrollToSection('experts'); }}>
                Experts
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link agri-nav-link" href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>
                About
              </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link agri-nav-link text-success fw-semibold" to="/dashboard">
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </Link>
            </li>
          </ul>

          {/* Action CTAs */}
          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            <Link to="/login" className="btn btn-outline-success px-4 py-2 rounded-pill fw-semibold border-2">
              Log In
            </Link>
            <Link to="/register" className="btn btn-agri-primary">
              Register Free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

