import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ConsultationTab = ({ user, crops = [] }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedTicketForAnswer, setSelectedTicketForAnswer] = useState(null);
  const [expertAnswerText, setExpertAnswerText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New ticket form data
  const [requestData, setRequestData] = useState({
    querySubject: '',
    queryDescription: '',
    cropId: '',
  });

  const isExpert = user?.role === 'expert';
  const isVerifiedExpert = isExpert && user?.expertVerificationStatus === 'verified';
  const isPendingExpert = isExpert && user?.expertVerificationStatus !== 'verified';

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      // If verified expert or admin, fetch open tickets or all
      const endpoint = isVerifiedExpert ? '/consultations/open' : '/consultations/my';
      const res = await api.get(endpoint);
      if (res.data && res.data.consultations) {
        setConsultations(res.data.consultations);
      }
    } catch (err) {
      console.warn('Consultations fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [user?.role, user?.expertVerificationStatus]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!requestData.querySubject.trim() || !requestData.queryDescription.trim()) return;

    setIsSubmitting(true);
    setActionMessage(null);

    try {
      const res = await api.post('/consultations', requestData);
      setConsultations((prev) => [res.data.consultation, ...prev]);
      setShowRequestModal(false);
      setRequestData({ querySubject: '', queryDescription: '', cropId: '' });
      setActionMessage({
        type: 'success',
        text: 'Agronomist consultation ticket submitted successfully! A verified expert will review it.',
      });
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to submit consultation query.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!expertAnswerText.trim() || !selectedTicketForAnswer) return;

    setIsSubmitting(true);
    setActionMessage(null);

    try {
      const res = await api.put(`/consultations/${selectedTicketForAnswer._id}/respond`, {
        expertResponse: expertAnswerText.trim(),
      });
      setConsultations((prev) =>
        prev.map((c) =>
          c._id === selectedTicketForAnswer._id ? res.data.consultation : c
        )
      );
      setSelectedTicketForAnswer(null);
      setExpertAnswerText('');
      setActionMessage({
        type: 'success',
        text: 'Consultation response successfully submitted and delivered to the farmer.',
      });
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to submit response.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Notice for Pending Experts */}
      {isPendingExpert && (
        <div className="alert alert-warning border-0 rounded-4 shadow-sm p-4 mb-4 d-flex align-items-center gap-3">
          <i className="bi bi-shield-exclamation fs-2 text-warning"></i>
          <div>
            <h5 className="h6 fw-bold mb-1">Expert Account Pending Verification</h5>
            <p className="mb-0 small text-muted">
              Your agricultural license and credentials are under review by AgriTech administrators.
              Once verified, you will be able to claim and provide advisory recommendations for farmer consultation tickets.
            </p>
          </div>
        </div>
      )}

      {/* Action Notification */}
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

      {/* Header Card */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-success-subtle text-success small px-2.5 py-1 rounded-pill">
                <i className="bi bi-award-fill me-1"></i> Certified Agronomists
              </span>
              {isVerifiedExpert && (
                <span className="badge bg-primary-subtle text-primary small px-2.5 py-1 rounded-pill">
                  Open Query Queue
                </span>
              )}
            </div>
            <h3 className="h5 fw-bold text-dark mb-1">Expert Agronomist Consultation Portal</h3>
            <p className="text-muted small mb-0">
              {isVerifiedExpert
                ? 'Review open consultation requests from farmers and provide structured diagnostic guidance.'
                : 'Directly consult with certified agricultural scientists, soil specialists, and plant pathologists.'}
            </p>
          </div>

          {!isExpert && (
            <button
              className="btn btn-agri-primary rounded-pill px-3.5 py-2 fw-semibold d-flex align-items-center gap-2"
              onClick={() => setShowRequestModal(true)}
            >
              <i className="bi bi-patch-question"></i> Request Consultation
            </button>
          )}
        </div>
      </div>

      {/* Ticket List */}
      {loading ? (
        <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
          <div className="spinner-border text-success mx-auto mb-2" role="status"></div>
          <p className="text-muted small mb-0">Loading consultation records...</p>
        </div>
      ) : consultations.length === 0 ? (
        <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
          <i className="bi bi-chat-heart text-muted fs-1 mb-2"></i>
          <h4 className="h6 fw-bold text-dark">No consultation tickets found</h4>
          <p className="text-muted small mb-3">
            {isVerifiedExpert
              ? 'There are currently no open farmer queries awaiting diagnostic response.'
              : 'You have not submitted any consultation queries yet.'}
          </p>
          {!isExpert && (
            <div>
              <button
                className="btn btn-agri-primary btn-sm rounded-pill px-3 py-1.5"
                onClick={() => setShowRequestModal(true)}
              >
                Submit New Query
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {consultations.map((ticket) => (
            <div key={ticket._id} className="card border-0 shadow-sm rounded-4 bg-white p-4">
              <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span
                      className={`badge px-2.5 py-1 rounded-pill small fw-semibold ${
                        ticket.status === 'answered'
                          ? 'bg-success-subtle text-success'
                          : 'bg-warning-subtle text-warning-emphasis'
                      }`}
                    >
                      <i
                        className={`bi ${
                          ticket.status === 'answered'
                            ? 'bi-check-circle-fill'
                            : 'bi-hourglass-split'
                        } me-1`}
                      ></i>
                      {ticket.status === 'answered' ? 'Answered' : 'Awaiting Expert Review'}
                    </span>
                    {ticket.cropName && (
                      <span className="badge bg-light text-muted small px-2 py-0.5">
                        <i className="bi bi-tree me-1"></i> {ticket.cropName}
                      </span>
                    )}
                  </div>
                  <h4 className="h6 fw-bold text-dark mb-1">{ticket.querySubject}</h4>
                  <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                    Submitted by <strong>{ticket.farmerName || 'Farmer'}</strong> on{' '}
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Recent'}
                  </p>
                </div>

                {isVerifiedExpert && ticket.status === 'open' && (
                  <button
                    className="btn btn-outline-success btn-sm rounded-pill px-3 py-1"
                    onClick={() => {
                      setSelectedTicketForAnswer(ticket);
                      setExpertAnswerText('');
                    }}
                  >
                    <i className="bi bi-reply-fill me-1"></i> Answer Ticket
                  </button>
                )}
              </div>

              {/* Farmer's Query Text */}
              <div className="p-3 rounded-3 bg-light my-2">
                <div className="text-muted small fw-semibold mb-1">Farmer's Observation / Query:</div>
                <p className="mb-0 text-dark small" style={{ whiteSpace: 'pre-line' }}>
                  {ticket.queryDescription}
                </p>
              </div>

              {/* Expert's Advisory Response if Answered */}
              {ticket.status === 'answered' && (
                <div className="mt-3 p-3.5 rounded-3 border-start border-4 border-success bg-success-subtle bg-opacity-25">
                  <div className="d-flex justify-content-between align-items-center mb-1.5">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-patch-check-fill text-success fs-5"></i>
                      <strong className="text-success small">
                        Expert Agronomist Advice • {ticket.expertName || 'Verified Agronomist'}
                      </strong>
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {ticket.answeredAt ? new Date(ticket.answeredAt).toLocaleDateString() : 'Answered'}
                    </span>
                  </div>
                  <p className="mb-0 text-dark small" style={{ whiteSpace: 'pre-line' }}>
                    {ticket.expertResponse}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Farmer Submits New Ticket */}
      {showRequestModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white py-3 px-4">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-person-video"></i> Request Agronomist Consultation
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowRequestModal(false)}
                ></button>
              </div>

              <form onSubmit={handleCreateRequest}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Subject / Problem Title *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Leaf discoloration & stem borer symptoms in Soybean"
                      required
                      value={requestData.querySubject}
                      onChange={(e) =>
                        setRequestData((p) => ({ ...p, querySubject: e.target.value }))
                      }
                    />
                  </div>

                  {crops.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-dark">Related Crop Plot (Optional)</label>
                      <select
                        className="form-select rounded-3"
                        value={requestData.cropId}
                        onChange={(e) =>
                          setRequestData((p) => ({ ...p, cropId: e.target.value }))
                        }
                      >
                        <option value="">-- Select Crop (Optional) --</option>
                        {crops.map((c) => (
                          <option key={c.id || c._id} value={c.id || c._id}>
                            {c.name || c.cropName} ({c.farmName || 'Farm Plot'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Detailed Observation & Field Symptoms *
                    </label>
                    <textarea
                      className="form-control rounded-3"
                      rows="4"
                      placeholder="Describe symptoms: leaf curl, chlorosis, moisture levels, pesticide history, soil changes..."
                      required
                      value={requestData.queryDescription}
                      onChange={(e) =>
                        setRequestData((p) => ({ ...p, queryDescription: e.target.value }))
                      }
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setShowRequestModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-agri-primary rounded-pill px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Expert Submits Response */}
      {selectedTicketForAnswer && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white py-3 px-4">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-clipboard2-check"></i> Agronomist Advisory Response
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedTicketForAnswer(null)}
                ></button>
              </div>

              <form onSubmit={handleAnswerSubmit}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-light rounded-3 mb-3">
                    <h6 className="fw-bold text-dark small mb-1">
                      Query: {selectedTicketForAnswer.querySubject}
                    </h6>
                    <p className="text-muted small mb-0">
                      {selectedTicketForAnswer.queryDescription}
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Professional Diagnostic & Recommended Treatment *
                    </label>
                    <textarea
                      className="form-control rounded-3"
                      rows="5"
                      placeholder="Specify diagnosis, recommended bio-agent / chemical dosages, irrigation adjustments, and preventative steps..."
                      required
                      value={expertAnswerText}
                      onChange={(e) => setExpertAnswerText(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setSelectedTicketForAnswer(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-agri-primary rounded-pill px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Deliver Recommendation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationTab;

