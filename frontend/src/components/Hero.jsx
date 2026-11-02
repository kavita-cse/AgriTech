import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="position-relative pt-5 pb-5 overflow-hidden bg-soft-gradient" style={{ marginTop: '72px' }}>
      <div className="container py-lg-5 py-4">
        <div className="row align-items-center g-5">
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="col-lg-6 text-center text-lg-start">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill bg-light-mint border border-success border-opacity-25">
              <span className="badge rounded-pill bg-forest text-white px-2 py-1">New</span>
              <span className="small fw-semibold text-forest">Digital Agriculture Ecosystem 2.0</span>
            </div>

            <h1 className="display-4 text-forest fw-bold mb-3 lh-sm">
              Empowering Farmers Through <span className="text-mint">Digital Technology</span>
            </h1>

            <p className="lead text-muted mb-4 fs-5 pe-lg-4">
              Consolidating real-time weather analytics, indicative soil nutrient balancing, 
              lifecycle crop monitoring, and a fair agricultural marketplace into a single, accessible platform.
            </p>

            {/* CTAs */}
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mb-4">
              <Link to="/register" className="btn btn-agri-primary btn-lg shadow-sm">
                <i className="bi bi-person-plus-fill me-2"></i> Get Started
              </Link>
              <button
                type="button"
                className="btn btn-agri-outline btn-lg"
                onClick={() => scrollToSection('features')}
              >
                <i className="bi bi-grid-fill me-2"></i> Explore Features
              </button>
            </div>

            {/* Platform Highlights Metrics */}
            <div className="row g-3 pt-3 border-top border-secondary border-opacity-10 text-start">
              <div className="col-4">
                <div className="fw-bold fs-4 text-forest">10,000+</div>
                <div className="small text-muted">Acres Monitored</div>
              </div>
              <div className="col-4">
                <div className="fw-bold fs-4 text-forest">100%</div>
                <div className="small text-muted">Direct Marketplace</div>
              </div>
              <div className="col-4">
                <div className="fw-bold fs-4 text-forest">Verified</div>
                <div className="small text-muted">Agronomist Network</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual & Interactive Badge */}
          <div className="col-lg-6">
            <div className="position-relative mx-auto" style={{ maxWidth: '520px' }}>
              {/* Main Image */}
              <div className="rounded-4 overflow-hidden shadow-lg border border-success border-opacity-25 position-relative">
                <img
                  src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80"
                  alt="Modern farmer inspecting thriving crops with digital tools"
                  className="img-fluid w-100"
                  style={{ minHeight: '380px', maxHeight: '460px', objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-50 text-white backdrop-blur">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <small className="text-light text-opacity-75 d-block">Real-Time Field Advisory</small>
                      <strong className="fs-6">Nashik District • Wheat Cycle Active</strong>
                    </div>
                    <span className="badge bg-success bg-opacity-75">Optimal Stage</span>
                  </div>
                </div>
              </div>

              {/* Floating Stat Card 1: Soil Health Indicator */}
              <div
                className="floating-stat-badge d-none d-md-flex align-items-center gap-3"
                style={{ top: '8%', left: '-8%' }}
              >
                <div className="bg-light-mint text-forest p-2 rounded-circle fs-4 d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px' }}>
                  <i className="bi bi-moisture"></i>
                </div>
                <div>
                  <small className="text-muted d-block fw-semibold">Soil pH Balance</small>
                  <span className="fw-bold text-forest">6.8 • Neutral Optimal</span>
                </div>
              </div>

              {/* Floating Stat Card 2: Weather Forecast */}
              <div
                className="floating-stat-badge d-none d-md-flex align-items-center gap-3"
                style={{ bottom: '8%', right: '-8%' }}
              >
                <div className="bg-light-mint text-forest p-2 rounded-circle fs-4 d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px' }}>
                  <i className="bi bi-cloud-sun-fill text-warning"></i>
                </div>
                <div>
                  <small className="text-muted d-block fw-semibold">Weather Advisory</small>
                  <span className="fw-bold text-forest">28°C • Rain Clear 5 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

