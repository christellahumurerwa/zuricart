import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

const Orders = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const mockOrders = [
    { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', phone: '+250123456', total: 125.0, date: '2026-04-10', status: 'pending' },
    { id: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', phone: '+250789012', total: 45.0, date: '2026-04-11', status: 'completed' },
    { id: 'ORD-003', customer: 'Bob Wilson', email: 'bob@example.com', phone: '+250345678', total: 85.0, date: '2026-04-09', status: 'declined' },
    { id: 'ORD-004', customer: 'Alice Brown', email: 'alice@example.com', phone: '+250567890', total: 220.0, date: '2026-04-11', status: 'pending' },
  ];

  const filteredOrders = mockOrders.filter(order => {
    const matchesFilter = filter === 'All' || order.status === filter.toLowerCase();
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">Order Management</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px', width: '300px' }} 
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </div>

      <div className="data-card">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600 }}>#{order.id}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{order.customer}</div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>{order.email}</div>
                </td>
                <td style={{ fontWeight: 700 }}>${order.total.toFixed(2)}</td>
                <td>{order.date}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn" style={{ padding: '6px', background: '#f5f5f5' }} title="View Details"><Eye size={16} /></button>
                    {order.status === 'pending' && (
                      <>
                        <button className="btn" style={{ padding: '6px', background: '#d4edda', color: '#155724' }} title="Mark Completed"><CheckCircle size={16} /></button>
                        <button className="btn" style={{ padding: '6px', background: '#f8d7da', color: '#721c24' }} title="Decline"><XCircle size={16} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default Orders;
