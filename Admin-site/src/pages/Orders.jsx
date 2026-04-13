import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, MoreVertical } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const Orders = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData = [];
      snapshot.forEach(doc => ordersData.push({ id: doc.id, ...doc.data() }));
      // Sort by latest first
      ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(ordersData);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'All' || order.status.toLowerCase() === filter.toLowerCase();
    const userEmail = order.userEmail || '';
    const matchesSearch = userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
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
                  <div style={{ fontWeight: 500 }}>{order.userEmail}</div>
                  <div style={{ fontSize: '0.8rem', color: '#999' }}>{order.phone} | {order.location}</div>
                </td>
                <td style={{ fontWeight: 700 }}>${order.total.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn" style={{ padding: '6px', background: '#f5f5f5' }} title="View Details"><Eye size={16} /></button>
                    {order.status.toLowerCase() === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(order.id, 'Completed')} className="btn" style={{ padding: '6px', background: '#d4edda', color: '#155724' }} title="Mark Completed"><CheckCircle size={16} /></button>
                        <button onClick={() => updateStatus(order.id, 'Declined')} className="btn" style={{ padding: '6px', background: '#f8d7da', color: '#721c24' }} title="Decline"><XCircle size={16} /></button>
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
