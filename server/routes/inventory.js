const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// @route   GET /api/inventory
// @desc    Get all inventory items (admin)
router.get('/', auth, adminMiddleware, async (req, res) => {
  try {
    const items = await Inventory.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/inventory
// @desc    Add new inventory item (admin)
router.post('/', auth, adminMiddleware, async (req, res) => {
  try {
    const { category, name, quantity, price, image } = req.body;

    const existing = await Inventory.findOne({ category, name });
    if (existing) {
      return res.status(400).json({ message: 'Item already exists in this category.' });
    }

    const item = await Inventory.create({ category, name, quantity, price, image });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/inventory/:id
// @desc    Update inventory item (admin)
router.put('/:id', auth, adminMiddleware, async (req, res) => {
  try {
    const { name, quantity, price, image } = req.body;

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { name, quantity, price, image },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item (admin)
router.delete('/:id', auth, adminMiddleware, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    res.json({ message: 'Item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
