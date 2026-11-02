import React from 'react';
import { platformFeatures } from '../data/featuresData';

const Features = () => {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="badge-agri-pill bg-light-mint text-forest mb-2 d-inline-block">
            Integrated Solutions
          </span>
          <h2 className="display-5 text-forest fw-bold mb-3">
            Digital Power for Every Agricultural Need
          </h2>
          <p className="text-muted fs-6 mx-auto" style={{ maxWidth: '640px' }}>
            Built specifically around the operational challenges faced by farmers, agronomists, 
            and agricultural suppliers.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="row g-4">
          {platformFeatures.map((feature) => (
            <div key={feature.id} className="col-md-6 col-lg-4">
              <div className="card h-100 agri-card p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    className="feature-icon-wrapper"
                    style={{ backgroundColor: feature.bgLight, color: feature.accentColor }}
                  >
                    <i className={`bi ${feature.iconClass}`}></i>
                  </div>
                  <span className="badge bg-light text-dark border border-secondary border-opacity-25 rounded-pill px-3 py-1 small fw-semibold">
                    {feature.badgeText}
                  </span>
                </div>

                <h3 className="h5 fw-bold text-forest mb-2">
                  {feature.title}
                </h3>

                <p className="text-muted small mb-0 lh-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

