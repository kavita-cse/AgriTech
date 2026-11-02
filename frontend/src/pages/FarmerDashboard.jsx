import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
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
import AddCropModal from '../components/dashboard/AddCropModal';
import LogSoilModal from '../components/dashboard/LogSoilModal';
import MarketplaceTab from '../components/dashboard/MarketplaceTab';
import ForumTab from '../components/dashboard/ForumTab';
import ConsultationTab from '../components/dashboard/ConsultationTab';
import AdminTab from '../components/dashboard/AdminTab';

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
  const [crops, setCrops] = useState(initialCrops);
  const [soilRecord, setSoilRecord] = useState(initialSoilRecord);
  const [weather, setWeather] = useState(initialWeather);
  const [activities, setActivities] = useState(initialActivities);
  const [notifications, setNotifications] = useState(initialNotifications);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showLogSoilModal, setShowLogSoilModal] = useState(false);
  const [selectedFarmDetails, setSelectedFarmDetails] = useState(null);
  const [actionAlert, setActionAlert] = useState(null);

  // Fetch live database records on component mount
  useEffect(() => {
    const fetchDashboardLiveRecords = async () => {
      try {
        const [farmRes, cropRes, soilRes, weatherRes] = await Promise.allSettled([
          api.get('/farms'),
          api.get('/crops'),
          api.get('/soil'),
          api.get('/weather', { params: { district: user?.district || 'Nashik' } }),
        ]);

        // 1. Process Farms
        if (farmRes.status === 'fulfilled' && farmRes.value.data.farms?.length > 0) {
          const liveFarms = farmRes.value.data.farms.map((f) => ({
            id: f._id,
            _id: f._id,
            name: f.farmName,
            location: `${f.district}, ${f.state}`,
            totalArea: `${f.totalArea} ${f.areaUnit || 'Acres'}`,
            areaNum: f.totalArea,
            mainCrop: f.mainCrop,
            soilType: f.soilType,
            irrigationType: f.irrigationType,
            surveyNumber: f.surveyNumber,
            status: 'Active',
            lastInspected: new Date(f.updatedAt || f.createdAt).toLocaleDateString(),
            notes: f.notes || 'Registered in MongoDB Atlas database.',
            raw: f,
          }));
          setFarms(liveFarms);
        }

        // 2. Process Crops
        if (cropRes.status === 'fulfilled' && cropRes.value.data.crops?.length > 0) {
          const liveCrops = cropRes.value.data.crops.map((c) => ({
            id: c._id,
            _id: c._id,
            name: c.cropName,
            farmName: c.farmId?.farmName || 'Registered Plot',
            healthStatus:
              c.healthStatus === 'stressed'
                ? 'Stressed'
                : c.healthStatus === 'diseased'
                ? 'Diseased'
                : 'Healthy',
            badgeVariant: c.healthStatus === 'healthy' ? 'success' : 'warning',
            growthStage:
              c.currentStage?.charAt(0).toUpperCase() + c.currentStage?.slice(1) ||
              'Vegetative',
            progressPercent: c.progressPercent || 35,
            plantingDate: new Date(c.sowingDate).toLocaleDateString(),
            estimatedHarvest: c.estimatedHarvestDate
              ? new Date(c.estimatedHarvestDate).toLocaleDateString()
              : 'Pending',
            waterSchedule: c.waterRequirement || 'Regular drip',
            icon: 'bi-tree',
            raw: c,
          }));
          setCrops(liveCrops);
        }

        // 3. Process Soil
        if (soilRes.status === 'fulfilled' && soilRes.value.data.soilRecords?.length > 0) {
          const latestSoil = soilRes.value.data.soilRecords[0];
          setSoilRecord({
            farmName: latestSoil.farmId?.farmName || 'Registered Plot',
            testDate: new Date(latestSoil.testDate).toLocaleDateString(),
            sampleId: latestSoil._id.slice(-6).toUpperCase(),
            parameters: {
              ph: {
                value: latestSoil.phLevel,
                status: latestSoil.parameters?.ph?.status || 'Evaluated',
                statusType: latestSoil.parameters?.ph?.statusType || 'success',
                description:
                  latestSoil.parameters?.ph?.advice || 'Optimal nutrient absorption range.',
              },
              nitrogen: {
                value: latestSoil.nitrogenKgPerHa,
                status: latestSoil.parameters?.nitrogen?.status || 'Evaluated',
                statusType: latestSoil.parameters?.nitrogen?.statusType || 'success',
                description:
                  latestSoil.parameters?.nitrogen?.advice || 'Evaluated via rule engine.',
              },
              phosphorus: {
                value: latestSoil.phosphorusKgPerHa,
                status: latestSoil.parameters?.phosphorus?.status || 'Evaluated',
                statusType: latestSoil.parameters?.phosphorus?.statusType || 'warning',
                description:
                  latestSoil.parameters?.phosphorus?.advice || 'Evaluated via rule engine.',
              },
              potassium: {
                value: latestSoil.potassiumKgPerHa,
                status: latestSoil.parameters?.potassium?.status || 'Evaluated',
                statusType: latestSoil.parameters?.potassium?.statusType || 'success',
                description:
                  latestSoil.parameters?.potassium?.advice || 'Evaluated via rule engine.',
              },
            },
            demoAdvisory: latestSoil.disclaimerText || latestSoil.advisoryDisclaimer,
          });
        }

        // 4. Process Weather
        if (weatherRes.status === 'fulfilled' && weatherRes.value.data.weather) {
          const w = weatherRes.value.data.weather;
          setWeather((prev) => ({
            ...prev,
            location: w.location,
            temperature: w.temperature,
            condition: w.condition,
            humidity: w.humidity,
            rainProbability: w.rainProbability || '15%',
            windSpeed: w.windSpeed,
            uvIndex: w.uvIndex || '5 Moderate',
            lastUpdated: w.lastUpdated || 'Live updated',
            isLive: w.isLive,
            dataSourceNotice: w.badgeLabel,
            agriculturalAdvisory: w.advisory,
          }));
        }
      } catch (err) {
        console.warn('Dashboard data initialization notice:', err.message);
      }
    };

    fetchDashboardLiveRecords();
  }, [user?.district]);

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

  // Handler for adding a new farm (persisted to MongoDB Atlas)
  const handleAddFarm = async (farmInput) => {
    try {
      const payload = {
        farmName: farmInput.name,
        totalArea: farmInput.areaNum || parseFloat(farmInput.area) || 5,
        areaUnit: 'acres',
        soilType: farmInput.soilType || 'black',
        irrigationType: farmInput.irrigationType || 'drip',
        surveyNumber: farmInput.surveyNumber || 'Pending Survey Verification',
        district: user?.district || 'Nashik',
        state: user?.state || 'Maharashtra',
        mainCrop: farmInput.mainCrop || 'Mixed Crops',
        notes: farmInput.notes || 'Registered via Farmer Dashboard.',
      };

      const res = await api.post('/farms', payload);
      const saved = res.data.farm;

      const newFarmObj = {
        id: saved._id,
        _id: saved._id,
        name: saved.farmName,
        location: `${saved.district}, ${saved.state}`,
        totalArea: `${saved.totalArea} ${saved.areaUnit || 'Acres'}`,
        areaNum: saved.totalArea,
        mainCrop: saved.mainCrop,
        soilType: saved.soilType,
        irrigationType: saved.irrigationType,
        surveyNumber: saved.surveyNumber,
        status: 'Active',
        lastInspected: 'Just Added',
        notes: saved.notes,
        raw: saved,
      };

      setFarms((prev) => [newFarmObj, ...prev]);
      setActionAlert({
        type: 'success',
        message: `Plot "${saved.farmName}" successfully registered in MongoDB Atlas!`,
      });

      // Record activity
      const newAct = {
        id: `act-${Date.now()}`,
        title: 'New Plot Registered',
        description: `${saved.farmName} (${saved.totalArea} Acres) added to your live portfolio.`,
        timestamp: 'Just now',
        type: 'farm',
        icon: 'bi-geo-alt',
        color: 'success',
      };
      setActivities((prev) => [newAct, ...prev]);
    } catch (err) {
      console.error('Failed to create farm:', err);
      setActionAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to save farm plot.',
      });
    }
  };

  // Handler for adding a new crop (persisted to MongoDB Atlas)
  const handleAddCrop = async (cropFormData) => {
    try {
      const res = await api.post('/crops', {
        farmId: cropFormData.farmId,
        cropName: cropFormData.cropName,
        variety: cropFormData.variety || 'Certified Hybrid',
        sowingDate: cropFormData.sowingDate,
        currentStage: cropFormData.currentStage || 'vegetative',
        progressPercent: Number(cropFormData.progressPercent) || 30,
        waterRequirement: cropFormData.waterRequirement || 'Drip scheduled 3x weekly',
      });
      const saved = res.data.crop;

      const farmObj = farms.find((f) => f.id === saved.farmId || f._id === saved.farmId);
      const newCropObj = {
        id: saved._id,
        _id: saved._id,
        name: saved.cropName,
        farmName: farmObj ? farmObj.name : 'Registered Plot',
        healthStatus: 'Healthy',
        badgeVariant: 'success',
        growthStage:
          saved.currentStage?.charAt(0).toUpperCase() + saved.currentStage?.slice(1) ||
          'Vegetative',
        progressPercent: saved.progressPercent || 30,
        plantingDate: new Date(saved.sowingDate).toLocaleDateString(),
        estimatedHarvest: saved.estimatedHarvestDate
          ? new Date(saved.estimatedHarvestDate).toLocaleDateString()
          : 'Estimated 90 days',
        waterSchedule: saved.waterRequirement,
        icon: 'bi-tree',
        raw: saved,
      };

      setCrops((prev) => [newCropObj, ...prev]);
      setActionAlert({
        type: 'success',
        message: `Crop "${saved.cropName}" registered for live growth monitoring!`,
      });

      const newAct = {
        id: `act-${Date.now()}`,
        title: 'Crop Monitoring Started',
        description: `${saved.cropName} (${saved.currentStage}) added to monitoring schedule.`,
        timestamp: 'Just now',
        type: 'crop',
        icon: 'bi-tree',
        color: 'primary',
      };
      setActivities((prev) => [newAct, ...prev]);
    } catch (err) {
      console.error('Failed to create crop:', err);
      setActionAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to add crop record.',
      });
    }
  };

  // Handler for logging a soil record (evaluated by Soil Rule Engine and stored)
  const handleSaveSoil = async (soilFormData) => {
    try {
      const res = await api.post('/soil', soilFormData);
      const saved = res.data.soilRecord;
      const evaluation = res.data.evaluation || {};
      const farmObj = farms.find((f) => f.id === saved.farmId || f._id === saved.farmId);

      const updatedSoilRecord = {
        farmName: farmObj ? farmObj.name : 'Registered Plot',
        testDate: new Date(saved.testDate).toLocaleDateString(),
        sampleId: saved._id.slice(-6).toUpperCase(),
        parameters: {
          ph: {
            value: saved.phLevel,
            status: evaluation.parameters?.ph?.status || 'Evaluated',
            statusType: evaluation.parameters?.ph?.statusType || 'success',
            description: evaluation.parameters?.ph?.advice || 'pH test evaluated.',
          },
          nitrogen: {
            value: saved.nitrogenKgPerHa,
            status: evaluation.parameters?.nitrogen?.status || 'Evaluated',
            statusType: evaluation.parameters?.nitrogen?.statusType || 'success',
            description: evaluation.parameters?.nitrogen?.advice || 'Nitrogen test evaluated.',
          },
          phosphorus: {
            value: saved.phosphorusKgPerHa,
            status: evaluation.parameters?.phosphorus?.status || 'Evaluated',
            statusType: evaluation.parameters?.phosphorus?.statusType || 'warning',
            description: evaluation.parameters?.phosphorus?.advice || 'Phosphorus test evaluated.',
          },
          potassium: {
            value: saved.potassiumKgPerHa,
            status: evaluation.parameters?.potassium?.status || 'Evaluated',
            statusType: evaluation.parameters?.potassium?.statusType || 'success',
            description: evaluation.parameters?.potassium?.advice || 'Potassium test evaluated.',
          },
        },
        demoAdvisory: saved.disclaimerText || saved.advisoryDisclaimer || evaluation.disclaimerText,
      };

      setSoilRecord(updatedSoilRecord);
      setActionAlert({
        type: 'success',
        message: 'Soil analysis calculated by rule engine and saved with advisory disclaimer!',
      });

      const newAct = {
        id: `act-${Date.now()}`,
        title: 'Soil Test Evaluated',
        description: `Nutrient profile evaluated for ${updatedSoilRecord.farmName}.`,
        timestamp: 'Just now',
        type: 'soil',
        icon: 'bi-clipboard2-pulse',
        color: 'warning',
      };
      setActivities((prev) => [newAct, ...prev]);
    } catch (err) {
      console.error('Failed to log soil record:', err);
      setActionAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to save soil test.',
      });
    }
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
          {/* Action Alert Banner */}
          {actionAlert && (
            <div
              className={`alert alert-${actionAlert.type} alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4`}
              role="alert"
            >
              <i
                className={`bi ${
                  actionAlert.type === 'success'
                    ? 'bi-check-circle-fill'
                    : 'bi-exclamation-triangle-fill'
                } me-2`}
              ></i>
              {actionAlert.message}
              <button
                type="button"
                className="btn-close"
                onClick={() => setActionAlert(null)}
              ></button>
            </div>
          )}

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
                {activeTab === 'admin' && 'Platform Administration & Expert Verification'}
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

          {/* 1. Overview Summary Cards (visible on Dashboard or My Farms) */}
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
                  trend="Atlas DB"
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
                  trend={`${crops.length} Varieties`}
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  title="Soil Records"
                  value={soilRecord ? 'Active' : 'Pending'}
                  subtitle="Rule engine profile"
                  icon="bi-clipboard2-pulse-fill"
                  iconBg="bg-warning-subtle"
                  iconColor="text-warning"
                  trend="Evaluated"
                />
              </div>
              <div className="col-12 col-sm-6 col-xl-3">
                <StatCard
                  title="Upcoming Activities"
                  value={`${activities.length} Events`}
                  subtitle="Spraying & irrigation"
                  icon="bi-calendar-check-fill"
                  iconBg="bg-info-subtle"
                  iconColor="text-info"
                  trend="Scheduled"
                />
              </div>
            </div>
          )}

          {/* 2. Farm Management Section */}
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
                    <div key={farm.id || farm._id} className="col-12 col-md-6 col-xl-4">
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

          {/* 3. Crop Monitoring Section */}
          {(activeTab === 'dashboard' || activeTab === 'crops') && (
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="h5 fw-bold text-dark mb-0">Crop Growth & Phenology</h3>
                  <p className="text-muted small mb-0">
                    Real-time growth stages, water schedules and harvest timelines
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-muted small px-3 py-1.5 rounded-pill">
                    {filteredCrops.length} Monitored Varieties
                  </span>
                  <button
                    className="btn btn-outline-success btn-sm rounded-pill px-3"
                    onClick={() => setShowAddCropModal(true)}
                  >
                    <i className="bi bi-plus-lg me-1"></i> Add Crop
                  </button>
                </div>
              </div>

              {filteredCrops.length === 0 ? (
                <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
                  <i className="bi bi-tree text-muted fs-1 mb-2"></i>
                  <h4 className="h6 fw-bold text-dark">No crops found</h4>
                  <p className="text-muted small mb-3">No crops match your search criteria "{searchQuery}".</p>
                  <button
                    className="btn btn-sm btn-agri-primary rounded-pill px-3 py-1.5"
                    onClick={() => setShowAddCropModal(true)}
                  >
                    Add Your First Crop
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {filteredCrops.map((crop) => (
                    <div key={crop.id || crop._id} className="col-12 col-md-6 col-xl-3">
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
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="h6 fw-bold text-dark mb-0">Soil Health & Nutrients</h4>
                    <button
                      className="btn btn-sm btn-outline-warning rounded-pill px-3"
                      onClick={() => setShowLogSoilModal(true)}
                    >
                      <i className="bi bi-clipboard2-plus me-1"></i> Log Soil Test
                    </button>
                  </div>
                  <SoilHealthCard soilRecord={soilRecord} />
                </div>
              )}

              {/* Weather & Alerts */}
              {(activeTab === 'dashboard' || activeTab === 'weather') && (
                <div className={activeTab === 'weather' ? 'col-12' : 'col-12 col-xl-5'}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="h6 fw-bold text-dark mb-0">Micro-Climate Intelligence</h4>
                    <span className="badge bg-light text-muted small px-2.5 py-1 rounded-pill">
                      {weather?.location || 'Nashik Region'}
                    </span>
                  </div>
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
                  {/* Agronomist Advisory Callout */}
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

          {/* 6. Fully Integrated Tabs: Marketplace, Forum, Consultation, Admin, Settings */}
          {activeTab === 'marketplace' && <MarketplaceTab user={user} />}

          {activeTab === 'forum' && <ForumTab user={user} />}

          {activeTab === 'consultation' && <ConsultationTab user={user} crops={crops} />}

          {activeTab === 'admin' && <AdminTab />}

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

      {/* Interactive Modal: Add Crop */}
      <AddCropModal
        isOpen={showAddCropModal}
        onClose={() => setShowAddCropModal(false)}
        farms={farms}
        onAddCrop={handleAddCrop}
      />

      {/* Interactive Modal: Log Soil Test */}
      <LogSoilModal
        isOpen={showLogSoilModal}
        onClose={() => setShowLogSoilModal(false)}
        farms={farms}
        onSaveSoil={handleSaveSoil}
      />
    </div>
  );
};

export default FarmerDashboard;
