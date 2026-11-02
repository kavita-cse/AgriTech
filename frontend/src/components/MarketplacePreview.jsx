import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockMarketplaceProducts } from '../data/mockMarketplace';

const MarketplacePreview = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Seeds', 'Fertilizers', 'Equipment', 'Produce'];

  const filteredProducts = selectedCategory === 'All'
    ? mockMarketplaceProducts
    : mockMarketplaceProducts.filter((p) => p.category === selectedCategory);

  return (
    <section id="marketplace" className="section-padding bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-4">
          <div>
            <span className="badge-agri-pill bg-light-mint text-forest mb-2 d-inline-block">
              Direct Agricultural Trade
            </span>
            <h2 className="display-5 text-forest fw-bold mb-2">
              Featured Marketplace Resources
            </h2>
            <p className="text-muted mb-0 fs-6">
              Source verified seeds and fertilizers or buy fresh produce directly from farmers.
            </p>
          </div>
          <div className="mt-3 mt-md-0">
            <span className="badge badge-demo-tag p-2 px-3 rounded-pill fw-normal">
              <i className="bi bi-info-circle-fill me-1"></i> Demo Listings & Sample Prices
            </span>
          </div>
        </div>

        {/* Notice on Single-Seller MVP Rule */}
        <div className="alert alert-success border-success border-opacity-25 bg-light-mint d-flex align-items-center gap-2 py-2 mb-4 rounded-3 small text-forest">
          <i className="bi bi-shield-check fs-5"></i>
          <div>
            <strong>MVP Checkout Guarantee:</strong> To guarantee reliable fulfillment, each order is restricted to products from a single verified seller.
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${
                selectedCategory === cat ? 'btn-success text-white' : 'btn-outline-secondary'
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-3">
              <div className="card h-100 agri-card border-0">
                {/* Product Image & Badges */}
                <div className="position-relative overflow-hidden" style={{ height: '190px' }}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="position-absolute top-0 start-0 m-2 badge bg-forest text-white small rounded-pill px-2 py-1">
                    {product.tag}
                  </span>
                  <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark small rounded-pill px-2 py-1 fw-bold">
                    Demo
                  </span>
                </div>

                {/* Product Body */}
                <div className="card-body p-3 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="badge bg-light text-muted small border">{product.category}</span>
                    <small className="text-warning fw-bold">
                      <i className="bi bi-star-fill me-1"></i>{product.rating}
                    </small>
                  </div>

                  <h4 className="h6 fw-bold text-forest mb-2 line-clamp-2" style={{ minHeight: '38px' }}>
                    {product.title}
                  </h4>

                  <p className="text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.82rem' }}>
                    {product.description}
                  </p>

                  <div className="p-2 rounded bg-light border border-light-subtle mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">Indicative Demo Price:</small>
                      <strong className="text-forest fs-6">₹{product.price}</strong>
                    </div>
                    <small className="text-muted d-block text-end" style={{ fontSize: '0.75rem' }}>
                      per {product.unit}
                    </small>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                    <small className="text-muted text-truncate me-2" style={{ maxWidth: '120px' }}>
                      <i className="bi bi-shop me-1"></i>{product.seller}
                    </small>
                    <Link to="/login" className="btn btn-sm btn-agri-outline py-1 px-3">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-5">
          <Link to="/login" className="btn btn-agri-outline px-4 py-2 rounded-pill">
            Sign In to Access Full Catalog & Cart <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MarketplacePreview;

