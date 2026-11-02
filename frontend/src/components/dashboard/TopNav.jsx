import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TopNav = ({
  farmerName = 'Ramesh Patel',
  userRole = 'Farmer',
  userLocation = 'Nashik, Maharashtra',
  searchQuery,
  setSearchQuery,
  notifications,
  onMarkAllRead,
  onToggleMobileSidebar,
  onLogout,
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getInitials = (name) => {
    if (!name) return 'AT';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="dashboard-topbar">
      <div className="d-flex align-items-center gap-3">
        {/* Mobile menu button */}
        <button
          className="btn btn-outline-secondary d-lg-none p-1 px-2 border-0"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-4"></i>
        </button>

        {/* Welcome greeting */}
        <div>
          <h1 className="h5 fw-bold mb-0 text-dark">
            Welcome back, <span style={{ color: 'var(--agri-primary)' }}>{farmerName}</span> 👋
          </h1>
          <p className="text-muted small mb-0 d-none d-sm-block">
            Agricultural overview & management portal
          </p>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Search Input */}
        <div className="position-relative d-none d-md-block">
          <i
            className="bi bi-search position-absolute text-muted"
            style={{ left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.88rem' }}
          ></i>
          <input
            type="text"
            className="form-control form-control-sm dashboard-search-input"
            placeholder="Search farms, crops, records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '260px' }}
          />
          {searchQuery && (
            <button
              className="btn btn-link btn-sm position-absolute text-muted p-0"
              style={{ right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => setSearchQuery('')}
            >
              <i className="bi bi-x-circle-fill"></i>
            </button>
          )}
        </div>

        {/* Notification Bell */}
        <div className="position-relative">
          <button
            className="btn btn-light rounded-circle position-relative p-2"
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              setShowProfileMenu(false);
            }}
            aria-label="View notifications"
            style={{ width: '42px', height: '42px' }}
          >
            <i className="bi bi-bell fs-5 text-secondary"></i>
            {unreadCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.65rem' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div
              className="position-absolute end-0 mt-2 card shadow-lg border-0 rounded-4 overflow-hidden"
              style={{ width: '320px', zIndex: 1060 }}
            >
              <div className="card-header bg-white py-2.5 px-3 d-flex justify-content-between align-items-center border-bottom">
                <span className="fw-bold small text-dark">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    className="btn btn-link btn-sm text-decoration-none p-0 text-success fw-semibold"
                    style={{ fontSize: '0.75rem' }}
                    onClick={onMarkAllRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="list-group list-group-flush" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`list-group-item list-group-item-action p-3 border-bottom ${
                      !n.read ? 'bg-light' : ''
                    }`}
                  >
                    <div className="d-flex align-items-start gap-2.5">
                      <i className={`bi ${n.icon} text-success fs-5 mt-0.5`}></i>
                      <div className="flex-grow-1">
                        <div className="fw-semibold small text-dark mb-0.5">{n.title}</div>
                        <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
                          {n.message}
                        </div>
                        <div className="text-secondary small mt-1" style={{ fontSize: '0.7rem' }}>
                          {n.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-footer bg-light text-center py-2">
                <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                  Simulated Demo Notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Menu */}
        <div className="position-relative">
          <button
            className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-2 border-0"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifDropdown(false);
            }}
            aria-label="User Profile"
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, var(--agri-forest), var(--agri-primary))',
              }}
            >
              {getInitials(farmerName)}
            </div>
            <i className="bi bi-chevron-down small text-muted d-none d-sm-inline"></i>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div
              className="position-absolute end-0 mt-2 card shadow-lg border-0 rounded-4 overflow-hidden"
              style={{ width: '240px', zIndex: 1060 }}
            >
              <div className="p-3 border-bottom bg-light">
                <div className="fw-bold text-dark">{farmerName}</div>
                <div className="text-muted small text-capitalize" style={{ fontSize: '0.78rem' }}>
                  {userRole} Member
                </div>
                <div className="badge bg-success-subtle text-success mt-1" style={{ fontSize: '0.7rem' }}>
                  {userLocation}
                </div>
              </div>
              <div className="p-2">
                <Link
                  to="/"
                  className="dropdown-item rounded-2 py-2 px-3 small d-flex align-items-center gap-2 text-dark"
                >
                  <i className="bi bi-house text-muted"></i> Public Home
                </Link>
                <button
                  onClick={onLogout}
                  className="dropdown-item rounded-2 py-2 px-3 small d-flex align-items-center gap-2 text-danger border-0 bg-transparent"
                >
                  <i className="bi bi-box-arrow-right"></i> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
