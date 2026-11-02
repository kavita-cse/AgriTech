import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ForumTab = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [actionMessage, setActionMessage] = useState(null);

  const [newPostData, setNewPostData] = useState({
    title: '',
    content: '',
    tag: 'pest-control',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPendingExpert =
    user?.role === 'expert' && user?.expertVerificationStatus !== 'verified';

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedTag !== 'all') params.tag = selectedTag;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/forum/posts', { params });
      if (res.data && res.data.posts) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.warn('Forum fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedTag]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostData.title.trim() || !newPostData.content.trim()) return;

    setIsSubmitting(true);
    setActionMessage(null);

    try {
      const res = await api.post('/forum/posts', newPostData);
      setPosts((prev) => [res.data.post, ...prev]);
      setShowNewPostModal(false);
      setNewPostData({ title: '', content: '', tag: 'crop-disease' });
      setActionMessage({
        type: 'success',
        text: 'Your discussion thread was published successfully!',
      });
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to publish post.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (postId) => {
    if (isPendingExpert) {
      setActionMessage({
        type: 'warning',
        text: 'Pending experts have read-only forum access until admin verification.',
      });
      return;
    }
    try {
      const res = await api.post(`/forum/posts/${postId}/upvote`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, upvotes: res.data.upvotes } : p
        )
      );
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Could not register upvote.',
      });
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    if (isPendingExpert) {
      setActionMessage({
        type: 'warning',
        text: 'Pending experts have read-only forum access until admin verification.',
      });
      return;
    }

    try {
      const res = await api.post(`/forum/posts/${postId}/comments`, {
        content: text,
      });
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: res.data.comments || [...(p.comments || []), res.data.comment] }
            : p
        )
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Could not post comment.',
      });
    }
  };

  const getTagBadgeClass = (tag) => {
    switch (tag) {
      case 'crop-disease':
        return 'bg-danger-subtle text-danger';
      case 'pest-control':
        return 'bg-warning-subtle text-warning-emphasis';
      case 'fertilizer':
        return 'bg-info-subtle text-info-emphasis';
      case 'irrigation':
        return 'bg-primary-subtle text-primary';
      case 'organic-farming':
        return 'bg-success-subtle text-success';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  };

  return (
    <div>
      {/* Pending Expert Read-Only Banner */}
      {isPendingExpert && (
        <div className="alert alert-warning border-0 rounded-4 shadow-sm p-3 mb-4 d-flex align-items-center gap-3">
          <i className="bi bi-shield-exclamation fs-3 text-warning"></i>
          <div>
            <h6 className="fw-bold mb-1">Expert Profile Pending Admin Verification</h6>
            <p className="mb-0 small text-muted">
              Your agricultural license and credentials are currently under review by platform administrators.
              You have <strong>read-only access</strong> to view community discussions. Discussion publishing and comment posting will unlock upon verification.
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

      {/* Top Controls Header */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h3 className="h5 fw-bold text-dark mb-1">
              <i className="bi bi-chat-left-quote text-success me-2"></i>
              Farmer Community Forum
            </h3>
            <p className="text-muted small mb-0">
              Exchange agronomic knowledge, ask disease queries, and share field observations with verified farmers and experts.
            </p>
          </div>

          {!isPendingExpert && (
            <button
              className="btn btn-agri-primary rounded-pill px-3.5 py-2 fw-semibold d-flex align-items-center gap-2"
              onClick={() => setShowNewPostModal(true)}
            >
              <i className="bi bi-pencil-square"></i> Start Discussion
            </button>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="row g-3 align-items-center mt-3 pt-3 border-top">
          <div className="col-12 col-md-8">
            <div className="d-flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Topics' },
                { id: 'pest-control', label: 'Pest & Disease Control' },
                { id: 'irrigation', label: 'Irrigation & Water' },
                { id: 'fertilizer', label: 'Soil & Fertilizer' },
                { id: 'general', label: 'General Discussion' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTag(t.id)}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-medium ${
                    selectedTag === t.id
                      ? 'btn-success text-white'
                      : 'btn-light text-muted'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-md-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control rounded-start-pill ps-3 small"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-outline-secondary rounded-end-pill px-3" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Post List */}
      {loading ? (
        <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
          <div className="spinner-border text-success mx-auto mb-2" role="status"></div>
          <p className="text-muted small mb-0">Loading community discussions...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
          <i className="bi bi-chat-square-text text-muted fs-1 mb-2"></i>
          <h4 className="h6 fw-bold text-dark">No discussion threads found</h4>
          <p className="text-muted small mb-3">
            Be the first to ask a farming question or share advice with the community.
          </p>
          {!isPendingExpert && (
            <div>
              <button
                className="btn btn-agri-primary btn-sm rounded-pill px-3 py-1.5"
                onClick={() => setShowNewPostModal(true)}
              >
                Create First Discussion
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {posts.map((post) => (
            <div key={post._id} className="card border-0 shadow-sm rounded-4 bg-white p-4">
              <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-success"
                    style={{ width: '38px', height: '38px', fontSize: '0.9rem' }}
                  >
                    {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <strong className="text-dark small">{post.authorName}</strong>
                      <span className="badge bg-light text-muted small text-capitalize px-2 py-0.5">
                        {post.authorRole || 'Farmer'}
                      </span>
                      {post.isExpert && (
                        <span className="badge bg-success text-white small px-2 py-0.5 rounded-pill">
                          <i className="bi bi-patch-check-fill me-1"></i> Verified Expert
                        </span>
                      )}
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                </div>

                <span className={`badge ${getTagBadgeClass(post.tag)} px-2.5 py-1 rounded-pill small text-capitalize`}>
                  {post.tag?.replace('-', ' ')}
                </span>
              </div>

              <h4 className="h6 fw-bold text-dark mt-2 mb-2">{post.title}</h4>
              <p className="text-muted small mb-3" style={{ whiteSpace: 'pre-line' }}>
                {post.content}
              </p>

              {/* Post Footer / Actions */}
              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 d-flex align-items-center gap-1.5"
                    onClick={() => handleUpvote(post._id)}
                    disabled={isPendingExpert}
                  >
                    <i className="bi bi-hand-thumbs-up"></i>
                    <span>{post.upvotes || 0} Upvotes</span>
                  </button>

                  <button
                    className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1 d-flex align-items-center gap-1.5"
                    onClick={() =>
                      setExpandedPostId(expandedPostId === post._id ? null : post._id)
                    }
                  >
                    <i className="bi bi-chat-text"></i>
                    <span>{post.comments?.length || 0} Replies</span>
                  </button>
                </div>
              </div>

              {/* Expandable Comments Section */}
              {expandedPostId === post._id && (
                <div className="mt-3 pt-3 border-top">
                  <h6 className="small fw-bold text-dark mb-2">Replies & Agronomist Comments</h6>

                  {post.comments && post.comments.length > 0 ? (
                    <div className="d-flex flex-column gap-2 mb-3">
                      {post.comments.map((comm, idx) => (
                        <div key={comm._id || idx} className="p-2.5 rounded-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="small fw-semibold text-dark">
                              {comm.authorName}
                              {comm.isExpert && (
                                <span className="badge bg-success-subtle text-success ms-2 small">
                                  Verified Agronomist
                                </span>
                              )}
                            </span>
                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                              {comm.createdAt ? new Date(comm.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                          <p className="mb-0 text-muted small">{comm.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small mb-3">No replies yet. Share your experience below!</p>
                  )}

                  {/* Add Comment Input */}
                  {!isPendingExpert ? (
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-pill ps-3"
                        placeholder="Write a constructive reply or advisory comment..."
                        value={commentInputs[post._id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post._id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post._id);
                        }}
                      />
                      <button
                        className="btn btn-sm btn-agri-primary rounded-pill px-3"
                        onClick={() => handleAddComment(post._id)}
                      >
                        Reply
                      </button>
                    </div>
                  ) : (
                    <div className="text-muted small fst-italic">
                      Replying requires verified account status.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create New Discussion */}
      {showNewPostModal && (
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
                  <i className="bi bi-chat-right-quote-fill"></i> Start New Community Discussion
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowNewPostModal(false)}
                ></button>
              </div>

              <form onSubmit={handleCreatePost}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Discussion Title *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      placeholder="e.g. Yellow leaf curl observations on BT-Cotton parcel"
                      required
                      value={newPostData.title}
                      onChange={(e) =>
                        setNewPostData((p) => ({ ...p, title: e.target.value }))
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Category Topic *</label>
                    <select
                      className="form-select rounded-3"
                      value={newPostData.tag}
                      onChange={(e) =>
                        setNewPostData((p) => ({ ...p, tag: e.target.value }))
                      }
                    >
                      <option value="pest-control">Pest & Disease Control</option>
                      <option value="irrigation">Drip & Irrigation Schedules</option>
                      <option value="fertilizer">Soil & Fertilizer Application</option>
                      <option value="general">General Agricultural Query</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Discussion Content *</label>
                    <textarea
                      className="form-control rounded-3"
                      rows="4"
                      placeholder="Describe your crop symptom, field observation, or advisory question in detail..."
                      required
                      value={newPostData.content}
                      onChange={(e) =>
                        setNewPostData((p) => ({ ...p, content: e.target.value }))
                      }
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setShowNewPostModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-agri-primary rounded-pill px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Topic'}
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

export default ForumTab;
