import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="section-padding bg-forest-gradient text-white position-relative overflow-hidden">
      <div className="container position-relative z-1 py-3">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <span className="badge rounded-pill bg-white text-forest px-3 py-2 fw-bold mb-3 d-inline-block">
              Modernize Your Farm Today
            </span>
            <h2 className="display-5 fw-bold mb-3 text-white">
              Ready to Maximize Yields and Farm Smarter?
            </h2>
            <p className="lead text-light text-opacity-75 mb-4 fs-5 mx-auto" style={{ maxWidth: '640px' }}>
              Join thousands of farmers leveraging digital soil intelligence, reliable micro-weather alerts, 
              and fair marketplace pricing. Free registration for all farmers.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link to="/register" className="btn btn-agri-light btn-lg shadow">
                <i className="bi bi-person-check-fill me-2"></i> Join AgriTech Free
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg rounded-pill px-4">
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

