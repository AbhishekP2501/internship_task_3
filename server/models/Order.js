const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pizza: {
    base: { type: String, required: true },
    sauce: { type: String, required: true },
    cheese: { type: String, required: true },
    veggies: [{ type: String }],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'],
    default: 'Order Placed',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
