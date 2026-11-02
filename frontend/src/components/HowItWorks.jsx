import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '1',
    title: 'Create Your Account',
    description: 'Sign up in under 60 seconds. Choose whether you are a Farmer, Certified Agronomist, Agricultural Supplier, or Produce Buyer.',
    badge: 'Step 1: Onboarding'
  },
  {
    number: '2',
    title: 'Register Land & Crops',
    description: 'Add your plots with land acreage, soil type, irrigation setup, and active crop cycles to initialize your digital farm dashboard.',
    badge: 'Step 2: Setup'
  },
  {
    number: '3',
    title: 'Grow, Trade & Consult',
    description: 'Receive personalized weather alerts, balance soil nutrients with indicative rules, buy verified inputs, or consult certified experts.',
    badge: 'Step 3: Thrive'
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-soft-gradient border-top border-bottom border-light">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge-agri-pill bg-light-mint text-forest mb-2 d-inline-block">
            Straightforward Process
          </span>
          <h2 className="display-5 text-forest fw-bold mb-3">
            How AgriTech Works for You
          </h2>
          <p className="text-muted fs-6 mx-auto" style={{ maxWidth: '600px' }}>
            Empowering your farming operations with data-driven clarity in three simple steps.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {steps.map((step) => (
            <div key={step.number} className="col-lg-4 col-md-6">
              <div className="card h-100 agri-card p-4 text-center position-relative">
                <div className="step-number mx-auto">
                  {step.number}
                </div>
                <span className="badge bg-light text-forest border border-success border-opacity-25 rounded-pill px-3 py-1 mb-3 small align-self-center">
                  {step.badge}
                </span>
                <h3 className="h5 fw-bold text-forest mb-2">
                  {step.title}
                </h3>
                <p className="text-muted small mb-0 lh-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link to="/register" className="btn btn-agri-primary btn-lg shadow-sm">
            Start Your Free Account Today
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

