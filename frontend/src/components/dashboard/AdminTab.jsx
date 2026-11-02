import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminTab = () => {
  const [metrics, setMetrics] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricRes, userRes] = await Promise.allSettled([
        api.get('/admin/metrics'),
        api.get('/admin/users'),
      ]);

      if (metricRes.status === 'fulfilled' && metricRes.value.data.metrics) {
        setMetrics(metricRes.value.data.metrics);
      }
      if (userRes.status === 'fulfilled' && userRes.value.data.users) {
        setUsers(userRes.value.data.users);
      }
    } catch (err) {
      console.warn('Admin fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyExpert = async (expertId, status) => {
    setProcessingId(expertId);
    setActionMessage(null);
    try {
      const res = await api.patch(`/admin/experts/${expertId}/verify`, { status });
      setUsers((prev) =>
        prev.map((u) => (u._id === expertId ? res.data.expert : u))
      );
      setActionMessage({
        type: 'success',
        text: `Expert application ${status === 'verified' ? 'approved' : 'rejected'} successfully.`,
      });
      // Refresh metrics
      const mRes = await api.get('/admin/metrics');
      if (mRes.data?.metrics) setMetrics(mRes.data.metrics);
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Verification update failed.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleUserStatus = async (userId, currentActive) => {
    setProcessingId(userId);
    setActionMessage(null);
    try {
      const res = await api.patch(`/admin/users/${userId}/status`, {
        isActive: !currentActive,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? res.data.user : u))
      );
      setActionMessage({
        type: 'success',
        text: `User account ${!currentActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Status toggle failed.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingExperts = users.filter(
    (u) => u.role === 'expert' && u.expertVerificationStatus === 'pending'
  );

  const filteredUsers =
    selectedRoleFilter === 'all'
      ? users
      : users.filter((u) => u.role === selectedRoleFilter);

  return (
    <div>
      {/* Alert banner */}
      {actionMessage && (
        <div
          className={`alert alert-${actionMessage.type} alert-dismissible fade show border-0 rounded-4 shadow-sm p-3 mb-4`}
          role="alert"
        >
          {actionMessage.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setActionMessage(null)}
          ></button>
        </div>
      )}

      {/* Admin KPI Header Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
            <span className="text-muted small fw-semibold">Total Users</span>
            <span className="fs-3 fw-bold text-dark">{metrics?.totalUsers ?? '...'}</span>
            <span className="text-success small" style={{ fontSize: '0.74rem' }}>
              Platform accounts
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
            <span className="text-muted small fw-semibold">Pending Experts</span>
            <span className="fs-3 fw-bold text-warning">{metrics?.pendingExperts ?? '...'}</span>
            <span className="text-warning small" style={{ fontSize: '0.74rem' }}>
              Awaiting review
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
            <span className="text-muted small fw-semibold">Registered Farms</span>
            <span className="fs-3 fw-bold text-success">{metrics?.totalFarms ?? '...'}</span>
            <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
              Active parcels
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
            <span className="text-muted small fw-semibold">Products</span>
            <span className="fs-3 fw-bold text-primary">{metrics?.totalProducts ?? '...'}</span>
            <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
              Vendor catalog
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
            <span className="text-muted small fw-semibold">Orders Placed</span>
            <span className="fs-3 fw-bold text-info">{metrics?.totalOrders ?? '...'}</span>
            <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
              Transactions
            </span>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-2">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
            <span className="text-muted small fw-semibold">Open Queries</span>
            <span className="fs-3 fw-bold text-danger">{metrics?.openConsultations ?? '...'}</span>
            <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
              Agronomist tickets
            </span>
          </div>
        </div>
      </div>

      {/* 1. Pending Expert Verification Queue */}
      <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h3 className="h6 fw-bold text-dark mb-0">
              <i className="bi bi-shield-check text-warning me-2"></i>
              Agronomist Expert Verification Queue
            </h3>
            <p className="text-muted small mb-0">
              Review credential documents, license numbers, and grant verified status to agricultural specialists.
            </p>
          </div>
          <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill px-3 py-1.5 small fw-semibold">
            {pendingExperts.length} Pending Approval
          </span>
        </div>

        {pendingExperts.length === 0 ? (
          <div className="p-4 text-center rounded-3 bg-light">
            <i className="bi bi-check2-all text-success fs-3 mb-1 d-block"></i>
            <span className="text-muted small">No expert accounts currently awaiting verification.</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Expert Name</th>
                  <th>License Number</th>
                  <th>Specialization</th>
                  <th>District / State</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="small">
                {pendingExperts.map((exp) => (
                  <tr key={exp._id}>
                    <td>
                      <strong>{exp.name}</strong>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {exp.email}
                      </div>
                    </td>
                    <td>
                      <code className="text-dark bg-light px-2 py-1 rounded">
                        {exp.expertLicenseNumber || 'N/A'}
                      </code>
                    </td>
                    <td>{exp.expertSpecialization || 'Agronomy'}</td>
                    <td>{exp.district ? `${exp.district}, ${exp.state || ''}` : 'India'}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-success rounded-pill px-3 me-1.5"
                        disabled={processingId === exp._id}
                        onClick={() => handleVerifyExpert(exp._id, 'verified')}
                      >
                        <i className="bi bi-check-lg me-1"></i> Approve
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        disabled={processingId === exp._id}
                        onClick={() => handleVerifyExpert(exp._id, 'rejected')}
                      >
                        <i className="bi bi-x-lg me-1"></i> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Platform User Directory & Status Controls */}
      <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <h3 className="h6 fw-bold text-dark mb-0">
              <i className="bi bi-people text-primary me-2"></i>
              Platform User Directory & Account Governance
            </h3>
            <p className="text-muted small mb-0">
              View registered users across all 5 roles and toggle account active/deactivated status.
            </p>
          </div>

          <div className="d-flex gap-1.5 flex-wrap">
            {['all', 'farmer', 'expert', 'vendor', 'buyer', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRoleFilter(role)}
                className={`btn btn-sm rounded-pill px-3 py-1 text-capitalize ${
                  selectedRoleFilter === role
                    ? 'btn-dark text-white'
                    : 'btn-light text-muted'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">
            <div className="spinner-border spinner-border-sm text-secondary me-2"></div>
            <span className="small text-muted">Loading directory...</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-end">Account Control</th>
                </tr>
              </thead>
              <tbody className="small">
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong className="text-dark">{u.name}</strong>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {u.email}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark text-capitalize px-2.5 py-1 rounded-pill">
                        {u.role}
                      </span>
                      {u.role === 'expert' && (
                        <span
                          className={`badge ms-1 px-2 py-0.5 rounded-pill ${
                            u.expertVerificationStatus === 'verified'
                              ? 'bg-success text-white'
                              : u.expertVerificationStatus === 'rejected'
                              ? 'bg-danger text-white'
                              : 'bg-warning-subtle text-warning-emphasis'
                          }`}
                          style={{ fontSize: '0.68rem' }}
                        >
                          {u.expertVerificationStatus}
                        </span>
                      )}
                    </td>
                    <td>{u.district ? `${u.district}, ${u.state || ''}` : 'Not Specified'}</td>
                    <td>
                      <span
                        className={`badge rounded-pill px-2.5 py-1 ${
                          u.isActive
                            ? 'bg-success-subtle text-success'
                            : 'bg-danger-subtle text-danger'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="text-end">
                      {u.role !== 'admin' && (
                        <button
                          className={`btn btn-sm rounded-pill px-3 py-1 ${
                            u.isActive ? 'btn-outline-danger' : 'btn-outline-success'
                          }`}
                          disabled={processingId === u._id}
                          onClick={() => handleToggleUserStatus(u._id, u.isActive)}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTab;

