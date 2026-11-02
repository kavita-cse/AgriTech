import React from 'react';

const TermsModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(8, 28, 21, 0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content agri-card border-0 shadow-lg">
          <div className="modal-header bg-forest text-white border-0 py-3">
            <h5 className="modal-title fw-bold fs-6">
              <i className="bi bi-file-earmark-text-fill me-2 text-mint"></i>
              AgriTech Platform Terms & Policies
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4 text-muted small lh-base">
            <h6 className="fw-bold text-forest mb-2">1. Platform Purpose & Digital Technology</h6>
            <p className="mb-3">
              AgriTech provides digital tools for farm plot management, indicative soil nutrient guidance, localized weather forecasts, and marketplace resource discovery.
            </p>

            <h6 className="fw-bold text-forest mb-2">2. Expert Verification Requirements</h6>
            <p className="mb-3">
              Agricultural Expert accounts must submit formal accreditation (degree/council license). Accounts remain in a <strong>Pending</strong> state (browse-only forum access) until approved by an administrator. Consultation responses are strictly restricted to verified specialists.
            </p>

            <h6 className="fw-bold text-forest mb-2">3. Marketplace Trading & Single-Seller Orders</h6>
            <p className="mb-3">
              To guarantee fulfillment and delivery accountability, each order placed through the marketplace is restricted to products supplied by a single verified vendor or farmer.
            </p>

            <h6 className="fw-bold text-forest mb-2">4. Indicative Advisory Notice</h6>
            <div className="p-3 bg-light rounded-3 border border-success border-opacity-25 mb-3">
              <strong className="text-forest d-block mb-1">Disclaimer:</strong>
              Automated soil recommendations and weather advisories are indicative rule-based guidances for preliminary planning. They do not replace certified physical lab soil tests or on-site agricultural extension diagnoses.
            </div>

            <h6 className="fw-bold text-forest mb-2">5. Data Privacy & Account Governance</h6>
            <p className="mb-0">
              Users agree to maintain truthful crop and business listings. Accounts violating community standards or posting fraudulent listings are subject to administrative suspension or deactivation.
            </p>
          </div>
          <div className="modal-footer border-top border-light-subtle py-2">
            <button type="button" className="btn btn-agri-primary px-4 btn-sm" onClick={onClose}>
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;

