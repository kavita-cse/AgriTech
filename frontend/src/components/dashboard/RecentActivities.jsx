import React from 'react';

const RecentActivities = ({ activities }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 bg-white h-100">
      <div className="card-header bg-white py-3 px-4 border-bottom d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-clock-history text-success fs-5"></i>
          <h3 className="h6 fw-bold text-dark mb-0">Recent Farm Activities</h3>
        </div>
        <span className="badge bg-light text-muted small fw-semibold">Live Feed</span>
      </div>

      <div className="card-body p-4">
        <div className="position-relative">
          {activities.map((act, index) => (
            <div key={act.id} className="d-flex gap-3 mb-3.5 position-relative">
              {/* Vertical connector line */}
              {index !== activities.length - 1 && (
                <div
                  className="position-absolute bg-light"
                  style={{
                    width: '2px',
                    top: '36px',
                    bottom: '-12px',
                    left: '19px',
                    zIndex: 1,
                  }}
                />
              )}

              {/* Icon circle */}
              <div
                className={`rounded-circle bg-${act.color}-subtle text-${act.color} d-flex align-items-center justify-content-center flex-shrink-0`}
                style={{ width: '40px', height: '40px', fontSize: '1.1rem', zIndex: 2 }}
              >
                <i className={`bi ${act.icon}`}></i>
              </div>

              {/* Activity details */}
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-baseline mb-0.5">
                  <h4 className="fw-semibold text-dark small mb-0" style={{ fontSize: '0.88rem' }}>
                    {act.title}
                  </h4>
                  <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;

