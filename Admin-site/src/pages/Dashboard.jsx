import React, { useState } from 'react';
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
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, Users as UsersIcon, ShoppingBag, DollarSign, Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
);

const Dashboard = () => {
  const [dataView, setDataView] = useState('money'); // money, declined, signups

  // Mock data for graphs
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const revenueData = [1200, 1900, 3000, 5000, 2000, 3000, 4500];
  const prevRevenueData = [1000, 2100, 2800, 4200, 2500, 2800, 3800];

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Current Period',
        data: revenueData,
        borderColor: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Previous Period',
        data: prevRevenueData,
        borderColor: '#ccc',
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      }
    ],
  };

  const barData = {
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
    datasets: [
      {
        label: dataView === 'money' ? 'Revenue ($)' : dataView === 'signups' ? 'New Users' : 'Declined Orders',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 500)),
        backgroundColor: '#000',
        borderRadius: 4,
      }
    ]
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Performance Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary"><Calendar size={16} /> Last 7 Days</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '10px' }}><DollarSign size={20} /></div>
            <span style={{ color: 'green', fontSize: '0.8rem', fontWeight: 600 }}>+12.5%</span>
          </div>
          <p className="stat-label">Total Revenue</p>
          <p className="stat-value">$24,560.00</p>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '10px' }}><ShoppingBag size={20} /></div>
            <span style={{ color: 'green', fontSize: '0.8rem', fontWeight: 600 }}>+5.2%</span>
          </div>
          <p className="stat-label">Total Orders</p>
          <p className="stat-value">1,245</p>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '10px' }}><UsersIcon size={20} /></div>
            <span style={{ color: 'red', fontSize: '0.8rem', fontWeight: 600 }}>-2.1%</span>
          </div>
          <p className="stat-label">Total Users</p>
          <p className="stat-value">8,342</p>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '10px' }}><TrendingUp size={20} /></div>
            <span style={{ color: 'green', fontSize: '0.8rem', fontWeight: 600 }}>+8.4%</span>
          </div>
          <p className="stat-label">Conversion Rate</p>
          <p className="stat-value">3.2%</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <div className="data-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Revenue Comparison</h3>
          <Line data={lineData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div className="data-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700 }}>Daily Activity</h3>
            <select 
              value={dataView} 
              onChange={(e) => setDataView(e.target.value)}
              style={{ width: 'auto', padding: '5px' }}
            >
              <option value="money">Money Made</option>
              <option value="declined">Declined Value</option>
              <option value="signups">User Signups</option>
            </select>
          </div>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
