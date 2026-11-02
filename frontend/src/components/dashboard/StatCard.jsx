import React from 'react';

const StatCard = ({ title, value, subtitle, icon, iconBg = 'bg-success-subtle', iconColor = 'text-success', trend }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
      <div className="card-body p-3.5 d-flex align-items-center justify-content-between">
        <div>
          <span className="text-muted fw-semibold small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <h2 className="fw-bold my-1 text-dark fs-3">{value}</h2>
          <div className="d-flex align-items-center gap-1.5">
            {trend && (
              <span className="badge bg-success-subtle text-success small fw-semibold" style={{ fontSize: '0.72rem' }}>
                {trend}
              </span>
            )}
            <span className="text-muted small" style={{ fontSize: '0.78rem' }}>
              {subtitle}
            </span>
          </div>
        </div>
        <div
          className={`rounded-4 d-flex align-items-center justify-content-center ${iconBg} ${iconColor}`}
          style={{ width: '52px', height: '52px', fontSize: '1.5rem' }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

