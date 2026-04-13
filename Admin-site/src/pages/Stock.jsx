import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

const Stock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Clothes', price: '', image: '', stock: '' });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const prods = [];
      snapshot.forEach(doc => prods.push({ id: doc.id, ...doc.data() }));
      setProducts(prods);
    });
    return () => unsub();
  }, []);

  const toggleStatus = async (id, currentStatus, currentStock) => {
    try {
      const newStatus = currentStatus === 'available' ? 'out of stock' : 'available';
      await updateDoc(doc(db, 'products', id), { 
        status: newStatus,
        stock: newStatus === 'out of stock' ? 0 : currentStock || 10
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        name: newProduct.name,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        image: newProduct.image || '/images/hero1.png',
        stock: parseInt(newProduct.stock),
        status: parseInt(newProduct.stock) > 0 ? 'available' : 'out of stock',
        ageMonths: '0-12',
        ageYears: '0',
        weight: '1kg',
        color: 'Mixed'
      });
      setShowAddModal(false);
      setNewProduct({ name: '', category: 'Clothes', price: '', image: '', stock: '' });
    } catch (err) {
      console.error("Failed to add product", err);
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
                      onClick={() => toggleStatus(p.id, p.status, p.stock)}
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
            <form onSubmit={addProduct}>
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" placeholder="Ex: Premium Romper" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                    <option>Clothes</option>
                    <option>Shoes</option>
                    <option>Toys</option>
                    <option>Pampers</option>
                    <option>Equipment</option>
                    <option>Suitcases</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Direct Image Link</label>
                <input type="text" placeholder="/images/hero1.png or HTTPS URL" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Initial Stock</label>
                <input type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
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
