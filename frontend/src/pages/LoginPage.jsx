import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthHeader from '../components/auth/AuthHeader';
import PasswordInput from '../components/auth/PasswordInput';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@example.com).';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (statusMessage) {
      setStatusMessage(null);
    }
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
        text: 'Please correct the highlighted errors before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const loggedUser = await login(formData.email.trim(), formData.password);
      setStatusMessage({
        type: 'success',
        text: `Welcome back, ${loggedUser.name}! Logging you into the platform...`,
      });

      // Target redirect (defaults to /dashboard for farmers)
      const destination = location.state?.from?.pathname || '/dashboard';
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      const apiMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Unable to connect to the backend server. Please check your network connection.';
      setStatusMessage({
        type: 'danger',
        text: apiMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      return;
    }
    setForgotSuccess(true);
  };

  return (
    <div className="min-vh-100 bg-soft-gradient d-flex flex-column justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 auth-wrapper">
            {/* Header with AgriTech Branding */}
            <AuthHeader
              title="Sign In to AgriTech"
              subtitle="Access your farm plots, soil diagnostics, marketplace orders, and expert advisories."
            />

            {/* Main Login Card */}
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
                  <div className="flex-grow-1">
                    <div>{statusMessage.text}</div>
                    {statusMessage.type === 'success' && (
                      <div className="mt-2">
                        <Link to="/dashboard" className="btn btn-sm btn-agri-primary rounded-pill px-3 py-1">
                          Proceed to Farmer Dashboard <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn-close small"
                    onClick={() => setStatusMessage(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Email Input */}
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label small fw-semibold text-forest mb-1">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0 rounded-start-pill ps-3">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      id="loginEmail"
                      name="email"
                      className={`form-control rounded-end-pill px-3 py-2 border-start-0 ${
                        errors.email ? 'is-invalid' : ''
                      }`}
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block px-1 mt-1 small">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Input with Show/Hide Toggle */}
                <PasswordInput
                  id="loginPassword"
                  name="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  isInvalid={!!errors.password}
                  errorMessage={errors.password}
                />

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label className="form-check-label small text-muted user-select-none" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-link p-0 small text-forest fw-semibold text-decoration-none"
                    onClick={() => {
                      setForgotEmail(formData.email || '');
                      setForgotSuccess(false);
                      setShowForgotModal(true);
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="btn btn-agri-primary w-100 py-2 fs-6 shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i> Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Link to Registration */}
              <div className="text-center mt-4 pt-3 border-top border-light-subtle">
                <p className="small text-muted mb-0">
                  Don't have an AgriTech account yet?{' '}
                  <Link to="/register" className="text-forest fw-bold text-decoration-none">
                    Register Free
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

      {/* Forgot Password Demo Modal */}
      {showForgotModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(8, 28, 21, 0.65)', backdropFilter: 'blur(4px)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content agri-card border-0 shadow-lg">
              <div className="modal-header bg-forest text-white border-0 py-3">
                <h5 className="modal-title fw-bold fs-6">
                  <i className="bi bi-key-fill me-2 text-mint"></i>
                  Reset Your Password
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowForgotModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                {forgotSuccess ? (
                  <div className="text-center py-3">
                    <div className="d-inline-flex p-3 rounded-circle bg-light-mint text-forest mb-3">
                      <i className="bi bi-envelope-check-fill fs-2"></i>
                    </div>
                    <h6 className="fw-bold text-forest">Password Reset Email Sent!</h6>
                    <p className="small text-muted mb-3">
                      In a production environment, a secure reset link will be sent to{' '}
                      <strong>{forgotEmail}</strong>. (Demo simulation complete).
                    </p>
                    <button
                      type="button"
                      className="btn btn-agri-primary btn-sm px-4"
                      onClick={() => setShowForgotModal(false)}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit}>
                    <p className="small text-muted mb-3">
                      Enter your registered email address and we will dispatch a password recovery link.
                    </p>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-forest">Registered Email</label>
                      <input
                        type="email"
                        className="form-control rounded-pill px-3 py-2"
                        placeholder="name@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm px-3 rounded-pill"
                        onClick={() => setShowForgotModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-agri-primary btn-sm px-4">
                        Send Reset Link
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
