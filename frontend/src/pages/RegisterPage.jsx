import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthHeader from '../components/auth/AuthHeader';
import PasswordInput from '../components/auth/PasswordInput';
import TermsModal from '../components/auth/TermsModal';
import { useAuth } from '../context/AuthContext';

const roles = [
  {
    id: 'farmer',
    name: 'Farmer',
    icon: 'bi-person-badge-fill',
    badge: 'Producer',
    desc: 'Manage farm plots, soil health, crop cycles, and sell harvest produce.',
  },
  {
    id: 'expert',
    name: 'Agricultural Expert',
    icon: 'bi-patch-check-fill',
    badge: 'Requires Verification',
    desc: 'Diagnose crop issues, review lab soil cards, and answer consultations.',
  },
  {
    id: 'vendor',
    name: 'Vendor',
    icon: 'bi-shop',
    badge: 'Supplier + Buyer',
    desc: 'List agricultural seeds, fertilizers, and tools. Full buying capabilities.',
  },
  {
    id: 'buyer',
    name: 'Buyer',
    icon: 'bi-cart-check-fill',
    badge: 'Consumer / Trader',
    desc: 'Source quality farm produce and agricultural supplies directly.',
  },
];

const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('farmer');

  // Form fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,

    // Farmer-specific
    farmName: '',
    farmLocation: '',

    // Expert-specific
    specialization: '',
    qualifications: '',

    // Vendor-specific
    businessName: '',
    businessCategory: 'Seeds & Planting Material',

    // Buyer-specific
    buyerType: 'individual',
    organizationName: '',
  });

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const validate = () => {
    const newErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    // Mobile Number (10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required.';
    } else if (!mobileRegex.test(cleanMobile)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number starting with 6-9.';
    }

    // Password (min 8 chars)
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters for security.';
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // Terms & Conditions
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the terms and conditions to register.';
    }

    // Role-specific validation
    if (role === 'expert') {
      if (!formData.specialization) {
        newErrors.specialization = 'Please select your primary agricultural specialization.';
      }
      if (!formData.qualifications.trim()) {
        newErrors.qualifications = 'Please state your academic degrees and council/license ID.';
      }
    }

    if (role === 'vendor') {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business or enterprise name is required.';
      }
      if (!formData.businessCategory) {
        newErrors.businessCategory = 'Please choose a primary business category.';
      }
    }

    if (role === 'buyer' && formData.buyerType === 'business') {
      if (!formData.organizationName.trim()) {
        newErrors.organizationName = 'Business or organization name is required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      if (name === 'buyerType' && value === 'individual') {
        updated.organizationName = '';
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'buyerType' && value === 'individual' && errors.organizationName) {
      setErrors((prev) => ({ ...prev, organizationName: '' }));
    }
    if (statusMessage) {
      setStatusMessage(null);
    }
  };

  const handleRoleSelect = (selectedRole) => {
    if (selectedRole === role) return;
    setRole(selectedRole);

    // Reset role-specific fields so irrelevant values do not persist across role switches
    setFormData((prev) => ({
      ...prev,
      farmName: '',
      farmLocation: '',
      specialization: '',
      qualifications: '',
      businessName: '',
      businessCategory: 'Seeds & Planting Material',
      buyerType: 'individual',
      organizationName: '',
    }));

    // Remove role-specific errors when switching roles
    setErrors((prev) => {
      const nextErrors = { ...prev };
      delete nextErrors.specialization;
      delete nextErrors.qualifications;
      delete nextErrors.businessName;
      delete nextErrors.businessCategory;
      delete nextErrors.organizationName;
      return nextErrors;
    });

    if (statusMessage) setStatusMessage(null);
  };

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setStatusMessage({
        type: 'danger',
        text: 'Please complete all required fields correctly before proceeding.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      // Parse district and state from farmLocation or fallback
      const locationRaw = (formData.farmLocation || '').trim();
      const locationParts = locationRaw ? locationRaw.split(',') : [];
      const district = locationParts[0]?.trim() || 'Nashik';
      const state = locationParts[1]?.trim() || 'Maharashtra';

      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.mobileNumber.trim(),
        password: formData.password,
        role: role,
        district,
        state,
        expertLicenseNumber: role === 'expert' ? formData.qualifications?.trim() : undefined,
        expertSpecialization: role === 'expert' ? formData.specialization?.trim() : undefined,
      };

      const newUser = await register(payload);
      const roleObj = roles.find((r) => r.id === role);

      setStatusMessage({
        type: 'success',
        text: `Account successfully created for ${newUser.name} as a ${roleObj?.name || role}! Redirecting to your dashboard...`,
      });

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 700);
    } catch (err) {
      console.error('Registration error:', err);
      const apiMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Registration failed. Please check your network connection and details.';
      setStatusMessage({
        type: 'danger',
        text: apiMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-soft-gradient d-flex flex-column justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 auth-wrapper-lg">
            {/* Header Branding */}
            <AuthHeader
              title="Create Your AgriTech Account"
              subtitle="Select your operational role and join the digital agricultural ecosystem."
            />

            {/* Registration Card */}
            <div className="card agri-card p-4 p-sm-5 shadow border-0">
              {/* Status Alert Banner */}
              {statusMessage && (
                <div
                  className={`alert alert-${statusMessage.type} alert-dismissible fade show rounded-3 small py-2 px-3 mb-4 d-flex align-items-center gap-2`}
                  role="alert"
                >
                  <i
                    className={`bi ${
                      statusMessage.type === 'success'
                        ? 'bi-check-circle-fill text-success fs-5'
                        : 'bi-exclamation-triangle-fill text-danger fs-5'
                    }`}
                  ></i>
                  <div className="flex-grow-1">{statusMessage.text}</div>
                  <button
                    type="button"
                    className="btn-close small"
                    onClick={() => setStatusMessage(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* 1. Account Role Selection Cards */}
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-forest d-block mb-2">
                    Select Your Role on AgriTech <span className="text-danger">*</span>
                  </label>
                  <div className="row g-2">
                    {roles.map((r) => (
                      <div key={r.id} className="col-6 col-md-3">
                        <div
                          className={`role-card-option h-100 d-flex flex-column justify-content-between ${
                            role === r.id ? 'active' : ''
                          }`}
                          onClick={() => handleRoleSelect(r.id)}
                          role="button"
                          tabIndex="0"
                          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRoleSelect(r.id)}
                        >
                          <div>
                            <i className={`bi ${r.icon} role-icon`}></i>
                            <strong className="d-block small lh-sm">{r.name}</strong>
                          </div>
                          <span className="badge bg-light text-forest border border-success border-opacity-25 rounded-pill px-2 py-1 mt-2 font-monospace" style={{ fontSize: '0.68rem' }}>
                            {r.badge}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="form-text small mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-shield-lock-fill me-1 text-forest"></i>
                    <strong>System Note:</strong> Platform Administrator accounts are created solely via internal server CLI provisioning, not via public registration.
                  </div>
                </div>

                <hr className="my-4 border-light-subtle" />

                {/* 2. Common Personal Credentials */}
                <h2 className="h6 fw-bold text-forest mb-3">
                  <i className="bi bi-person-fill me-2 text-mint"></i>
                  Account Information
                </h2>

                <div className="row g-3 mb-3">
                  {/* Full Name */}
                  <div className="col-md-6">
                    <label htmlFor="regName" className="form-label small fw-semibold text-forest mb-1">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="regName"
                      name="fullName"
                      className={`form-control rounded-pill px-3 py-2 ${errors.fullName ? 'is-invalid' : ''}`}
                      placeholder="e.g. Ramesh Patel"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                    {errors.fullName && <div className="invalid-feedback px-1 small">{errors.fullName}</div>}
                  </div>

                  {/* Mobile Number */}
                  <div className="col-md-6">
                    <label htmlFor="regMobile" className="form-label small fw-semibold text-forest mb-1">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted rounded-start-pill small ps-3 pe-2">+91</span>
                      <input
                        type="tel"
                        id="regMobile"
                        name="mobileNumber"
                        className={`form-control rounded-end-pill px-3 py-2 ${errors.mobileNumber ? 'is-invalid' : ''}`}
                        placeholder="10-digit mobile"
                        maxLength="10"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        required
                      />
                      {errors.mobileNumber && <div className="invalid-feedback d-block px-1 small">{errors.mobileNumber}</div>}
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="mb-3">
                  <label htmlFor="regEmail" className="form-label small fw-semibold text-forest mb-1">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="regEmail"
                    name="email"
                    className={`form-control rounded-pill px-3 py-2 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <div className="invalid-feedback px-1 small">{errors.email}</div>}
                </div>

                {/* Password & Confirm Password */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <PasswordInput
                      id="regPassword"
                      name="password"
                      label="Password"
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      errorMessage={errors.password}
                      helpText="Minimum 8 characters"
                    />
                  </div>
                  <div className="col-md-6">
                    <PasswordInput
                      id="regConfirmPassword"
                      name="confirmPassword"
                      label="Confirm Password"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                      errorMessage={errors.confirmPassword}
                    />
                  </div>
                </div>

                {/* 3. Role-Specific Dynamic Fields */}
                <div className="p-3 p-sm-4 rounded-4 bg-light border border-success border-opacity-25 mb-4">
                  {/* FARMER FIELDS */}
                  {role === 'farmer' && (
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-forest text-white rounded-pill p-2">
                          <i className="bi bi-tree-fill"></i>
                        </span>
                        <div>
                          <strong className="text-forest d-block small">Farmer & Land Profile</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Optional details to initialize your farm records immediately.
                          </span>
                        </div>
                      </div>
                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label htmlFor="farmName" className="form-label small fw-semibold text-forest mb-1">
                            Primary Farm / Plot Name <span className="text-muted fw-normal">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            id="farmName"
                            name="farmName"
                            className="form-control rounded-pill px-3 py-2"
                            placeholder="e.g. Green Acres North"
                            value={formData.farmName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label htmlFor="farmLocation" className="form-label small fw-semibold text-forest mb-1">
                            District / Region <span className="text-muted fw-normal">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            id="farmLocation"
                            name="farmLocation"
                            className="form-control rounded-pill px-3 py-2"
                            placeholder="e.g. Nashik, Maharashtra"
                            value={formData.farmLocation}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="form-text small mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
                        💡 You can register multiple land plots, soil test cards, and crop cycles inside your farm dashboard after onboarding.
                      </div>
                    </div>
                  )}

                  {/* EXPERT FIELDS */}
                  {role === 'expert' && (
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-success text-white rounded-pill p-2">
                          <i className="bi bi-award-fill"></i>
                        </span>
                        <div>
                          <strong className="text-forest d-block small">Agronomist Accreditation Details</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Subject to administrator review before consultation access is granted.
                          </span>
                        </div>
                      </div>

                      {/* Important Warning Notice per Architecture v2.3 */}
                      <div className="alert alert-warning border-warning border-opacity-50 py-2 px-3 small rounded-3 mb-3 d-flex align-items-start gap-2">
                        <i className="bi bi-exclamation-triangle-fill text-warning fs-5 flex-shrink-0 mt-1"></i>
                        <div className="lh-sm">
                          <strong>Verification Policy:</strong> Expert accounts are registered with a{' '}
                          <span className="badge bg-warning text-dark">Pending</span> status. An administrator must verify your credentials before consultation-answering privileges and the "Verified Expert" badge are activated. During pending status, forum access is restricted to read-only browsing.
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label htmlFor="specialization" className="form-label small fw-semibold text-forest mb-1">
                            Primary Specialization <span className="text-danger">*</span>
                          </label>
                          <select
                            id="specialization"
                            name="specialization"
                            className={`form-select rounded-pill px-3 py-2 ${errors.specialization ? 'is-invalid' : ''}`}
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Choose Area of Expertise...</option>
                            <option value="Agronomy & Crop Management">Agronomy & Crop Lifecycle</option>
                            <option value="Plant Pathology & Disease Control">Plant Pathology & Pest Management</option>
                            <option value="Soil Science & Nutrient Balancing">Soil Science & Nutrient Chemistry</option>
                            <option value="Organic & Regenerative Farming">Organic & Sustainable Agriculture</option>
                            <option value="Horticulture & Greenhouse">Horticulture & Cash Crops</option>
                            <option value="Micro-Irrigation & Water Resources">Micro-Irrigation & Water Management</option>
                          </select>
                          {errors.specialization && <div className="invalid-feedback px-1 small">{errors.specialization}</div>}
                        </div>

                        <div className="col-sm-6">
                          <label htmlFor="qualifications" className="form-label small fw-semibold text-forest mb-1">
                            Degrees & Council / License ID <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="qualifications"
                            name="qualifications"
                            className={`form-control rounded-pill px-3 py-2 ${errors.qualifications ? 'is-invalid' : ''}`}
                            placeholder="e.g. M.Sc. Agronomy, Council #8841"
                            value={formData.qualifications}
                            onChange={handleChange}
                            required
                          />
                          {errors.qualifications && <div className="invalid-feedback px-1 small">{errors.qualifications}</div>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VENDOR FIELDS */}
                  {role === 'vendor' && (
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-warning text-dark rounded-pill p-2">
                          <i className="bi bi-shop-window"></i>
                        </span>
                        <div>
                          <strong className="text-forest d-block small">Agricultural Supply Enterprise</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Setup your commercial inventory profile for verified supply listings.
                          </span>
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-sm-6">
                          <label htmlFor="businessName" className="form-label small fw-semibold text-forest mb-1">
                            Business / Enterprise Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="businessName"
                            name="businessName"
                            className={`form-control rounded-pill px-3 py-2 ${errors.businessName ? 'is-invalid' : ''}`}
                            placeholder="e.g. Kisan Agro Nutrients Ltd."
                            value={formData.businessName}
                            onChange={handleChange}
                            required
                          />
                          {errors.businessName && <div className="invalid-feedback px-1 small">{errors.businessName}</div>}
                        </div>

                        <div className="col-sm-6">
                          <label htmlFor="businessCategory" className="form-label small fw-semibold text-forest mb-1">
                            Primary Supply Category <span className="text-danger">*</span>
                          </label>
                          <select
                            id="businessCategory"
                            name="businessCategory"
                            className={`form-select rounded-pill px-3 py-2 ${errors.businessCategory ? 'is-invalid' : ''}`}
                            value={formData.businessCategory}
                            onChange={handleChange}
                            required
                          >
                            <option value="Seeds & Planting Material">Seeds & Planting Material</option>
                            <option value="Fertilizers & Soil Amendments">Fertilizers & Soil Amendments</option>
                            <option value="Irrigation & Farm Machinery">Irrigation & Farm Machinery</option>
                            <option value="Pesticides & Bio-Controls">Pesticides & Bio-Controls</option>
                            <option value="Livestock & Animal Feed">Livestock & Animal Feed</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-text small mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
                        🛍️ <strong>Unified Capabilities:</strong> As a registered Vendor, your account automatically has full Buyer capabilities to browse and purchase items in the marketplace.
                      </div>
                    </div>
                  )}

                  {/* BUYER FIELDS */}
                  {role === 'buyer' && (
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="badge bg-primary text-white rounded-pill p-2">
                          <i className="bi bi-cart4"></i>
                        </span>
                        <div>
                          <strong className="text-forest d-block small">Buyer Profile Type</strong>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Specify whether you are purchasing for household consumption or commercial trade.
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-semibold text-forest d-block mb-1">
                          Buyer Type <span className="text-danger">*</span>
                        </label>
                        <div className="d-flex flex-wrap gap-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="buyerType"
                              id="buyerIndividual"
                              value="individual"
                              checked={formData.buyerType === 'individual'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label small" htmlFor="buyerIndividual">
                              Individual (Consumer / Household)
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="buyerType"
                              id="buyerBusiness"
                              value="business"
                              checked={formData.buyerType === 'business'}
                              onChange={handleChange}
                            />
                            <label className="form-check-label small" htmlFor="buyerBusiness">
                              Business (Commercial Trader / Enterprise)
                            </label>
                          </div>
                        </div>
                      </div>

                      {formData.buyerType === 'business' && (
                        <div>
                          <label htmlFor="organizationName" className="form-label small fw-semibold text-forest mb-1">
                            Business / Organization Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            id="organizationName"
                            name="organizationName"
                            className={`form-control rounded-pill px-3 py-2 ${errors.organizationName ? 'is-invalid' : ''}`}
                            placeholder="e.g. Apex Agri Exports Pvt. Ltd."
                            value={formData.organizationName}
                            onChange={handleChange}
                            required
                          />
                          {errors.organizationName && <div className="invalid-feedback px-1 small">{errors.organizationName}</div>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Terms and Conditions Checkbox */}
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label small text-muted user-select-none" htmlFor="agreeTerms">
                      I agree to the{' '}
                      <button
                        type="button"
                        className="btn btn-link p-0 small text-forest fw-semibold text-decoration-none"
                        onClick={() => setShowTermsModal(true)}
                      >
                        Terms & Conditions and Privacy Policy
                      </button>{' '}
                      including indicative soil advisories and single-seller order rules. <span className="text-danger">*</span>
                    </label>
                    {errors.agreeTerms && <div className="invalid-feedback d-block px-1 small">{errors.agreeTerms}</div>}
                  </div>
                </div>

                {/* 5. Submit Button */}
                <button
                  type="submit"
                  className="btn btn-agri-primary w-100 py-2 fs-6 shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i> Create Free Account
                    </>
                  )}
                </button>
              </form>

              {/* Link to Login */}
              <div className="text-center mt-4 pt-3 border-top border-light-subtle">
                <p className="small text-muted mb-0">
                  Already have an AgriTech account?{' '}
                  <Link to="/login" className="text-forest fw-bold text-decoration-none">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            {/* Navigation back to Home */}
            <div className="text-center mt-4">
              <Link to="/" className="text-muted small text-decoration-none hover-forest">
                <i className="bi bi-arrow-left me-1"></i> Back to AgriTech Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      <TermsModal show={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
};

export default RegisterPage;
