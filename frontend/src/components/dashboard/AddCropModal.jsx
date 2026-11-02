import React, { useState } from 'react';

const AddCropModal = ({ isOpen, onClose, farms, onAddCrop }) => {
  const [formData, setFormData] = useState({
    farmId: '',
    cropName: '',
    variety: 'Certified Hybrid',
    sowingDate: new Date().toISOString().split('T')[0],
    currentStage: 'vegetative',
    progressPercent: 30,
    waterRequirement: 'Drip scheduled 3x weekly',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.farmId) errs.farmId = 'Please select a registered farm plot.';
    if (!formData.cropName.trim()) errs.cropName = 'Crop name is required.';
    if (!formData.sowingDate) errs.sowingDate = 'Sowing date is required.';
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
      await onAddCrop(formData);
      onClose();
      setFormData({
        farmId: '',
        cropName: '',
        variety: 'Certified Hybrid',
        sowingDate: new Date().toISOString().split('T')[0],
        currentStage: 'vegetative',
        progressPercent: 30,
        waterRequirement: 'Drip scheduled 3x weekly',
      });
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
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-success text-white py-3 px-4">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-tree-fill"></i> Add Monitored Crop
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">
                  Select Farm Plot <span className="text-danger">*</span>
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

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">
                  Crop Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="cropName"
                  value={formData.cropName}
                  onChange={handleChange}
                  placeholder="e.g. Thompson Seedless Grapes, Basmati Rice"
                  className={`form-control ${errors.cropName ? 'is-invalid' : ''}`}
                />
                {errors.cropName && <div className="invalid-feedback">{errors.cropName}</div>}
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-dark">Variety</label>
                  <input
                    type="text"
                    name="variety"
                    value={formData.variety}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-dark">Sowing Date</label>
                  <input
                    type="date"
                    name="sowingDate"
                    value={formData.sowingDate}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-dark">Growth Stage</label>
                  <select
                    name="currentStage"
                    value={formData.currentStage}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="sowing">Sowing</option>
                    <option value="vegetative">Vegetative</option>
                    <option value="flowering">Flowering</option>
                    <option value="harvesting">Harvesting</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-dark">Progress %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="progressPercent"
                    value={formData.progressPercent}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-dark">Irrigation Requirement Note</label>
                <input
                  type="text"
                  name="waterRequirement"
                  value={formData.waterRequirement}
                  onChange={handleChange}
                  className="form-control"
                />
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
                {isSubmitting ? 'Saving to Database...' : 'Record Crop'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCropModal;

