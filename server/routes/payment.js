const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');
const checkStockAndAlert = require('../utils/stockAlert');

let razorpay;

const getRazorpay = () => {
  if (!razorpay) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials are not configured in .env');
    }
    razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return razorpay;
};

// @route   POST /api/payment/create-order
// @desc    Create a Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await getRazorpay().orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({ message: 'Error creating payment order.' });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify payment and create order
router.post('/verify', auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      pizza,
      totalPrice,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed.' });
    }

    // Create order in database
    const order = await Order.create({
      user: req.user._id,
      pizza,
      totalPrice,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'Order Placed',
    });

    // Decrement inventory
    const { base, sauce, cheese, veggies } = pizza;

    await Inventory.findOneAndUpdate(
      { category: 'base', name: base },
      { $inc: { quantity: -1 } }
    );
    await Inventory.findOneAndUpdate(
      { category: 'sauce', name: sauce },
      { $inc: { quantity: -1 } }
    );
    await Inventory.findOneAndUpdate(
      { category: 'cheese', name: cheese },
      { $inc: { quantity: -1 } }
    );

    if (veggies && veggies.length > 0) {
      for (const veggie of veggies) {
        await Inventory.findOneAndUpdate(
          { name: veggie, category: { $in: ['veggie', 'meat'] } },
          { $inc: { quantity: -1 } }
        );
      }
    }

    await checkStockAndAlert();

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
    res.status(201).json({ message: 'Order placed successfully!', order: populatedOrder });
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ message: 'Error processing order.' });
  }
});

module.exports = router;
