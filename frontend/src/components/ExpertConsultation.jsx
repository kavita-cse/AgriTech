import React from 'react';
import { Link } from 'react-router-dom';

const ExpertConsultation = () => {
  return (
    <section id="experts" className="section-padding bg-soft-gradient border-top border-bottom border-light">
      <div className="container">
        <div className="row align-items-center g-5">
          {/* Left Visual: Consultation Ticket Demonstration */}
          <div className="col-lg-5 order-2 order-lg-1">
            <div className="card agri-card p-4 border-0 shadow position-relative">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success rounded-pill px-3 py-1">Case #AG-4091</span>
                  <small className="text-muted">Turnaround: 18 hrs</small>
                </div>
                <span className="badge bg-light-mint text-forest fw-semibold border border-success border-opacity-25">
                  <i className="bi bi-patch-check-fill me-1"></i> Verified Diagnosis
                </span>
              </div>

              <div className="mb-3">
                <strong className="d-block text-forest mb-1">Farmer Query: Yellowing Leaf Tips in Rabi Wheat</strong>
                <p className="text-muted small mb-0">
                  "Noticeable yellow-brown spotting appearing on secondary leaves 4 weeks post-sowing. Drip irrigation active."
                </p>
              </div>

              {/* Verified Agronomist Response Box */}
              <div className="p-3 rounded-3 bg-light border border-success border-opacity-25">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="bg-forest text-white rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-person-check-fill"></i>
                  </div>
                  <div>
                    <span className="fw-bold text-forest d-block small">Dr. Rajesh Varma, Ph.D.</span>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Verified Senior Agronomist • Agronomy Reg #AGR-8841</small>
                  </div>
                </div>
                <p className="small text-muted mb-0">
                  <strong>Advisory:</strong> "Symptoms point to early Zinc micronutrient deficiency exacerbated by alkaline soil reaction. Apply foliar spray of Zinc Sulphate (0.5%) alongside balanced irrigation."
                </p>
              </div>

              <div className="mt-3 pt-2 border-top text-center">
                <small className="text-muted fst-italic">
                  *Indicative guidance provided by certified agricultural specialists.
                </small>
              </div>
            </div>
          </div>

          {/* Right Column: Explanatory Content */}
          <div className="col-lg-7 order-1 order-lg-2">
            <span className="badge-agri-pill bg-light-mint text-forest mb-2 d-inline-block">
              Certified Human Agronomy
            </span>
            <h2 className="display-5 text-forest fw-bold mb-3">
              Direct Expert Consultation with Verified Agronomists
            </h2>
            <p className="text-muted fs-6 mb-4">
              AI analytics provide indicative signals, but complex crop health challenges 
              require the clinical eye of trained agronomists. AgriTech directly pairs farmers 
              with certified specialists.
            </p>

            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="d-flex gap-3">
                  <div className="bg-light-mint text-forest p-2 rounded-3 fs-5 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                    <i className="bi bi-shield-lock-fill"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold text-forest mb-1">Admin Verification</h4>
                    <small className="text-muted">Experts must submit institutional credentials before gaining consultation access.</small>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="d-flex gap-3">
                  <div className="bg-light-mint text-forest p-2 rounded-3 fs-5 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                    <i className="bi bi-camera-fill"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold text-forest mb-1">Visual Symptoms</h4>
                    <small className="text-muted">Attach clear crop symptom images and soil readings for targeted prescriptions.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <Link to="/register" className="btn btn-agri-primary btn-lg shadow-sm">
                Connect With An Expert
              </Link>
              <Link to="/login" className="btn btn-agri-outline btn-lg">
                Are You An Agronomist? Apply
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertConsultation;

