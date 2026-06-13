import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/api';
import { toast } from 'react-toastify';
import './Orders.css';

const statusOptions = ['Order Placed', 'Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];
const statusFilters = ['All', ...statusOptions];

const getStatusBadgeClass = (status) => {
  const map = { 'Order Placed': 'badge-placed', 'Order Received': 'badge-received', 'In the Kitchen': 'badge-kitchen', 'Sent to Delivery': 'badge-delivery', 'Delivered': 'badge-delivered' };
  return map[status] || 'badge-placed';
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrders();
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Status updated to "${newStatus}"`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="page container" style={{display:'flex',justifyContent:'center',alignItems:'center',fontSize:'48px'}}>🍕</div>;

  return (
    <div className="admin-orders page container" style={{ paddingTop: '100px' }}>
      <h1>🛒 Order Management</h1>

      <div className="orders-filter">
        {statusFilters.map(s => (
          <button key={s} className={`order-filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s} ({s === 'All' ? orders.length : orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>No orders found</div>
      ) : (
        filtered.map(order => (
          <div className="admin-order-card" key={order._id}>
            <div className="admin-order-header">
              <div className="admin-order-customer">
                <strong>{order.user?.name || 'Unknown'}</strong>
                <small>{order.user?.email}</small>
                <small>{new Date(order.createdAt).toLocaleString('en-IN')}</small>
              </div>
              <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
            </div>

            <div className="admin-order-pizza">
              <div><span>Base</span>{order.pizza.base}</div>
              <div><span>Sauce</span>{order.pizza.sauce}</div>
              <div><span>Cheese</span>{order.pizza.cheese}</div>
              <div><span>Toppings</span>{order.pizza.veggies?.join(', ') || 'None'}</div>
            </div>

            <div className="admin-order-footer">
              <span style={{fontSize:20,fontWeight:700,color:'var(--accent-gold)'}}>₹{order.totalPrice}</span>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <label style={{fontSize:13,color:'var(--text-muted)'}}>Status:</label>
                <select
                  className="status-select"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
