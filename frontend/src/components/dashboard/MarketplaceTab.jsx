import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MarketplaceTab = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    deliveryAddress: 'Farm House, Dindori Road, Nashik',
    contactPhone: user?.phone || '9876543210',
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const fetchProductsAndCart = async () => {
    try {
      setLoading(true);
      const [prodRes, cartRes] = await Promise.allSettled([
        api.get('/products'),
        api.get('/cart'),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.data.products) {
        setProducts(prodRes.value.data.products);
      }
      if (cartRes.status === 'fulfilled' && cartRes.value.data.cart) {
        setCart(cartRes.value.data.cart);
      }
    } catch (e) {
      console.warn('Marketplace fetch notice:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCart();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      setActionMessage(null);
      const res = await api.post('/cart/items', {
        productId: product._id,
        quantity: 1,
      });
      setCart(res.data.cart);
      setActionMessage({
        type: 'success',
        text: `Added "${product.title}" to cart.`,
      });
    } catch (err) {
      setActionMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to add item to cart.',
      });
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      setCart(res.data.cart);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingOrder(true);
    setActionMessage(null);

    try {
      const res = await api.post('/orders', checkoutData);
      setCart(null);
      setShowCheckoutModal(false);
      setActionMessage({
        type: 'success',
        text: `Order placed successfully! Order ID: ${res.data.order._id}. Total Amount: ₹${res.data.order.totalAmount}`,
      });
      // Refresh cart
      fetchProductsAndCart();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Checkout failed. Please ensure all items belong to a single seller.';
      setActionMessage({
        type: 'danger',
        text: msg,
      });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const cartItemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <div className="marketplace-tab">
      {/* Alert banner */}
      {actionMessage && (
        <div
          className={`alert alert-${actionMessage.type} alert-dismissible fade show rounded-4 mb-4 d-flex align-items-center justify-content-between`}
          role="alert"
        >
          <div>
            <i
              className={`bi ${
                actionMessage.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'
              } me-2`}
            ></i>
            {actionMessage.text}
          </div>
          <button
            type="button"
            className="btn-close small"
            onClick={() => setActionMessage(null)}
          ></button>
        </div>
      )}

      {/* Top Banner & Cart summary */}
      <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <div className="badge bg-success-subtle text-success mb-2 px-3 py-1 rounded-pill small fw-semibold">
              <i className="bi bi-shield-check me-1"></i> Verified Agri-Suppliers & Farmers
            </div>
            <h3 className="h5 fw-bold text-dark mb-1">AgriTech Marketplace</h3>
            <p className="text-muted small mb-0">
              Direct farm inputs, bio-fertilizers, seeds, and equipment with verified single-seller checkout.
            </p>
          </div>

          {/* Cart Pill */}
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-sm-block">
              <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>
                Cart Subtotal
              </span>
              <strong className="text-success fs-5">₹{cartTotal.toLocaleString()}</strong>
            </div>
            <button
              className="btn btn-agri-primary rounded-pill px-4 py-2 position-relative d-flex align-items-center gap-2"
              onClick={() => setShowCheckoutModal(true)}
              disabled={cartItemCount === 0}
            >
              <i className="bi bi-cart3"></i>
              <span>View Cart & Checkout</span>
              {cartItemCount > 0 && (
                <span className="badge bg-danger rounded-pill ms-1">{cartItemCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
          {['all', 'seeds', 'fertilizers', 'equipment', 'produce'].map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-semibold text-capitalize ${
                selectedCategory === cat ? 'btn-success' : 'btn-light border'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All Catalog' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="text-muted small mt-2">Loading catalog items...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card border-0 rounded-4 shadow-sm p-5 text-center bg-white">
          <i className="bi bi-box-seam text-muted fs-1 mb-2"></i>
          <h4 className="h6 fw-bold text-dark">No products found</h4>
          <p className="text-muted small">No items currently available in the selected category.</p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredProducts.map((p) => (
            <div key={p._id} className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 h-100 bg-white agri-card">
                <div className="card-body p-3.5 d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-light text-muted small text-capitalize rounded-pill px-2.5 py-1">
                      {p.category}
                    </span>
                    <span className="badge bg-success-subtle text-success small rounded-pill">
                      In Stock: {p.stockQuantity}
                    </span>
                  </div>

                  <h4 className="h6 fw-bold text-dark mb-1 text-truncate" title={p.title}>
                    {p.title}
                  </h4>
                  <p className="text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                    {p.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-baseline mb-3 pt-2 border-top">
                    <div>
                      <span className="fs-5 fw-bold text-dark">₹{p.price}</span>
                      <span className="text-muted small"> / {p.unit}</span>
                    </div>
                    <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                      Seller: <strong>{p.sellerId?.name || 'Verified Vendor'}</strong>
                    </span>
                  </div>

                  <button
                    className="btn btn-outline-success btn-sm w-100 rounded-pill fw-semibold py-2 d-flex align-items-center justify-content-center gap-1.5"
                    onClick={() => handleAddToCart(p)}
                  >
                    <i className="bi bi-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {showCheckoutModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-success text-white py-3 px-4">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-bag-check-fill"></i> Review Cart & Checkout
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCheckoutModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                {/* Single seller reminder banner */}
                <div className="alert alert-warning border-0 rounded-3 p-3 mb-3 small d-flex gap-2 align-items-center">
                  <i className="bi bi-info-circle-fill text-warning fs-5"></i>
                  <span>
                    <strong>Single-Seller Rule:</strong> All products in a single order must belong to the same vendor to preserve unified logistics and traceability.
                  </span>
                </div>

                {/* Items list */}
                {cart?.items?.length === 0 ? (
                  <p className="text-center text-muted py-4">Your cart is empty.</p>
                ) : (
                  <div className="list-group list-group-flush mb-4">
                    {cart?.items?.map((item) => (
                      <div
                        key={item.productId}
                        className="list-group-item d-flex justify-content-between align-items-center px-0 py-2.5"
                      >
                        <div>
                          <strong className="text-dark small d-block">{item.title}</strong>
                          <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                            Qty: {item.quantity} {item.unit} × ₹{item.price}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <strong className="text-success small">₹{item.price * item.quantity}</strong>
                          <button
                            className="btn btn-sm btn-link text-danger p-0"
                            onClick={() => handleRemoveFromCart(item.productId)}
                            title="Remove"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light mb-4">
                  <span className="fw-semibold text-dark">Total Order Value:</span>
                  <span className="fs-4 fw-bold text-success">₹{cartTotal.toLocaleString()}</span>
                </div>

                {/* Checkout details form */}
                <form onSubmit={handleCheckoutSubmit}>
                  <div className="row g-3">
                    <div className="col-12 col-sm-8">
                      <label className="form-label small fw-semibold text-dark">
                        Delivery Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={checkoutData.deliveryAddress}
                        onChange={(e) =>
                          setCheckoutData({ ...checkoutData, deliveryAddress: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-12 col-sm-4">
                      <label className="form-label small fw-semibold text-dark">
                        Contact Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={checkoutData.contactPhone}
                        onChange={(e) =>
                          setCheckoutData({ ...checkoutData, contactPhone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="modal-footer px-0 pb-0 pt-4 mt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-secondary rounded-pill px-4"
                      onClick={() => setShowCheckoutModal(false)}
                    >
                      Back to Shopping
                    </button>
                    <button
                      type="submit"
                      className="btn btn-agri-primary rounded-pill px-4 fw-semibold"
                      disabled={isSubmittingOrder || cartItemCount === 0}
                    >
                      {isSubmittingOrder ? 'Validating & Placing Order...' : 'Confirm Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceTab;

