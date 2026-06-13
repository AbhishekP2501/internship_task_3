import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBases, getSauces, getCheeses, getVeggies, getMeats } from '../../services/api';
import './Dashboard.css';

import margheritaImg from '../../assets/margherita.png';
import pepperoniImg from '../../assets/pepperoni.png';
import veggieImg from '../../assets/veggie.png';
import bbqChickenImg from '../../assets/bbq_chicken.png';

const preconfiguredPizzas = [
  {
    name: 'Margherita Classic',
    image: margheritaImg,
    description: 'The simple Italian classic with fresh basil and melted mozzarella.',
    price: 299,
    toppings: ['Thin Crust Base', 'Marinara Sauce', 'Mozzarella Cheese', 'Tomatoes', 'Basil'],
  },
  {
    name: 'Double Pepperoni',
    image: pepperoniImg,
    description: 'Double the crispy pepperoni with rich cheese and smoky sauce.',
    price: 399,
    toppings: ['Thick Crust Base', 'BBQ Sauce', 'Cheddar Cheese', 'Pepperoni', 'Bacon'],
  },
  {
    name: 'Veggie Supreme',
    image: veggieImg,
    description: 'Loaded with a colorful variety of fresh, crisp garden vegetables.',
    price: 349,
    toppings: ['Whole Wheat Base', 'Pesto Sauce', 'Parmesan Cheese', 'Mushrooms', 'Olives', 'Tomatoes', 'Bell Peppers'],
  },
  {
    name: 'BBQ Chicken Delight',
    image: bbqChickenImg,
    description: 'Succulent chunks of chicken tossed in sweet barbecue sauce.',
    price: 429,
    toppings: ['Stuffed Crust Base', 'BBQ Sauce', 'Mozzarella Cheese', 'Chicken', 'Onions', 'Jalapeños'],
  }
];

const coldDrinksData = [
  { _id: 'cd1', name: 'Classic Cola', price: 60, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80' },
  { _id: 'cd2', name: 'Lemon Lime Fizz', price: 60, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&q=80' },
  { _id: 'cd3', name: 'Iced Peach Tea', price: 80, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80' },
  { _id: 'cd4', name: 'Cold Brew Coffee', price: 120, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80' },
  { _id: 'cd5', name: 'Mango Smoothie', price: 110, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=300&q=80' },
  { _id: 'cd6', name: 'Strawberry Milkshake', price: 130, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=300&q=80' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState({ bases: [], sauces: [], cheeses: [], veggies: [], meats: [] });
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Pizzas');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [b, s, c, v, m] = await Promise.all([getBases(), getSauces(), getCheeses(), getVeggies(), getMeats()]);
        setItems({ bases: b.data, sauces: s.data, cheeses: c.data, veggies: v.data, meats: m.data });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const menuStats = [
    { label: 'All Pizzas', value: preconfiguredPizzas.length },
    { label: 'Cold Drinks', value: coldDrinksData.length },
    { label: 'Build Your Pizza', value: '✨' },
  ];

  const handleMenuClick = (label) => {
    if (label === 'Build Your Pizza') {
      navigate('/build-pizza');
    } else {
      setActiveCategory(label);
    }
  };

  const handleOrderPizza = (pizza) => {
    const pizzaData = {
      base: pizza.toppings[0],
      sauce: pizza.toppings[1],
      cheese: pizza.toppings[2],
      veggies: pizza.toppings.slice(3),
    };
    navigate('/checkout', { state: { pizza: pizzaData, totalPrice: pizza.price } });
  };

  const renderSection = (title, data) => (
    <div className="menu-section animate-fade">
      <h2>{title}</h2>
      <div className="menu-grid">
        {data.map((item) => (
          <div className="menu-card" key={item._id}>
            <div className="menu-card-image-container">
              <img src={item.image} alt={item.name} className="menu-card-image" />
            </div>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) return <div className="page container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '48px' }}>🍕</div>;

  return (
    <div className="dashboard page container dashboard-shell" style={{ paddingTop: '100px' }}>
      <aside className="dashboard-sidebar">
        <div className="sidebar-card">
          <h2>Our Menu</h2>
          <div className="sidebar-menu-list">
            {menuStats.map((entry) => (
              <button
                key={entry.label}
                className={`sidebar-menu-item ${activeCategory === entry.label ? 'active' : ''}`}
                onClick={() => handleMenuClick(entry.label)}
              >
                <span className="sidebar-menu-item-label">{entry.label}</span>
                <span className="sidebar-menu-item-count">{entry.value}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        {activeCategory === 'All Pizzas' && (
          <section className="featured-section animate-fade">
            <div className="section-heading">
              <h2>🔥 Most Popular Pizzas</h2>
            </div>
            <div className="popular-pizzas-grid">
              {preconfiguredPizzas.map((pizza, index) => (
                <article className="popular-pizza-card" key={index}>
                  <img src={pizza.image} alt={pizza.name} className="popular-pizza-image" />
                  <div className="popular-pizza-content">
                    <h3>{pizza.name}</h3>
                    <p>{pizza.description}</p>
                    <div className="popular-pizza-meta">
                      <span className="popular-pizza-price">₹{pizza.price}</span>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOrderPizza(pizza)}>
                        Order Now
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeCategory === 'Cold Drinks' && (
          <section className="menu-sections-container">
            {renderSection('🥤 Cold Drinks', coldDrinksData)}
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;