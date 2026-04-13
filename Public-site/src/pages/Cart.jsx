import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, MapPin, Phone, MessageSquare, CreditCard, Mail } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Cart = () => {
  // Mock cart items
  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Premium Baby Romper', price: 25.0, quantity: 2, image: '/images/hero1.png' },
    { id: '2', name: 'Soft Leather Shoes', price: 35.0, quantity: 1, image: '/images/hero2.png' }
  ]);

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [checkoutData, setCheckoutData] = useState({
    location: '',
    phone: '',
    contactChannel: 'Whatsapp'
  });

  const updateQuantity = (id, delta) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 5.0;
  const total = subtotal + deliveryFee;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login or sign up to place an order.");
      navigate('/login');
      return;
    }

    try {
      // Save order to Firestore
      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        total: total,
        location: checkoutData.location,
        phone: checkoutData.phone,
        contactChannel: checkoutData.contactChannel,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });

      // Clear cart logic here (Normally you'd wipe the context state)
      setCartItems([]);

      const orderDetails = cartItems.map(item => `${item.name} (x${item.quantity}) - $${item.price * item.quantity}`).join('\n');
      const message = `New Order from ZURI CART:\n\nItems:\n${orderDetails}\n\nTotal: $${total}\nLocation: ${checkoutData.location}\nPhone: ${checkoutData.phone}\n\nPayment: Momo (*182*8*1*2054917# - Christella)`;

      if (checkoutData.contactChannel === 'Whatsapp') {
        window.open(`https://wa.me/250792876203?text=${encodeURIComponent(message)}`, '_blank');
      } else {
        window.location.href = `mailto:christellahumurerwa5@gmail.com?subject=New Order from ZURI CART&body=${encodeURIComponent(message)}`;
      }
    } catch (err) {
      console.error("Error creating order: ", err);
      alert("Failed to submit order.");
    }
  };

  return (
    <div className="cart-page" style={{ padding: '4rem 5%', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }}>
      <div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>YOUR CART</h1>
        
        {cartItems.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {cartItems.map(item => (
              <div key={item.id} style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 120px 100px',
                alignItems: 'center',
                gap: '1.5rem',
                borderBottom: '1px solid #efefef',
                paddingBottom: '2rem'
              }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: '12px' }} />
                <div>
                  <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>{item.name}</h3>
                  <p style={{ color: '#999', fontSize: '0.9rem' }}>Unit Price: ${item.price.toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#f5f5f5', padding: '8px 15px', borderRadius: '25px' }}>
                  <Minus size={16} cursor="pointer" onClick={() => updateQuantity(item.id, -1)} />
                  <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                  <Plus size={16} cursor="pointer" onClick={() => updateQuantity(item.id, 1)} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 800 }}>${(item.price * item.quantity).toFixed(2)}</p>
                  <Trash2 size={16} color="#ff4d4f" cursor="pointer" onClick={() => removeItem(item.id)} style={{ marginTop: '10px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <h3 style={{ color: '#999' }}>Your cart is empty.</h3>
          </div>
        )}
      </div>

      <div style={{ background: '#f9f9f9', padding: '3rem', borderRadius: '24px', height: 'fit-content' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>ORDER SUMMARY</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Subtotal</span>
            <span style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666' }}>Delivery</span>
            <span style={{ fontWeight: 700 }}>${deliveryFee.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
            <span style={{ fontWeight: 800 }}>Total</span>
            <span style={{ fontWeight: 800 }}>${total.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleCheckout}>
          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> Delivery Location</label>
            <input 
              type="text" 
              placeholder="Ex: Kigali, Nyarugenge, KN 2 St" 
              required 
              value={checkoutData.location}
              onChange={(e) => setCheckoutData({...checkoutData, location: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> Phone Number</label>
            <input 
              type="tel" 
              placeholder="+250..." 
              required 
              value={checkoutData.phone}
              onChange={(e) => setCheckoutData({...checkoutData, phone: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label>Send Order Via</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="button"
                onClick={() => setCheckoutData({...checkoutData, contactChannel: 'Whatsapp'})}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd',
                  background: checkoutData.contactChannel === 'Whatsapp' ? '#000' : '#fff',
                  color: checkoutData.contactChannel === 'Whatsapp' ? '#fff' : '#000',
                  fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <MessageSquare size={16} /> Whatsapp
              </button>
              <button 
                type="button"
                onClick={() => setCheckoutData({...checkoutData, contactChannel: 'Email'})}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd',
                  background: checkoutData.contactChannel === 'Email' ? '#000' : '#fff',
                  color: checkoutData.contactChannel === 'Email' ? '#fff' : '#000',
                  fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Mail size={16} /> Email
              </button>
            </div>
          </div>

          <div style={{
            background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #efefef', marginBottom: '2rem'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={16} /> MOMO PAYMENT
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Dial the code below to pay:</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#000', letterSpacing: '1px' }}>*182*8*1*2054917#</p>
            <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>Name: Humurerwa Christella</p>
          </div>

          <button className="premium-btn" style={{ width: '100%', padding: '15px' }} disabled={cartItems.length === 0}>
            Place Order
          </button>
        </form>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .cart-page { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;
