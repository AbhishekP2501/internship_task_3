const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const User = require('../models/User');
const Inventory = require('../models/Inventory');

const items = [
  { category: 'base', name: 'Thin Crust', quantity: 100, price: 120, image: '🫓' },
  { category: 'base', name: 'Thick Crust', quantity: 100, price: 140, image: '🍞' },
  { category: 'base', name: 'Stuffed Crust', quantity: 100, price: 180, image: '🥐' },
  { category: 'base', name: 'Gluten-Free', quantity: 100, price: 200, image: '🌾' },
  { category: 'base', name: 'Whole Wheat', quantity: 100, price: 150, image: '🌿' },
  { category: 'base', name: 'Hand Tossed', quantity: 100, price: 160, image: '🍕' },
  { category: 'base', name: 'Cheese Burst Crust', quantity: 100, price: 220, image: '🧈' },
  { category: 'base', name: 'Multigrain Crust', quantity: 100, price: 170, image: '🌾' },
  { category: 'base', name: 'Garlic Crust', quantity: 100, price: 175, image: '🧄' },
  { category: 'base', name: 'Sourdough Crust', quantity: 100, price: 190, image: '🥖' },
  { category: 'sauce', name: 'Marinara', quantity: 100, price: 40, image: '🍅' },
  { category: 'sauce', name: 'BBQ', quantity: 100, price: 50, image: '🔥' },
  { category: 'sauce', name: 'Alfredo', quantity: 100, price: 60, image: '🥛' },
  { category: 'sauce', name: 'Pesto', quantity: 100, price: 55, image: '🌿' },
  { category: 'sauce', name: 'Hot Sauce', quantity: 100, price: 45, image: '🌶️' },
  { category: 'sauce', name: 'Arrabbiata', quantity: 100, price: 55, image: '🍅' },
  { category: 'sauce', name: 'Garlic Parmesan', quantity: 100, price: 65, image: '🧄' },
  { category: 'sauce', name: 'Chipotle', quantity: 100, price: 60, image: '🌶️' },
  { category: 'sauce', name: 'Tandoori', quantity: 100, price: 65, image: '🍛' },
  { category: 'sauce', name: 'Creamy Herb', quantity: 100, price: 58, image: '🌿' },
  { category: 'cheese', name: 'Mozzarella', quantity: 100, price: 80, image: '🧀' },
  { category: 'cheese', name: 'Cheddar', quantity: 100, price: 90, image: '🧀' },
  { category: 'cheese', name: 'Parmesan', quantity: 100, price: 100, image: '🧀' },
  { category: 'cheese', name: 'Gouda', quantity: 100, price: 110, image: '🧀' },
  { category: 'cheese', name: 'Vegan Cheese', quantity: 100, price: 120, image: '🌱' },
  { category: 'cheese', name: 'Provolone', quantity: 100, price: 95, image: '🧀' },
  { category: 'cheese', name: 'Ricotta', quantity: 100, price: 105, image: '🧀' },
  { category: 'cheese', name: 'Feta', quantity: 100, price: 110, image: '🧀' },
  { category: 'cheese', name: 'Monterey Jack', quantity: 100, price: 100, image: '🧀' },
  { category: 'cheese', name: 'Blue Cheese', quantity: 100, price: 115, image: '🧀' },
  { category: 'veggie', name: 'Mushrooms', quantity: 100, price: 30, image: '🍄' },
  { category: 'veggie', name: 'Bell Peppers', quantity: 100, price: 25, image: '🫑' },
  { category: 'veggie', name: 'Onions', quantity: 100, price: 20, image: '🧅' },
  { category: 'veggie', name: 'Olives', quantity: 100, price: 35, image: '🫒' },
  { category: 'veggie', name: 'Tomatoes', quantity: 100, price: 25, image: '🍅' },
  { category: 'veggie', name: 'Jalapeños', quantity: 100, price: 30, image: '🌶️' },
  { category: 'veggie', name: 'Spinach', quantity: 100, price: 25, image: '🥬' },
  { category: 'veggie', name: 'Corn', quantity: 100, price: 20, image: '🌽' },
  { category: 'veggie', name: 'Broccoli', quantity: 100, price: 30, image: '🥦' },
  { category: 'veggie', name: 'Paneer', quantity: 100, price: 45, image: '🧀' },
  { category: 'veggie', name: 'Zucchini', quantity: 100, price: 35, image: '🥒' },
  { category: 'veggie', name: 'Baby Corn', quantity: 100, price: 30, image: '🌽' },
  { category: 'veggie', name: 'Sun-dried Tomatoes', quantity: 100, price: 40, image: '🍅' },
  { category: 'meat', name: 'Pepperoni', quantity: 100, price: 60, image: '🥓' },
  { category: 'meat', name: 'Chicken', quantity: 100, price: 70, image: '🍗' },
  { category: 'meat', name: 'Sausage', quantity: 100, price: 65, image: '🌭' },
  { category: 'meat', name: 'Bacon', quantity: 100, price: 75, image: '🥓' },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    const adminExists = await User.findOne({ email: 'admin@pizza.com' });
    if (!adminExists) {
      await User.create({ name: 'Admin', email: 'admin@pizza.com', password: 'Admin@123', role: 'admin', isVerified: true });
      console.log('Admin created: admin@pizza.com / Admin@123');
    }
    const count = await Inventory.countDocuments();
    let inserted = 0;
    let updated = 0;

    for (const item of items) {
      const existing = await Inventory.findOne({ name: item.name });
      if (!existing) {
        await Inventory.create(item);
        inserted += 1;
      } else {
        await Inventory.findByIdAndUpdate(existing._id, {
          category: item.category,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        });
        updated += 1;
      }
    }

    if (count === 0) {
      console.log(`Seeded ${inserted} inventory items.`);
    } else {
      console.log(`Inventory upsert complete: inserted ${inserted}, updated ${updated}.`);
    }
    console.log('Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

module.exports = seedData;
if (require.main === module) seedData();
