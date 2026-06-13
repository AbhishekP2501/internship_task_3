import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createPaymentOrder, verifyPayment } from '../../services/api';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!state?.pizza) {
    return (
      <div className="checkout-page page container" style={{ paddingTop: '100px' }}>
        <div className="checkout-card" style={{ textAlign: 'center' }}>
          <p>No pizza selected. <Link to="/build-pizza">Build one first!</Link></p>
        </div>
      </div>
    );
  }

  const { pizza, totalPrice } = state;

  const getName = (item) => (typeof item === 'object' && item !== null ? item.name : item || 'Not Selected');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load. Check your internet connection.');
        setLoading(false);
        return;
      }

      let order;
      try {
        const response = await createPaymentOrder(totalPrice);
        order = response.data;
      } catch (err) {
        console.error('createPaymentOrder error:', err.response || err.message || err);
        toast.error(err.response?.data?.message || 'Failed to create payment order');
        setLoading(false);
        return;
      }

      if (!order || !order.id) {
        console.error('Invalid order response:', order);
        toast.error('Invalid order response from server');
        setLoading(false);
        return;
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast.error('Razorpay key not configured. Check your .env file.');
        setLoading(false);
        return;
      }

      const normalizedPizzaPayload = {
        base: getName(pizza.base),
        sauce: getName(pizza.sauce),
        cheese: getName(pizza.cheese),
        veggies: Array.isArray(pizza.veggies) ? pizza.veggies.map(v => getName(v)) : []
      };

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Pizzara',
        description: 'Custom Pizza Order',
        order_id: order.id,

        handler: async (response) => {
          try {
            console.log('Payment success response:', response);
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              pizza: normalizedPizzaPayload,
              totalPrice,
            });
            setOrderPlaced(true);
            toast.success('Payment successful! Order placed. 🍕');
          } catch (err) {
            console.error('verifyPayment error:', err.response || err.message || err);
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },

        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '9999999999',
        },

        theme: { color: '#0EA5E9' },

        modal: {
          ondismiss: () => {
            console.log('Payment modal closed by user');
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (event) => {
        console.error('Payment failed event:', event.error);
        toast.error(
          event.error?.description || 'Payment failed. Please try again.'
        );
        setLoading(false);
      });

      rzp.open();

    } catch (err) {
      console.error('handlePayment error:', err);
      toast.error('Error initiating payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page page container" style={{ paddingTop: '100px' }}>
        <div className="checkout-card checkout-success">
          <div className="checkout-success-icon">🎉</div>
          <h2>Payment Confirmed!</h2>
          <p>Your custom pizza is being prepared.</p>
          <Link to="/my-orders" className="checkout-success-link">View My Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page page container" style={{ paddingTop: '100px' }}>
      <h1>🛒 Checkout</h1>
      <div className="checkout-card">
        <div className="checkout-summary">
          <h3>Order Summary</h3>

          <div className="checkout-item-row">
            <span className="item-label">Base: {getName(pizza.base)}</span>
          </div>

          <div className="checkout-item-row">
            <span className="item-label">Sauce: {getName(pizza.sauce)}</span>
          </div>

          <div className="checkout-item-row">
            <span className="item-label">Cheese: {getName(pizza.cheese)}</span>
          </div>

          <div className="checkout-item-row toppings-section-wrapper">
            <span className="item-label text-bold">Toppings:</span>
          </div>

          {Array.isArray(pizza.veggies) && pizza.veggies.length > 0 ? (
            pizza.veggies.map((veg, index) => (
              <div key={index} className="checkout-item-row sub-topping-row">
                <span className="item-label-sub">• {getName(veg)}</span>
              </div>
            ))
          ) : (
            <div className="checkout-item-row sub-topping-row">
              <span className="item-label-sub">• None Specified</span>
            </div>
          )}
        </div>

        <button
          className="checkout-payment-btn"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Opening Gateway...' : '💳 Proceed to Payment'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;