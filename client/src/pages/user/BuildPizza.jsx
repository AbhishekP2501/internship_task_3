import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBases, getSauces, getCheeses, getVeggies, getMeats } from '../../services/api';
import { toast } from 'react-toastify';
import './BuildPizza.css';

const steps = [
  { key: 'base', label: '1. Base' },
  { key: 'sauce', label: '2. Sauce' },
  { key: 'cheese', label: '3. Cheese' },
  { key: 'veggies', label: '4. Toppings' },
  { key: 'review', label: '5. Review' },
];

const ITEM_ENHANCEMENTS = {
  // Bases (Pizza Crusts)
  'classic crust': { price: 99 },
  'garlic crust': { price: 129 },
  'cheese burst': { price: 159 },
  'gluten-free': { price: 149 },
  'hand tossed': { price: 109 },
  'thin crust': { price: 119 },

  // Sauces
  'tomato basil': { price: 29 },
  'pesto sauce': { price: 49 },
  'garlic parmesan': { price: 45 },

  // Cheeses
  'mozzarella': { price: 59 },
  'gouda': { price: 79 },
  'feta': { price: 89 },
  'vegan cheese': { price: 99 },
  'cheddar': { price: 69 },

  // Toppings (Veggies & Meats)
  'mushrooms': { price: 40 },
  'onions': { price: 25 },
  'jalapenos': { price: 35 },
  'pepperoni': { price: 89 },
  'grilled chicken': { price: 99 },
  'bacon': { price: 109 },
};

const normalizeOptionItem = (item = {}, category = '') => {
  const cleanName = (item?.name || '').toLowerCase().trim();
  const enhancement = ITEM_ENHANCEMENTS[cleanName] || {};

  const resolvedPrice = item.price > 0 ? Number(item.price) : (enhancement.price || 40);

  return {
    ...item,
    category,
    price: resolvedPrice
  };
};

const BuildPizza = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [options, setOptions] = useState({ bases: [], sauces: [], cheeses: [], veggies: [], meats: [] });
  const [selection, setSelection] = useState({ base: null, sauce: null, cheese: null, veggies: [] });
  const [loading, setLoading] = useState(true);

  const getItemId = (item) => item?._id || item?.id || item?.name;

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [b, s, c, v, m] = await Promise.all([getBases(), getSauces(), getCheeses(), getVeggies(), getMeats()]);

        setOptions({
          bases: (b.data || []).map((item) => normalizeOptionItem(item, 'base')).slice(0, 5),
          sauces: (s.data || []).map((item) => normalizeOptionItem(item, 'sauce')).slice(0, 5),
          cheeses: (c.data || []).map((item) => normalizeOptionItem(item, 'cheese')).slice(0, 5),
          veggies: [
            ...(v.data || []).map((item) => normalizeOptionItem(item, 'veggie')),
            ...(m.data || []).map((item) => normalizeOptionItem(item, 'meat'))
          ].slice(0, 5), // Combines veggies and meats, then restricts the total toppings to 5
        });
      } catch (err) {
        toast.error('Failed to load menu options');
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleSelect = (key, item) => {
    if (key === 'veggies') {
      setSelection((prev) => {
        const itemId = getItemId(item);
        const exists = prev.veggies.find((v) => getItemId(v) === itemId);
        return { ...prev, veggies: exists ? prev.veggies.filter((v) => getItemId(v) !== itemId) : [...prev.veggies, item] };
      });
    } else {
      setSelection((prev) => ({ ...prev, [key]: item }));
    }
  };

  const calculateTotal = () => {
    const b = Number(selection.base?.price) || 0;
    const s = Number(selection.sauce?.price) || 0;
    const c = Number(selection.cheese?.price) || 0;
    const v = selection.veggies.reduce((sum, item) => sum + (Number(item?.price) || 0), 0);
    return b + s + c + v;
  };

  const handleCheckout = () => {
    if (!selection.base) {
      toast.error('Please select a Crust Base first! 🍕');
      return;
    }
    if (!selection.sauce) {
      toast.error('Please select a Sauce layer! 🍅');
      return;
    }
    if (!selection.cheese) {
      toast.error('Please add your Choice of Cheese! 🧀');
      return;
    }
    if (selection.veggies.length === 0) {
      toast.error('Please choose at least 1 topping! 🫑');
      return;
    }

    navigate('/checkout', {
      state: {
        pizza: {
          base: { name: selection.base.name, price: Number(selection.base.price) },
          sauce: { name: selection.sauce.name, price: Number(selection.sauce.price) },
          cheese: { name: selection.cheese.name, price: Number(selection.cheese.price) },
          veggies: selection.veggies.map((v) => ({ name: v.name, price: Number(v.price) }))
        },
        totalPrice: calculateTotal()
      }
    });
  };

  const renderOptions = (key, items) => {
    if (loading) return <div className="studio-loading">Arranging ingredients...</div>;
    return (
      <div className="studio-carousel">
        {items.map((item) => {
          const itemId = getItemId(item);
          const isSelected = key === 'veggies' ? selection.veggies.some((v) => getItemId(v) === itemId) : getItemId(selection[key]) === itemId;
          return (
            <div key={itemId} className={`studio-card ${isSelected ? 'selected-card' : ''}`} onClick={() => handleSelect(key, item)}>
              {/* Image wrap removed entirely */}
              <span className="studio-card-name">{item.name}</span>
              <span className="studio-card-price">₹{item.price}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="light-pizza-studio">
      <nav className="studio-top-nav">
        <button className="nav-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="nav-logo">🍕 Pizzara <span>Studio</span></div>
        <div className="nav-total"><span className="total-label">Total</span><h2 className="total-amount">₹{calculateTotal()}</h2></div>
      </nav>

      <div className="centered-builder-card">
        <div className="progress-track">
          {steps.map((step, i) => (
            <div key={step.key} className="progress-node-wrapper">
              <button className={`progress-node ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`} onClick={() => setCurrentStep(i)}>{i < currentStep ? '✓' : i + 1}</button>
              <span className="progress-label">{step.label.split('.')[1]}</span>
            </div>
          ))}
        </div>

        <div className="builder-viewport">
          {currentStep < 4 ? (
            <div className="step-content">
              <h3>{steps[currentStep].label.split('.')[1]}</h3>
              {renderOptions(steps[currentStep].key, options[steps[currentStep].key === 'veggies' ? 'veggies' : steps[currentStep].key + 's'])}
            </div>
          ) : (
            <div className="custom-creation-section">
              <div className="custom-creation-header"><h2>Your Custom Creation</h2><p>Review your masterpiece</p></div>
              <div className="creation-summary-grid">
                {[selection.base, selection.sauce, selection.cheese, ...selection.veggies].filter(Boolean).map((item, i) => (
                  <div key={i} className="creation-item-pill" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', margin: '6px 0', background: '#f8fafc', borderRadius: '12px' }}>
                    <span style={{ fontWeight: '600', color: '#334155' }}>{item?.name}</span>
                    <span className="pill-price" style={{ color: '#0ea5e9', fontWeight: '700' }}>₹{item?.price}</span>
                  </div>
                ))}

                <div className="creation-item-pill total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', margin: '12px 0 6px', background: '#e2e8f0', borderRadius: '12px', borderTop: '2px solid #cbd5e1' }}>
                  <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.1rem' }}>Total Amount</span>
                  <span className="pill-price" style={{ color: '#0ea5e9', fontWeight: '800', fontSize: '1.1rem' }}>₹{calculateTotal()}</span>
                </div>

              </div>
            </div>
          )}
        </div>

        <div className="action-dock">
          <button className={`btn-secondary ${currentStep === 0 ? 'hidden' : ''}`} onClick={() => setCurrentStep((p) => p - 1)}>Previous</button>
          <div style={{ flexGrow: 1 }}></div>
          {currentStep < 4 ? (
            <button className="btn-checkout" onClick={() => setCurrentStep((p) => p + 1)}>Next Step →</button>
          ) : (
            <button className="btn-checkout" onClick={handleCheckout}>✨ Proceed to Checkout</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildPizza;