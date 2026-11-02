import React from 'react';
import { Link } from 'react-router-dom';

const AuthHeader = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-4">
      {/* AgriTech Brand Logo */}
      <Link
        to="/"
        className="d-inline-flex align-items-center text-forest text-decoration-none fw-bold fs-3 mb-2"
        title="Return to AgriTech Home"
      >
        <span
          className="me-2 d-inline-flex align-items-center justify-content-center bg-forest text-white rounded-circle shadow-sm"
          style={{ width: '42px', height: '42px' }}
        >
          <i className="bi bi-sprout-fill fs-5"></i>
        </span>
        <span>
          Agri<span className="text-mint">Tech</span>
        </span>
      </Link>

      <h1 className="h4 text-forest fw-bold mb-1">{title}</h1>
      {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
    </div>
  );
};

export default AuthHeader;

