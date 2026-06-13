const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// @route   GET /api/orders/my-orders
// @desc    Get current user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (admin)
router.get('/', auth, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin)
router.put('/:id/status', auth, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Order Placed', 'Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
