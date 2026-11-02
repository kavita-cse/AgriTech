import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="about" className="bg-forest text-light pt-5 pb-4 border-top border-success border-opacity-25">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand & Purpose */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center text-white fw-bold fs-4 mb-3">
              <span className="me-2 d-inline-flex align-items-center justify-content-center bg-white text-forest rounded-circle" style={{ width: '36px', height: '36px' }}>
                <i className="bi bi-sprout-fill"></i>
              </span>
              <span>Agri<span className="text-mint">Tech</span></span>
            </div>
            <p className="text-light text-opacity-75 small mb-3 lh-base">
              Empowering agricultural communities through accessible digital technology. 
              Bridging farm management, indicative soil science, micro-weather advisories, 
              and single-seller marketplace integrity.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-white bg-opacity-10 text-light py-2 px-3 rounded-pill small">
                MERN Stack Platform
              </span>
              <span className="badge bg-white bg-opacity-10 text-light py-2 px-3 rounded-pill small">
                Architecture v2.3
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Platform</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <a href="#features" className="text-light text-opacity-75 text-decoration-none hover-white" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
                  Crop Monitoring
                </a>
              </li>
              <li>
                <a href="#features" className="text-light text-opacity-75 text-decoration-none" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
                  Soil Health Analysis
                </a>
              </li>
              <li>
                <a href="#features" className="text-light text-opacity-75 text-decoration-none" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
                  Weather Forecasts
                </a>
              </li>
              <li>
                <a href="#marketplace" className="text-light text-opacity-75 text-decoration-none" onClick={(e) => { e.preventDefault(); scrollToSection('marketplace'); }}>
                  Agri Marketplace
                </a>
              </li>
            </ul>
          </div>

          {/* Knowledge & Community */}
          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Knowledge & Roles</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li>
                <a href="#experts" className="text-light text-opacity-75 text-decoration-none" onClick={(e) => { e.preventDefault(); scrollToSection('experts'); }}>
                  Expert Consultation
                </a>
              </li>
              <li>
                <a href="#features" className="text-light text-opacity-75 text-decoration-none" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
                  Community Forum
                </a>
              </li>
              <li>
                <Link to="/register" className="text-light text-opacity-75 text-decoration-none">
                  Farmer Registration
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-light text-opacity-75 text-decoration-none">
                  Expert Accreditation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support Placeholder */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3">Support & Offices</h6>
            <p className="text-light text-opacity-75 small mb-2">
              <i className="bi bi-geo-alt-fill me-2 text-mint"></i>
              Agricultural Technology Hub, Maharashtra, India
            </p>
            <p className="text-light text-opacity-75 small mb-2">
              <i className="bi bi-envelope-fill me-2 text-mint"></i>
              support@agritech-platform.org
            </p>
            <p className="text-light text-opacity-75 small mb-0">
              <i className="bi bi-clock-fill me-2 text-mint"></i>
              Mon - Sat: 8:00 AM - 6:00 PM IST
            </p>
          </div>
        </div>

        {/* Mandatory Advisory Disclaimer Notice (Consistent with Architecture v2.3) */}
        <div className="p-3 rounded-3 bg-dark bg-opacity-50 border border-success border-opacity-25 mb-4">
          <small className="text-light text-opacity-75 d-block" style={{ fontSize: '0.78rem' }}>
            <strong className="text-warning"><i className="bi bi-exclamation-triangle-fill me-1"></i> Indicative Advisory Notice:</strong> Soil analysis recommendations and automated weather advisories provided by AgriTech are indicative, rule-based guidances intended for educational and preliminary planning purposes. They do not constitute certified diagnostic laboratory tests or commercial agronomy certifications. Farmers should verify critical fertilizer amendments with certified local agronomists.
          </small>
        </div>

        {/* Copyright */}
        <div className="pt-3 border-top border-white border-opacity-10 d-flex flex-column flex-md-row align-items-center justify-content-between small text-light text-opacity-50">
          <div>
            &copy; 2026 AgriTech – Empowering Farmers Through Digital Technology. All rights reserved.
          </div>
          <div className="mt-2 mt-md-0 d-flex gap-3">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Framework</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

