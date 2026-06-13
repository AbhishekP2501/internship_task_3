import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, getInventory } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, lowStock: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, invRes] = await Promise.all([getAllOrders(), getInventory()]);
        const orders = ordersRes.data;
        const inventory = invRes.data;
        const pending = orders.filter(o => o.status !== 'Delivered').length;
        const low = inventory.filter(i => i.quantity < 20).length;
        const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        setStats({ totalOrders: orders.length, pendingOrders: pending, lowStock: low, revenue });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="page container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '48px' }}>🍕</div>;

  return (
    <div className="admin-dash page container" style={{ paddingTop: '100px' }}>
      <h1>📊 Admin Dashboard</h1>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{stats.pendingOrders}</div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value" style={{ color: stats.lowStock > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{stats.lowStock}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value" style={{ color: 'var(--accent-gold)' }}>₹{stats.revenue}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      <div className="admin-quick-links">
        <Link to="/admin/inventory" className="btn btn-primary btn-lg">📦 Manage Inventory</Link>
        <Link to="/admin/orders" className="btn btn-secondary btn-lg">🛒 Manage Orders</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;