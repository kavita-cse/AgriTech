const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  createOrder,
  getOrders,
  updateOrderStatus,
} = require('../controllers/marketController');
const { authenticateToken, authorizeRoles, checkOwnership } = require('../middleware/auth');

// 1. Products
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post(
  '/products',
  authenticateToken,
  authorizeRoles('vendor', 'farmer', 'admin'),
  createProduct
);
router.put(
  '/products/:id',
  authenticateToken,
  checkOwnership(Product, 'sellerId'),
  updateProduct
);
router.delete(
  '/products/:id',
  authenticateToken,
  checkOwnership(Product, 'sellerId'),
  deleteProduct
);

// 2. Cart
router.get('/cart', authenticateToken, getCart);
router.post('/cart/items', authenticateToken, addToCart);
router.delete('/cart/items/:productId', authenticateToken, removeFromCart);
router.delete('/cart', authenticateToken, clearCart);

// 3. Orders
router.post('/orders', authenticateToken, createOrder);
router.get('/orders', authenticateToken, getOrders);
router.patch('/orders/:id/status', authenticateToken, updateOrderStatus);

module.exports = router;

