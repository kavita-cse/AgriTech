import React, { useState } from 'react';

const PasswordInput = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = 'Enter password',
  isInvalid = false,
  errorMessage = '',
  helpText = '',
  required = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label small fw-semibold text-forest mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="input-group input-group-agri has-validation">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`form-control px-3 py-2 ${isInvalid ? 'is-invalid' : ''}`}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={name === 'confirmPassword' ? 'new-password' : name === 'password' ? 'current-password' : 'off'}
        />
        <button
          className="btn btn-password-toggle px-3"
          type="button"
          onClick={togglePasswordVisibility}
          title={showPassword ? 'Hide password' : 'Show password'}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
        </button>
        {isInvalid && (
          <div className="invalid-feedback d-block px-1 mt-1 small">
            {errorMessage}
          </div>
        )}
      </div>
      {helpText && !isInvalid && (
        <div className="form-text small px-1 mt-1" style={{ fontSize: '0.75rem' }}>
          {helpText}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;

