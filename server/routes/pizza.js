const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const auth = require('../middleware/auth');

const buildCategoryRegex = (aliases) => new RegExp(`^(${aliases.join('|')})$`, 'i');

const findByCategory = async (aliases) => {
  const categoryRegex = buildCategoryRegex(aliases);
  return Inventory.find({ category: categoryRegex }).sort({ name: 1 });
};

// @route   GET /api/pizza/bases
// @desc    Get all pizza bases
router.get('/bases', auth, async (req, res) => {
  try {
    const bases = await findByCategory(['base', 'bases', 'crust', 'crusts']);
    res.json(bases);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/pizza/sauces
// @desc    Get all sauces
router.get('/sauces', auth, async (req, res) => {
  try {
    const sauces = await findByCategory(['sauce', 'sauces']);
    res.json(sauces);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/pizza/cheeses
// @desc    Get all cheeses
router.get('/cheeses', auth, async (req, res) => {
  try {
    const cheeses = await findByCategory(['cheese', 'cheeses']);
    res.json(cheeses);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/pizza/veggies
// @desc    Get all veggies
router.get('/veggies', auth, async (req, res) => {
  try {
    const veggies = await findByCategory(['veggie', 'veggies', 'vegetable', 'vegetables']);
    res.json(veggies);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/pizza/meats
// @desc    Get all meats
router.get('/meats', auth, async (req, res) => {
  try {
    const meats = await findByCategory(['meat', 'meats', 'non-veg', 'nonveg']);
    res.json(meats);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
