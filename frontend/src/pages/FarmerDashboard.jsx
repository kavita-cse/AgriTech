import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import TopNav from '../components/dashboard/TopNav';
import StatCard from '../components/dashboard/StatCard';
import FarmCard from '../components/dashboard/FarmCard';
import CropCard from '../components/dashboard/CropCard';
import SoilHealthCard from '../components/dashboard/SoilHealthCard';
import WeatherCard from '../components/dashboard/WeatherCard';
import RecentActivities from '../components/dashboard/RecentActivities';
import AddFarmModal from '../components/dashboard/AddFarmModal';
import FarmDetailsModal from '../components/dashboard/FarmDetailsModal';

import {
  initialFarmerProfile,
  initialFarms,
  initialCrops,
  initialSoilRecord,
  initialWeather,
  initialActivities,
  initialNotifications,
} from '../data/mockDashboardData';

const FarmerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile] = useState(initialFarmerProfile);
  const [farms, setFarms] = useState(initialFarms);
  const [crops] = useState(initialCrops);
  const [soilRecord] = useState(initialSoilRecord);
  const [weather] = useState(initialWeather);
  const [activities, setActivities] = useState(initialActivities);
  const [notifications, setNotifications] = useState(initialNotifications);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFarmDetails, setSelectedFarmDetails] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.name || profile.name;
  const displayLocation = user?.district
    ? `${user.district}${user.state ? `, ${user.state}` : ''}`
    : profile.district;
  const displayRoleBadge = user?.role
    ? `Verified ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`
    : profile.membership;

  // Filtered lists based on search query
  const filteredFarms = useMemo(() => {
    if (!searchQuery.trim()) return farms;
    const q = searchQuery.toLowerCase();
    return farms.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.mainCrop.toLowerCase().includes(q)
    );
  }, [farms, searchQuery]);

  const filteredCrops = useMemo(() => {
    if (!searchQuery.trim()) return crops;
    const q = searchQuery.toLowerCase();
    return crops.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.farmName.toLowerCase().includes(q) ||
        c.growthStage.toLowerCase().includes(q)
    );
  }, [crops, searchQuery]);

  // Handler for adding a new farm
  const handleAddFarm = (newFarm) => {
    setFarms((prev) => [newFarm, ...prev]);

    // Record activity
    const newAct = {
      id: `act-${Date.now()}`,
      title: 'New Plot Registered',
      description: `${newFarm.name} (${newFarm.totalArea}) added to your farm portfolio.`,
      timestamp: 'Just now',
      type: 'farm',
      icon: 'bi-geo-alt',
      color: 'success',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Top Navigation */}
        <TopNav
          farmerName={displayName}
          userRole={user?.role || 'Farmer'}
          userLocation={displayLocation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
          onLogout={handleLogout}
        />

        {/* Dashboard Body */}
        <main className="p-3.5 p-lg-4 flex-grow-1">
          {/* Section Breadcrumbs / Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-success-subtle text-success px-2.5 py-1 rounded-pill small fw-semibold">
                  {displayRoleBadge}
                </span>
                <span className="text-muted small">
                  <i className="bi bi-geo-alt me-1"></i>
                  {displayLocation}
                </span>
              </div>
              <h2 className="h4 fw-bold text-dark mb-0">
                {activeTab === 'dashboard' && 'Farmer Operations Center'}
                {activeTab === 'farms' && 'My Farm Parcels'}
                {activeTab === 'crops' && 'Crop Growth Monitoring'}
                {activeTab === 'soil' && 'Soil Health & Fertility Records'}
                {activeTab === 'weather' && 'Micro-Climate & Weather Alerts'}
                {activeTab === 'marketplace' && 'AgriTech Agri-Marketplace'}
                {activeTab === 'forum' && 'Farmer Community Forum'}
                {activeTab === 'consultation' && 'Expert Agronomist Consultation'}
                {activeTab === 'settings' && 'Account Settings'}
              </h2>
            </div>

            {/* Quick Action Buttons */}
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-agri-primary btn-sm px-3.5 py-2 rounded-pill fw-semibold shadow-sm d-flex align-items-center gap-1.5"
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-plus-circle-fill"></i> Add New Farm
              </button>
            </div>
          </div>

          {/* Search notice if active query */}
          {searchQuery && (
            <div className="alert alert-info border-0 rounded-4 p-3 mb-4 d-flex justify-content-between align-items-center">
              <div>
                <i className="bi bi-search me-2"></i>
                Filtering results for: <strong>"{searchQuery}"</strong> (Found {filteredFarms.length} farms, {filteredCrops.length} crops)
              </div>
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* 1. Overview Summary Cards (always visible on Dashboard tab or all) */}
          {(activeTab === 'dashboard' || activeTab === 'farms') && (
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  title="Total Farms"
                  value={farms.length}
                  subtitle="Active agricultural parcels"
                  icon="bi-geo-alt-fill"
                  iconBg="bg-success-subtle"
                  iconColor="text-success"
                  trend="Verified"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  title="Active Crops"
                  value={crops.length}
                  subtitle="In cultivation this season"
                  icon="bi-tree-fill"
                  iconBg="bg-primary-subtle"
                  iconColor="text-primary"
                  trend="4 Varieties"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  title="Soil Records"
                  value="6 Tests"
                  subtitle="Simulated lab profile"
                  icon="bi-clipboard2-pulse-fill"
                  iconBg="bg-warning-subtle"
                  iconColor="text-warning"
                  trend="Demo"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  title="Upcoming Activities"
                  value="2 Tasks"
                  subtitle="Spraying & irrigation"
                  icon="bi-calendar-check-fill"
                  iconBg="bg-info-subtle"
                  iconColor="text-info"
                  trend="Scheduled"
                />
              </div>
            </div>
          )}

          {/* 2. Farm Management Preview */}
          {(activeTab === 'dashboard' || activeTab === 'farms') && (
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="h5 fw-bold text-dark mb-0">My Farm Holdings</h3>
                  <p className="text-muted small mb-0">
                    Manage your registered agricultural land parcels and plot attributes
                  </p>
                </div>
                <button
                  className="btn btn-outline-success btn-sm rounded-pill px-3"
                  onClick={() => setShowAddModal(true)}
                >
                  <i className="bi bi-plus-lg me-1"></i> Add Plot
                </button>
              </div>

              {filteredFarms.length === 0 ? (
                <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
                  <i className="bi bi-search text-muted fs-1 mb-2"></i>
                  <h4 className="h6 fw-bold text-dark">No farms found</h4>
                  <p className="text-muted small mb-3">No farms match your search criteria "{searchQuery}".</p>
                  <div>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => setSearchQuery('')}>
                      Clear Search Filter
                    </button>
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  {filteredFarms.map((farm) => (
                    <div key={farm.id} className="col-12 col-md-6 col-xl-4">
                      <FarmCard
                        farm={farm}
                        onViewDetails={(f) => setSelectedFarmDetails(f)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 3. Crop Monitoring Preview */}
          {(activeTab === 'dashboard' || activeTab === 'crops') && (
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="h5 fw-bold text-dark mb-0">Crop Growth & Phenology</h3>
                  <p className="text-muted small mb-0">
                    Real-time growth stages, water schedules and harvest timelines
                  </p>
                </div>
                <span className="badge bg-light text-muted small px-3 py-1.5 rounded-pill">
                  {filteredCrops.length} Monitored Varieties
                </span>
              </div>

              {filteredCrops.length === 0 ? (
                <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
                  <i className="bi bi-tree text-muted fs-1 mb-2"></i>
                  <h4 className="h6 fw-bold text-dark">No crops found</h4>
                  <p className="text-muted small mb-0">No crops match your search criteria "{searchQuery}".</p>
                </div>
              ) : (
                <div className="row g-3">
                  {filteredCrops.map((crop) => (
                    <div key={crop.id} className="col-12 col-md-6 col-xl-3">
                      <CropCard crop={crop} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 4. Soil Health & Weather Grid */}
          {(activeTab === 'dashboard' || activeTab === 'soil' || activeTab === 'weather') && (
            <div className="row g-4 mb-5">
              {/* Soil Health Overview */}
              {(activeTab === 'dashboard' || activeTab === 'soil') && (
                <div className={activeTab === 'soil' ? 'col-12' : 'col-12 col-xl-7'}>
                  <SoilHealthCard soilRecord={soilRecord} />
                </div>
              )}

              {/* Weather & Alerts */}
              {(activeTab === 'dashboard' || activeTab === 'weather') && (
                <div className={activeTab === 'weather' ? 'col-12' : 'col-12 col-xl-5'}>
                  <WeatherCard weather={weather} />
                </div>
              )}
            </div>
          )}

          {/* 5. Recent Activities Timeline (Visible on Dashboard tab) */}
          {activeTab === 'dashboard' && (
            <section className="mb-4">
              <div className="row">
                <div className="col-12 col-lg-8">
                  <RecentActivities activities={activities} />
                </div>
                <div className="col-12 col-lg-4 mt-4 mt-lg-0">
                  {/* Quick Agronomist Support Callout */}
                  <div className="card border-0 shadow-sm rounded-4 bg-white h-100 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div className="badge bg-warning-subtle text-warning-emphasis mb-2 px-3 py-1.5 rounded-pill small fw-semibold">
                        Agronomist Advisory
                      </div>
                      <h3 className="h6 fw-bold text-dark mb-2">Need an Expert Consultation?</h3>
                      <p className="text-muted small mb-4">
                        Connect with verified agricultural scientists and soil specialists for crop disease diagnostics and nutrient plans.
                      </p>
                    </div>
                    <div>
                      <button
                        className="btn btn-outline-success w-100 rounded-pill fw-semibold py-2 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => setActiveTab('consultation')}
                      >
                        <i className="bi bi-person-video"></i> Request Consultation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 6. Dedicated Tab Placeholders for Marketplace, Forum, Consultation, Settings */}
          {activeTab === 'marketplace' && (
            <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
              <i className="bi bi-shop text-success fs-1 mb-3"></i>
              <h3 className="h5 fw-bold text-dark">AgriTech Marketplace</h3>
              <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '480px' }}>
                Browse seeds, bio-fertilizers, organic pesticides, and farm tools directly from verified suppliers. Single-vendor checkout rule is enforced in Phase 3.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <Link to="/" className="btn btn-agri-primary rounded-pill px-4">
                  Explore Landing Page Products
                </Link>
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => setActiveTab('dashboard')}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

          {activeTab === 'forum' && (
            <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
              <i className="bi bi-chat-dots text-primary fs-1 mb-3"></i>
              <h3 className="h5 fw-bold text-dark">Farmer Community Forum</h3>
              <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '480px' }}>
                Share knowledge, pest treatment observations, and crop management practices with fellow farmers across your agro-climatic region.
              </p>
              <button
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={() => setActiveTab('dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {activeTab === 'consultation' && (
            <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
              <i className="bi bi-people text-warning fs-1 mb-3"></i>
              <h3 className="h5 fw-bold text-dark">Expert Consultation Portal</h3>
              <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '480px' }}>
                Book one-on-one sessions with certified agronomists. Upload crop images and soil cards to receive structured diagnostic recommendations.
              </p>
              <button
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={() => setActiveTab('dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card border-0 rounded-4 shadow-sm p-4 bg-white" style={{ maxWidth: '640px' }}>
              <h3 className="h6 fw-bold text-dark mb-3">Farmer Profile & Preferences</h3>
              <div className="mb-3">
                <label className="form-label small text-muted">Full Name</label>
                <input type="text" className="form-control" defaultValue={displayName} key={displayName} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted">Registered Role</label>
                <input type="text" className="form-control text-capitalize" defaultValue={user?.role || profile.role} key={user?.role} readOnly />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted">District & Region</label>
                <input type="text" className="form-control" defaultValue={displayLocation} key={displayLocation} readOnly />
              </div>
              <div className="mb-4">
                <label className="form-label small text-muted">Contact Email</label>
                <input type="text" className="form-control" defaultValue={user?.email || profile.email} key={user?.email} readOnly />
              </div>
              <button
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={() => setActiveTab('dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Interactive Modal: Add Farm */}
      <AddFarmModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddFarm={handleAddFarm}
      />

      {/* Interactive Modal: Farm Plot Details */}
      <FarmDetailsModal
        farm={selectedFarmDetails}
        isOpen={Boolean(selectedFarmDetails)}
        onClose={() => setSelectedFarmDetails(null)}
      />
    </div>
  );
};

export default FarmerDashboard;

