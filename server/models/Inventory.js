const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 100,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  image: {
    type: String,
    default: '🍕',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inventory', inventorySchema);
