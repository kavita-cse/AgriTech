import React, { useState } from 'react';

const LogSoilModal = ({ isOpen, onClose, farms, onSaveSoil }) => {
  const [formData, setFormData] = useState({
    farmId: '',
    phLevel: 6.8,
    nitrogenKgPerHa: 320,
    phosphorusKgPerHa: 20,
    potassiumKgPerHa: 220,
    organicCarbonPercent: 0.72,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.farmId) errs.farmId = 'Please select a registered farm plot.';
    if (formData.phLevel === '' || formData.phLevel < 0 || formData.phLevel > 14) {
      errs.phLevel = 'pH must be between 0.0 and 14.0';
    }
    if (formData.nitrogenKgPerHa === '' || formData.nitrogenKgPerHa < 0) {
      errs.nitrogenKgPerHa = 'Nitrogen must be a positive value.';
    }
    if (formData.phosphorusKgPerHa === '' || formData.phosphorusKgPerHa < 0) {
      errs.phosphorusKgPerHa = 'Phosphorus must be a positive value.';
    }
    if (formData.potassiumKgPerHa === '' || formData.potassiumKgPerHa < 0) {
      errs.potassiumKgPerHa = 'Potassium must be a positive value.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSaveSoil({
        ...formData,
        phLevel: Number(formData.phLevel),
        nitrogenKgPerHa: Number(formData.nitrogenKgPerHa),
        phosphorusKgPerHa: Number(formData.phosphorusKgPerHa),
        potassiumKgPerHa: Number(formData.potassiumKgPerHa),
        organicCarbonPercent: Number(formData.organicCarbonPercent),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="modal-header bg-success text-white py-3 px-4">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-clipboard2-pulse-fill"></i> Log Soil Test & Run Rule Engine
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body p-4">
              <div className="alert alert-light border small text-muted mb-4 d-flex align-items-start gap-2">
                <i className="bi bi-info-circle text-success fs-5 mt-0.5"></i>
                <span>
                  The backend rule engine will calculate agronomic recommendations based on configurable demo thresholds and attach the mandatory advisory disclaimer notice.
                </span>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">
                  Select Tested Farm Plot <span className="text-danger">*</span>
                </label>
                <select
                  name="farmId"
                  value={formData.farmId}
                  onChange={handleChange}
                  className={`form-select ${errors.farmId ? 'is-invalid' : ''}`}
                >
                  <option value="">-- Choose target farm --</option>
                  {farms.map((f) => (
                    <option key={f._id || f.id} value={f._id || f.id}>
                      {f.name || f.farmName} ({f.totalArea || f.location})
                    </option>
                  ))}
                </select>
                {errors.farmId && <div className="invalid-feedback">{errors.farmId}</div>}
              </div>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold text-dark">
                    Soil pH Level (0 - 14) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="phLevel"
                    value={formData.phLevel}
                    onChange={handleChange}
                    className={`form-control ${errors.phLevel ? 'is-invalid' : ''}`}
                  />
                  {errors.phLevel && <div className="invalid-feedback">{errors.phLevel}</div>}
                  <div className="form-text small" style={{ fontSize: '0.72rem' }}>
                    Optimal typical range: 6.0 - 7.5
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold text-dark">
                    Nitrogen - N (kg/ha) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="nitrogenKgPerHa"
                    value={formData.nitrogenKgPerHa}
                    onChange={handleChange}
                    className={`form-control ${errors.nitrogenKgPerHa ? 'is-invalid' : ''}`}
                  />
                  {errors.nitrogenKgPerHa && <div className="invalid-feedback">{errors.nitrogenKgPerHa}</div>}
                  <div className="form-text small" style={{ fontSize: '0.72rem' }}>
                    Optimal typical range: 280 - 560 kg/ha
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold text-dark">
                    Phosphorus - P (kg/ha) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="phosphorusKgPerHa"
                    value={formData.phosphorusKgPerHa}
                    onChange={handleChange}
                    className={`form-control ${errors.phosphorusKgPerHa ? 'is-invalid' : ''}`}
                  />
                  {errors.phosphorusKgPerHa && <div className="invalid-feedback">{errors.phosphorusKgPerHa}</div>}
                  <div className="form-text small" style={{ fontSize: '0.72rem' }}>
                    Optimal typical range: 10 - 25 kg/ha
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold text-dark">
                    Potassium - K (kg/ha) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="potassiumKgPerHa"
                    value={formData.potassiumKgPerHa}
                    onChange={handleChange}
                    className={`form-control ${errors.potassiumKgPerHa ? 'is-invalid' : ''}`}
                  />
                  {errors.potassiumKgPerHa && <div className="invalid-feedback">{errors.potassiumKgPerHa}</div>}
                  <div className="form-text small" style={{ fontSize: '0.72rem' }}>
                    Optimal typical range: 110 - 280 kg/ha
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-dark">Organic Carbon (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="organicCarbonPercent"
                    value={formData.organicCarbonPercent}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light px-4 py-3">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-agri-primary rounded-pill px-4 fw-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Evaluating & Saving...' : 'Submit to Rule Engine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogSoilModal;

