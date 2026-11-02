import React from 'react';

const FarmCard = ({ farm, onViewDetails }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white agri-card">
      <div className="card-body p-4 d-flex flex-column">
        {/* Farm Top Row */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span className="badge bg-success-subtle text-success small mb-1.5 px-2.5 py-1 rounded-pill">
              <i className="bi bi-patch-check-fill me-1"></i> Registered Plot
            </span>
            <h3 className="h5 fw-bold text-dark mb-1">{farm.name}</h3>
            <p className="text-muted small mb-0 d-flex align-items-center gap-1">
              <i className="bi bi-geo-alt-fill text-danger small"></i>
              {farm.location}
            </p>
          </div>
          <div
            className="rounded-3 bg-light d-flex align-items-center justify-content-center text-success"
            style={{ width: '42px', height: '42px', fontSize: '1.25rem' }}
          >
            <i className="bi bi-flower2"></i>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="row g-2 py-2 mb-3 bg-light rounded-3 px-1 text-center">
          <div className="col-6 border-end">
            <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>
              Total Area
            </span>
            <span className="fw-bold text-dark">{farm.totalArea}</span>
          </div>
          <div className="col-6">
            <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>
              Main Crops
            </span>
            <span className="fw-bold text-success text-truncate d-block small">{farm.mainCrop}</span>
          </div>
        </div>

        {/* Plot Details snippet */}
        <div className="mb-4 small text-muted flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-1.5">
            <i className="bi bi-droplet-half text-primary"></i>
            <span>
              <strong>Irrigation:</strong> {farm.irrigationType}
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-layers text-warning"></i>
            <span>
              <strong>Soil:</strong> {farm.soilType}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-top mt-auto">
          <button
            onClick={() => onViewDetails(farm)}
            className="btn btn-outline-success btn-sm w-100 rounded-pill fw-semibold py-2 d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-eye"></i> View Plot Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmCard;

