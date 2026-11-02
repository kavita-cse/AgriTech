import React, { useState } from 'react';

const AddFarmModal = ({ isOpen, onClose, onAddFarm }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area: '',
    mainCrop: '',
    soilType: 'Medium Black Loam',
    irrigationType: 'Drip Irrigation',
    surveyNumber: '',
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Farm name is required.';
    if (!formData.location.trim()) newErrors.location = 'Location / District is required.';
    if (!formData.area || isNaN(formData.area) || parseFloat(formData.area) <= 0) {
      newErrors.area = 'Please enter a valid area in acres (e.g. 5.5).';
    }
    if (!formData.mainCrop.trim()) newErrors.mainCrop = 'Main crop is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newFarm = {
      id: `farm-${Date.now()}`,
      name: formData.name.trim(),
      location: formData.location.trim(),
      totalArea: `${formData.area} Acres`,
      areaNum: parseFloat(formData.area),
      mainCrop: formData.mainCrop.trim(),
      soilType: formData.soilType,
      irrigationType: formData.irrigationType,
      surveyNumber: formData.surveyNumber.trim() || 'Pending Survey Verification',
      status: 'Active',
      lastInspected: 'Just Added',
      notes: 'Newly added plot registered via Farmer Dashboard.',
    };

    onAddFarm(newFarm);
    // Reset and close
    setFormData({
      name: '',
      location: '',
      area: '',
      mainCrop: '',
      soilType: 'Medium Black Loam',
      irrigationType: 'Drip Irrigation',
      surveyNumber: '',
    });
    setErrors({});
    onClose();
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
          {/* Header */}
          <div className="modal-header bg-success text-white py-3 px-4">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-plus-circle-fill"></i> Add New Agricultural Plot
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body p-4">
              <div className="alert alert-light border small text-muted mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-info-circle text-success fs-5"></i>
                <span>
                  Adding a farm registers it in your local React state. Changes will update summary KPI cards and management lists in real time.
                </span>
              </div>

              <div className="row g-3">
                {/* Farm Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-dark">
                    Farm / Plot Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Krishna River Orchard"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Location */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-dark">
                    Location / Taluka / District <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                    placeholder="e.g. Niphad, Nashik"
                  />
                  {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                </div>

                {/* Total Area */}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold text-dark">
                    Total Area (Acres) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className={`form-control ${errors.area ? 'is-invalid' : ''}`}
                    placeholder="e.g. 7.5"
                  />
                  {errors.area && <div className="invalid-feedback">{errors.area}</div>}
                </div>

                {/* Main Crop */}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold text-dark">
                    Primary Crop <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="mainCrop"
                    value={formData.mainCrop}
                    onChange={handleChange}
                    className={`form-control ${errors.mainCrop ? 'is-invalid' : ''}`}
                    placeholder="e.g. Wheat & Mustard"
                  />
                  {errors.mainCrop && <div className="invalid-feedback">{errors.mainCrop}</div>}
                </div>

                {/* Survey Number */}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold text-dark">
                    Survey / Gut No. <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="surveyNumber"
                    value={formData.surveyNumber}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Gut No. 84/2"
                  />
                </div>

                {/* Soil Type */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-dark">Soil Classification</label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Medium Black Loam">Medium Black Loam</option>
                    <option value="Deep Black Clay (Regur)">Deep Black Clay (Regur)</option>
                    <option value="Red Laterite Soil">Red Laterite Soil</option>
                    <option value="Alluvial Sandy Loam">Alluvial Sandy Loam</option>
                    <option value="Silty Clay Loam">Silty Clay Loam</option>
                  </select>
                </div>

                {/* Irrigation Type */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-dark">Irrigation System</label>
                  <select
                    name="irrigationType"
                    value={formData.irrigationType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Micro-sprinkler System">Micro-sprinkler System</option>
                    <option value="Canal & Surface Flood">Canal & Surface Flood</option>
                    <option value="Borewell with Rain Guns">Borewell with Rain Guns</option>
                    <option value="Rainfed (Non-irrigated)">Rainfed (Non-irrigated)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer bg-light px-4 py-3">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-agri-primary rounded-pill px-4 fw-semibold">
                <i className="bi bi-check-circle-fill me-1"></i> Register Plot
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFarmModal;

