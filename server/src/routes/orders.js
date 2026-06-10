const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// POST /api/orders — create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    // Verify products and calculate prices
    let itemsPrice = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product ${item.product} not found` });
      if (product.stock < item.qty) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      itemsPrice += product.price * item.qty;
      orderItems.push({ product: product._id, name: product.name, image: product.image, price: product.price, qty: item.qty });
      product.stock -= item.qty;
      await product.save();
    }

    const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
    const taxPrice = parseFloat((itemsPrice * 0.08).toFixed(2));
    const totalPrice = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      itemsPrice: parseFloat(itemsPrice.toFixed(2)),
      shippingPrice,
      taxPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my — user's orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders — admin: all orders
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status — admin
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status,
      ...(status === 'delivered' ? { isDelivered: true, deliveredAt: new Date() } : {}),
    }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
