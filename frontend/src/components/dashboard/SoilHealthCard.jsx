import React from 'react';

const SoilHealthCard = ({ soilRecord }) => {
  if (!soilRecord) return null;

  return (
    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      {/* Header with Demo Badge */}
      <div className="card-header bg-white py-3 px-4 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
            style={{ width: '38px', height: '38px', fontSize: '1.2rem' }}
          >
            <i className="bi bi-clipboard2-pulse"></i>
          </div>
          <div>
            <h3 className="h6 fw-bold text-dark mb-0">Soil Health Card & Nutrient Profile</h3>
            <span className="text-muted small" style={{ fontSize: '0.78rem' }}>
              Sampled Plot: <strong>{soilRecord.farmName}</strong> | Tested: {soilRecord.testDate}
            </span>
          </div>
        </div>
        <span className="badge badge-demo-tag px-3 py-1.5 rounded-pill fw-semibold small">
          <i className="bi bi-info-circle me-1"></i> Simulated Demo Data
        </span>
      </div>

      <div className="card-body p-4">
        {/* Parameters Grid */}
        <div className="row g-3 mb-4">
          {/* pH Level */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="p-3.5 border rounded-4 bg-light h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small fw-semibold">Soil pH</span>
                <span className={`badge bg-${soilRecord.parameters.ph.statusType}-subtle text-${soilRecord.parameters.ph.statusType} small`}>
                  Optimal
                </span>
              </div>
              <div className="d-flex align-items-baseline gap-1 my-1">
                <span className="fs-3 fw-bold text-dark">{soilRecord.parameters.ph.value}</span>
                <span className="text-muted small">pH</span>
              </div>
              <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                {soilRecord.parameters.ph.description}
              </p>
            </div>
          </div>

          {/* Nitrogen (N) */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="p-3.5 border rounded-4 bg-light h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small fw-semibold">Nitrogen (N)</span>
                <span className={`badge bg-${soilRecord.parameters.nitrogen.statusType}-subtle text-${soilRecord.parameters.nitrogen.statusType} small`}>
                  Adequate
                </span>
              </div>
              <div className="d-flex align-items-baseline gap-1 my-1">
                <span className="fs-3 fw-bold text-dark">{soilRecord.parameters.nitrogen.value}</span>
                <span className="text-muted small">kg/ha</span>
              </div>
              <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                {soilRecord.parameters.nitrogen.description}
              </p>
            </div>
          </div>

          {/* Phosphorus (P) */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="p-3.5 border rounded-4 bg-light h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small fw-semibold">Phosphorus (P)</span>
                <span className={`badge bg-${soilRecord.parameters.phosphorus.statusType}-subtle text-${soilRecord.parameters.phosphorus.statusType} small`}>
                  Moderate
                </span>
              </div>
              <div className="d-flex align-items-baseline gap-1 my-1">
                <span className="fs-3 fw-bold text-dark">{soilRecord.parameters.phosphorus.value}</span>
                <span className="text-muted small">kg/ha</span>
              </div>
              <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                {soilRecord.parameters.phosphorus.description}
              </p>
            </div>
          </div>

          {/* Potassium (K) */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="p-3.5 border rounded-4 bg-light h-100">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small fw-semibold">Potassium (K)</span>
                <span className={`badge bg-${soilRecord.parameters.potassium.statusType}-subtle text-${soilRecord.parameters.potassium.statusType} small`}>
                  High
                </span>
              </div>
              <div className="d-flex align-items-baseline gap-1 my-1">
                <span className="fs-3 fw-bold text-dark">{soilRecord.parameters.potassium.value}</span>
                <span className="text-muted small">kg/ha</span>
              </div>
              <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                {soilRecord.parameters.potassium.description}
              </p>
            </div>
          </div>
        </div>

        {/* Advisory Disclaimer Callout */}
        <div className="alert alert-warning border-0 rounded-4 p-3.5 mb-0 d-flex gap-3 align-items-start">
          <i className="bi bi-shield-exclamation text-warning fs-4 mt-0.5"></i>
          <div>
            <h4 className="h6 fw-bold text-dark mb-1">
              Indicative Agronomic Guidance & Soil Disclaimer
            </h4>
            <p className="small text-secondary mb-0" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
              {soilRecord.demoAdvisory}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilHealthCard;

