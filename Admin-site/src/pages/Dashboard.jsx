import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Users as UsersIcon, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler, ArcElement
);

// Utility: bucket orders by day of week
const getDayLabel = (iso) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(iso).getDay()];
};

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'orders'), snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(data);
    });
    const unsubUsers = onSnapshot(collection(db, 'users'), snap => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubProducts = onSnapshot(collection(db, 'products'), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => { unsubOrders(); unsubUsers(); unsubProducts(); };
  }, []);

  // ---- Aggregate Stats ----
  const totalRevenue = orders
    .filter(o => o.status !== 'Declined')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const declinedOrders = orders.filter(o => o.status === 'Declined').length;
  const totalProducts = products.length;
  const outOfStock = products.filter(p => p.status === 'out of stock').length;

  // ---- Revenue by Day of Week (Histogram) ----
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const revenueByDay = dayLabels.map(day =>
    orders
      .filter(o => o.status !== 'Declined' && getDayLabel(o.createdAt) === day)
      .reduce((sum, o) => sum + (o.total || 0), 0)
  );
  const ordersByDay = dayLabels.map(day =>
    orders.filter(o => getDayLabel(o.createdAt) === day).length
  );

  // ---- Orders by Status (Doughnut) ----
  const doughnutData = {
    labels: ['Completed', 'Pending', 'Declined'],
    datasets: [{
      data: [completedOrders, pendingOrders, declinedOrders],
      backgroundColor: ['#1a1a1a', '#aaaaaa', '#dddddd'],
      borderWidth: 0,
    }],
  };

  // ---- Revenue Histogram ----
  const revenueBarData = {
    labels: dayLabels,
    datasets: [{
      label: 'Revenue ($)',
      data: revenueByDay,
      backgroundColor: dayLabels.map((_, i) =>
        i % 2 === 0 ? '#1a1a1a' : '#555555'
      ),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  // ---- Orders vs Revenue Comparative Line ----
  const lineCompData = {
    labels: dayLabels,
    datasets: [
      {
        label: 'Revenue ($)',
        data: revenueByDay,
        borderColor: '#000000',
        backgroundColor: 'rgba(0,0,0,0.07)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Orders Count',
        data: ordersByDay,
        borderColor: '#888888',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  // ---- Category Histogram ----
  const categories = ['Clothes', 'Shoes', 'Toys', 'Equipment', 'Pampers', 'Suitcases'];
  const productsByCategory = categories.map(cat =>
    products.filter(p => p.category === cat).length
  );
  const categoryBarData = {
    labels: categories,
    datasets: [{
      label: 'Products',
      data: productsByCategory,
      backgroundColor: '#1a1a1a',
      borderRadius: 5,
    }],
  };

  const chartOpts = {
    responsive: true,
    plugins: { legend: { position: 'bottom', labels: { font: { family: 'Outfit' } } } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#f0f0f0' } } },
  };

  const dualAxisOpts = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { grid: { display: false } },
      y: { type: 'linear', position: 'left', grid: { color: '#f0f0f0' }, title: { display: true, text: 'Revenue ($)' } },
      y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Orders' } },
    },
  };

  const StatCard = ({ icon, label, value, sub, color = 'green' }) => (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '10px' }}>{icon}</div>
        {sub && <span style={{ color, fontSize: '0.8rem', fontWeight: 600 }}>{sub}</span>}
      </div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );

  if (loading) return <div style={{ padding: '3rem', color: '#999' }}>Loading analytics...</div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Performance Dashboard</h1>
        <div style={{ fontSize: '0.85rem', color: '#999' }}>Live data from Firestore</div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard icon={<DollarSign size={20} />} label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} sub="Live" />
        <StatCard icon={<ShoppingBag size={20} />} label="Total Orders" value={orders.length} />
        <StatCard icon={<CheckCircle size={20} />} label="Completed" value={completedOrders} color="green" sub="✓" />
        <StatCard icon={<Clock size={20} />} label="Pending" value={pendingOrders} color="orange" />
        <StatCard icon={<XCircle size={20} />} label="Declined" value={declinedOrders} color="red" />
        <StatCard icon={<UsersIcon size={20} />} label="Registered Users" value={users.length} />
        <StatCard icon={<Package size={20} />} label="Products" value={totalProducts} />
        <StatCard icon={<TrendingUp size={20} />} label="Out of Stock" value={outOfStock} color={outOfStock > 0 ? 'red' : 'green'} sub={outOfStock > 0 ? '⚠ Restock' : '✓ OK'} />
      </div>

      {/* ── Row 1: Revenue Histogram + Order Status Doughnut ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="data-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Revenue by Day of Week</h3>
          <Bar data={revenueBarData} options={chartOpts} />
        </div>
        <div className="data-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Order Status Breakdown</h3>
          {orders.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>No orders yet</div>
          ) : (
            <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '65%' }} />
          )}
        </div>
      </div>

      {/* ── Row 2: Comparative Line Chart (Revenue vs Orders) ── */}
      <div className="data-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Revenue vs Orders — Comparative Weekly Trend</h3>
        <Line data={lineCompData} options={dualAxisOpts} />
      </div>

      {/* ── Row 3: Products by Category Histogram ── */}
      <div className="data-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Inventory by Category</h3>
        <Bar data={categoryBarData} options={{
          ...chartOpts,
          indexAxis: 'x',
          plugins: { legend: { display: false } }
        }} />
      </div>

      {/* ── Row 4: Recent Orders Table ── */}
      <div className="data-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Recent Orders</h3>
        {orders.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No orders have been placed yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td>{order.userEmail}</td>
                  <td style={{ fontWeight: 700 }}>${(order.total || 0).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${(order.status || '').toLowerCase()}`}>{order.status}</span>
                  </td>
                  <td style={{ color: '#999', fontSize: '0.85rem' }}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
