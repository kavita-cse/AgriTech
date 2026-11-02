const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// -------------------------------------------------------------
// 1. PRODUCTS (Public Browsing + Seller Management)
// -------------------------------------------------------------

/**
 * @route   GET /api/products
 * @desc    Public product catalog browsing with filter & search
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const { category, search, sellerId } = req.query;
    const filter = { isAvailable: true };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (sellerId) {
      filter.sellerId = sellerId;
    }

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .populate('sellerId', 'name role district')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/products/:id
 * @desc    Get single product details
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'name role district');
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found.' });
    }

    res.status(200).json({
      status: 'success',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/products
 * @desc    Create product listing
 * @access  Protected (Vendor or Farmer)
 */
const createProduct = async (req, res, next) => {
  try {
    const { title, description, category, price, unit, stockQuantity, imageUrl } = req.body;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, description, category, and price are required.',
      });
    }

    // Farmer role check: per architecture, farmers can list harvested crop produce only
    if (req.user.role === 'farmer' && category !== 'produce') {
      return res.status(403).json({
        status: 'error',
        message: 'Farmers are permitted to list farm produce only. Input supplies require a vendor account.',
      });
    }

    const product = new Product({
      sellerId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category,
      price: Number(price),
      unit: unit || 'kg',
      stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 10,
      imageUrl: imageUrl?.trim() || '',
      isAvailable: true,
    });

    await product.save();

    res.status(201).json({
      status: 'success',
      message: 'Product listed in marketplace successfully.',
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/products/:id
 * @desc    Update product listing
 * @access  Protected (Seller or Admin)
 */
const updateProduct = async (req, res, next) => {
  try {
    const allowed = ['title', 'description', 'category', 'price', 'unit', 'stockQuantity', 'imageUrl', 'isAvailable'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.resource[field] = req.body[field];
      }
    });

    await req.resource.save();

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully.',
      product: req.resource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product listing
 * @access  Protected (Seller or Admin)
 */
const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.resource._id);
    res.status(200).json({
      status: 'success',
      message: 'Product listing removed.',
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------
// 2. SHOPPING CART (Per-user persistent cart)
// -------------------------------------------------------------

/**
 * @route   GET /api/cart
 * @desc    Get current user's shopping cart
 * @access  Protected
 */
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
      await cart.save();
    }

    res.status(200).json({
      status: 'success',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/cart/items
 * @desc    Add product to shopping cart
 * @access  Protected
 */
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ status: 'error', message: 'Product ID is required.' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      return res.status(404).json({ status: 'error', message: 'Product is unavailable or out of stock.' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        unit: product.unit,
        quantity: Number(quantity),
        sellerId: product.sellerId,
      });
    }

    await cart.save();

    res.status(200).json({
      status: 'success',
      message: `${product.title} added to cart.`,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/cart/items/:productId
 * @desc    Remove an item from the cart
 * @access  Protected
 */
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Cart not found.' });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart.',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/cart
 * @desc    Clear user's cart
 * @access  Protected
 */
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ status: 'success', message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------
// 3. ORDERS (Single-Seller Checkout Rule Enforced)
// -------------------------------------------------------------

/**
 * @route   POST /api/orders
 * @desc    Place order from cart or items with Single-Seller validation
 * @access  Protected (Buyer, Farmer, Expert, Vendor)
 */
const createOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, contactPhone } = req.body;

    if (!deliveryAddress || !contactPhone) {
      return res.status(400).json({
        status: 'error',
        message: 'Delivery address and contact phone number are required for checkout.',
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Your cart is empty. Add products before placing an order.',
      });
    }

    // MANDATORY SINGLE-SELLER CHECKOUT VALIDATION per Architecture Version 2.3
    const sellerIds = [...new Set(cart.items.map((i) => i.sellerId.toString()))];
    if (sellerIds.length > 1) {
      return res.status(400).json({
        status: 'error',
        message:
          'MVP Single-Seller Restriction: All items in a single order must belong to the same seller. Please order products from one seller at a time.',
      });
    }

    const sellerId = sellerIds[0];
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      buyerId: req.user._id,
      sellerId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
      })),
      totalAmount,
      status: 'pending',
      deliveryAddress: deliveryAddress.trim(),
      contactPhone: contactPhone.trim(),
    });

    await order.save();

    // Clear cart upon successful order placement
    cart.items = [];
    await cart.save();

    res.status(201).json({
      status: 'success',
      message: 'Order placed successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/orders
 * @desc    Get user's placed orders or vendor's incoming orders
 * @access  Protected
 */
const getOrders = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === 'admin') {
      filter = {};
    } else if (req.user.role === 'vendor') {
      // Vendors see both their sales orders and any purchases
      filter = { $or: [{ sellerId: req.user._id }, { buyerId: req.user._id }] };
    } else {
      filter = { buyerId: req.user._id };
    }

    const orders = await Order.find(filter)
      .populate('buyerId', 'name email phone')
      .populate('sellerId', 'name role district')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status
 * @access  Protected (Seller or Admin)
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Order not found.' });
    }

    // Only seller or admin can update status
    if (order.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access forbidden: Only the order seller or an administrator can update order status.',
      });
    }

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      status: 'success',
      message: `Order status updated to '${status}'.`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

