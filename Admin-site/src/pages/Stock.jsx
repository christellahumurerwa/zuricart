import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';

const Stock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [products, setProducts] = useState([
    { id: '1', name: 'Premium Baby Romper', category: 'Clothes', price: 25.0, stock: 45, status: 'available', image: '/images/hero1.png' },
    { id: '2', name: 'Soft Leather Shoes', category: 'Shoes', price: 35.0, stock: 12, status: 'available', image: '/images/hero2.png' },
    { id: '3', name: 'Wooden Organic Toy', category: 'Toys', price: 18.5, stock: 0, status: 'out of stock', image: '/images/hero3.png' },
    { id: '4', name: 'Cotton Sleep Set', category: 'Clothes', price: 29.99, stock: 20, status: 'available', image: '/images/hero1.png' },
  ]);

  const toggleStatus = (id) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const newStatus = p.status === 'available' ? 'out of stock' : 'available';
        return { ...p, status: newStatus, stock: newStatus === 'out of stock' ? 0 : p.stock || 10 };
      }
      return p;
    }));
  };

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="stock-page">
      <div className="page-header">
        <h1 className="page-title">Stock Management</h1>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input 
            type="text" 
            placeholder="Search by name, category or SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px' }} 
          />
        </div>
        <select style={{ width: '200px' }}>
          <option>All Categories</option>
          <option>Clothes</option>
          <option>Shoes</option>
          <option>Toys</option>
        </select>
      </div>

      <div className="data-card">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                  </div>
                </td>
                <td>{p.category}</td>
                <td style={{ fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                <td>
                  <span style={{ fontWeight: 600, color: p.stock === 0 ? '#dc3545' : '#1a1a1a' }}>{p.stock} units</span>
                </td>
                <td>
                  <span className={`status-badge status-${p.status.replace(' ', '-')}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn" style={{ padding: '6px' }} title="Edit"><Edit2 size={16} /></button>
                    <button 
                      onClick={() => toggleStatus(p.id)}
                      className="btn" 
                      style={{ padding: '6px', background: p.status === 'available' ? '#ffe8cc' : '#d4edda' }} 
                      title="Toggle Status"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="btn" style={{ padding: '6px', background: '#f8d7da', color: '#721c24' }} title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal (Simple Mock) */}
      {showAddModal && (
        <div className="overlay" style={{ display: 'flex' }}>
          <div className="data-card" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Add New Product</h2>
            <form onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" placeholder="Ex: Premium Romper" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select>
                    <option>Clothes</option>
                    <option>Shoes</option>
                    <option>Toys</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" />
                </div>
              </div>
              <div className="form-group">
                <label>Direct Image Link</label>
                <input type="url" placeholder="https://example.com/image.jpg" />
              </div>
              <div className="form-group">
                <label>Initial Stock</label>
                <input type="number" />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Product</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ flex: 1, background: '#eee' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
