import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { id: 'farms', label: 'My Farms', icon: 'bi-geo-alt' },
    { id: 'crops', label: 'Crop Monitoring', icon: 'bi-tree' },
    { id: 'soil', label: 'Soil Health', icon: 'bi-clipboard2-pulse' },
    { id: 'weather', label: 'Weather & Alerts', icon: 'bi-cloud-sun' },
    { id: 'marketplace', label: 'Marketplace', icon: 'bi-shop' },
    { id: 'forum', label: 'Community Forum', icon: 'bi-chat-dots' },
    { id: 'consultation', label: 'Expert Consultation', icon: 'bi-people' },
    ...(user?.role === 'admin'
      ? [{ id: 'admin', label: 'Admin Panel', icon: 'bi-shield-check' }]
      : []),
    { id: 'settings', label: 'Settings', icon: 'bi-gear' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'AT';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.name || 'Ramesh Patel';
  const displayRole = user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal` : 'Farmer Portal';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop d-lg-none"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <aside className={`agri-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="agri-sidebar-brand justify-content-between">
          <Link to="/" className="d-flex align-items-center text-white text-decoration-none">
            <span className="me-2 fs-4 text-warning">🌱</span>
            <span className="fw-bold fs-5 tracking-tight text-white">
              Agri<span style={{ color: 'var(--agri-accent)' }}>Tech</span>
            </span>
          </Link>
          <button
            className="btn btn-link text-white-50 p-0 d-lg-none"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        {/* Farmer Tag */}
        <div className="px-3 pt-3 pb-2">
          <div className="p-2.5 rounded-3 bg-white bg-opacity-10 d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-dark bg-warning"
              style={{ width: '34px', height: '34px', fontSize: '0.82rem' }}
            >
              {getInitials(displayName)}
            </div>
            <div className="overflow-hidden">
              <div className="text-white small fw-bold text-truncate">{displayName}</div>
              <div className="text-white-50" style={{ fontSize: '0.72rem' }}>
                {displayRole}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="agri-sidebar-nav">
          <div className="sidebar-heading">Main Menu</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`agri-sidebar-link w-100 text-start border-0 ${
                activeTab === item.id ? 'active' : ''
              }`}
              style={{ background: activeTab === item.id ? undefined : 'transparent' }}
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="agri-sidebar-footer">
          <button
            onClick={onLogout}
            className="agri-sidebar-link w-100 text-start border-0 text-decoration-none mb-0 bg-transparent"
            style={{ color: '#ffb4a2' }}
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
