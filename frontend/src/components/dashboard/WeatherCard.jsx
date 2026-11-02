import React from 'react';

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden">
      {/* Header */}
      <div className="card-header bg-white py-3 px-4 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center"
            style={{ width: '38px', height: '38px', fontSize: '1.2rem' }}
          >
            <i className="bi bi-cloud-sun-fill"></i>
          </div>
          <div>
            <h3 className="h6 fw-bold text-dark mb-0">Micro-Climate & Farm Weather</h3>
            <span className="text-muted small" style={{ fontSize: '0.78rem' }}>
              {weather.location} • {weather.lastUpdated}
            </span>
          </div>
        </div>
        <span className="badge badge-demo-tag px-3 py-1.5 rounded-pill fw-semibold small">
          <i className="bi bi-broadcast me-1"></i> Simulated Demo Forecast
        </span>
      </div>

      <div className="card-body p-4">
        {/* Main Weather Display */}
        <div className="row g-3 align-items-center mb-4">
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-3">
              <span className="fs-1 fw-bold text-dark">{weather.temperature}</span>
              <div>
                <span className="fw-semibold text-dark d-block">{weather.condition}</span>
                <span className="text-muted small" style={{ fontSize: '0.78rem' }}>
                  Feels like 29°C • UV {weather.uvIndex}
                </span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-8">
            <div className="row g-2 text-center">
              <div className="col-4">
                <div className="p-2.5 rounded-3 bg-light">
                  <i className="bi bi-droplet-half text-primary fs-5 d-block mb-1"></i>
                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                    Humidity
                  </span>
                  <span className="fw-bold text-dark">{weather.humidity}</span>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2.5 rounded-3 bg-light">
                  <i className="bi bi-cloud-rain-heavy text-info fs-5 d-block mb-1"></i>
                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                    Rain Probability
                  </span>
                  <span className="fw-bold text-dark">{weather.rainProbability}</span>
                </div>
              </div>
              <div className="col-4">
                <div className="p-2.5 rounded-3 bg-light">
                  <i className="bi bi-wind text-secondary fs-5 d-block mb-1"></i>
                  <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                    Wind Speed
                  </span>
                  <span className="fw-bold text-dark small">{weather.windSpeed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Day Mini Forecast */}
        <div className="row g-2 mb-3">
          {weather.forecastDays.map((fc, idx) => (
            <div key={idx} className="col-6 col-sm-3">
              <div className="p-2 text-center rounded-3 border bg-light h-100">
                <span className="small fw-semibold text-muted d-block">{fc.day}</span>
                <i className={`bi ${fc.icon} text-warning fs-5 my-1 d-block`}></i>
                <span className="small fw-bold text-dark d-block" style={{ fontSize: '0.8rem' }}>
                  {fc.temp}
                </span>
                <span className="text-muted small" style={{ fontSize: '0.7rem' }}>
                  💧 {fc.rain}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory banner */}
        <div className="alert alert-success bg-success-subtle border-0 rounded-4 p-3 mb-0 d-flex gap-2.5 align-items-start">
          <i className="bi bi-lightbulb-fill text-success fs-5 mt-0.5"></i>
          <div>
            <strong className="d-block text-success-emphasis small">
              Agronomic Activity Recommendation
            </strong>
            <span className="text-dark small" style={{ fontSize: '0.82rem' }}>
              {weather.agriculturalAdvisory}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

