import React from 'react';

const CropCard = ({ crop }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white agri-card">
      <div className="card-body p-4 d-flex flex-column">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 bg-success-subtle d-flex align-items-center justify-content-center text-success"
              style={{ width: '46px', height: '46px', fontSize: '1.4rem' }}
            >
              <i className={`bi ${crop.icon || 'bi-tree'}`}></i>
            </div>
            <div>
              <h3 className="h6 fw-bold text-dark mb-0.5">{crop.name}</h3>
              <span className="text-muted small" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-geo-alt me-1"></i> {crop.farmName}
              </span>
            </div>
          </div>
          <span
            className={`badge bg-${crop.badgeVariant || 'success'}-subtle text-${
              crop.badgeVariant || 'success'
            } px-2.5 py-1 rounded-pill small fw-semibold`}
          >
            {crop.healthStatus}
          </span>
        </div>

        {/* Growth Progress */}
        <div className="mb-3.5 p-3 bg-light rounded-3">
          <div className="d-flex justify-content-between align-items-center mb-1.5 small">
            <span className="fw-semibold text-dark">{crop.growthStage}</span>
            <span className="fw-bold text-success">{crop.progressPercent}%</span>
          </div>
          <div className="crop-progress-bar">
            <div
              className="crop-progress-fill"
              style={{ width: `${crop.progressPercent}%` }}
              role="progressbar"
              aria-valuenow={crop.progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>

        {/* Dates and Details */}
        <div className="row g-2 small text-muted mb-3 flex-grow-1">
          <div className="col-6">
            <div className="p-2 border rounded-3 bg-white">
              <span className="d-block text-muted" style={{ fontSize: '0.7rem' }}>
                Planting Date
              </span>
              <strong className="text-dark small">{crop.plantingDate}</strong>
            </div>
          </div>
          <div className="col-6">
            <div className="p-2 border rounded-3 bg-white">
              <span className="d-block text-muted" style={{ fontSize: '0.7rem' }}>
                Est. Harvest
              </span>
              <strong className="text-success small">{crop.estimatedHarvest}</strong>
            </div>
          </div>
        </div>

        {/* Water / Schedule note */}
        <div className="pt-2 border-top mt-auto small text-muted d-flex align-items-center gap-1.5">
          <i className="bi bi-water text-info"></i>
          <span style={{ fontSize: '0.78rem' }}>{crop.waterRequirement}</span>
        </div>
      </div>
    </div>
  );
};

export default CropCard;

