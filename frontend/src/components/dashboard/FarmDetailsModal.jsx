import React from 'react';

const FarmDetailsModal = ({ farm, isOpen, onClose }) => {
  if (!isOpen || !farm) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-success text-white py-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <span className="badge bg-warning text-dark small mb-1">
                <i className="bi bi-patch-check-fill me-1"></i> Plot Verification Active
              </span>
              <h5 className="modal-title fw-bold mb-0">{farm.name}</h5>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-light">
                  <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>
                    Plot Location
                  </span>
                  <strong className="text-dark">
                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                    {farm.location}
                  </strong>
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="p-3 border rounded-3 bg-light">
                  <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>
                    Total Land Area
                  </span>
                  <strong className="text-success">{farm.totalArea}</strong>
                </div>
              </div>
              <div className="col-12 col-md-3">
                <div className="p-3 border rounded-3 bg-light">
                  <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>
                    Survey Number
                  </span>
                  <strong className="text-dark">{farm.surveyNumber}</strong>
                </div>
              </div>
            </div>

            <h6 className="fw-bold text-dark mb-3">Agronomic Specifications</h6>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 border rounded-3">
                  <i className="bi bi-layers-fill text-warning fs-3"></i>
                  <div>
                    <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>
                      Soil Classification
                    </span>
                    <strong className="text-dark small">{farm.soilType}</strong>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 border rounded-3">
                  <i className="bi bi-droplet-half text-primary fs-3"></i>
                  <div>
                    <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>
                      Irrigation & Water Delivery
                    </span>
                    <strong className="text-dark small">{farm.irrigationType}</strong>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 border rounded-3">
                  <i className="bi bi-calendar-check text-success fs-3"></i>
                  <div>
                    <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>
                      Last Field Inspection
                    </span>
                    <strong className="text-dark small">{farm.lastInspected}</strong>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 border rounded-3">
                  <i className="bi bi-flower1 text-info fs-3"></i>
                  <div>
                    <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>
                      Main Crop Cultivation
                    </span>
                    <strong className="text-dark small">{farm.mainCrop}</strong>
                  </div>
                </div>
              </div>
            </div>

            {farm.notes && (
              <div className="p-3 rounded-3 bg-light border">
                <span className="fw-semibold text-muted small d-block mb-1">Plot Field Notes:</span>
                <p className="small text-secondary mb-0">{farm.notes}</p>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light px-4 py-3">
            <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmDetailsModal;

