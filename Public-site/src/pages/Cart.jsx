import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, MapPin, Phone, MessageSquare, CreditCard, Mail, ShoppingBag } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const [checkoutData, setCheckoutData] = useState({
    location: '',
    phone: '',
    contactChannel: 'Whatsapp'
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);

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
    setPlacing(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        total,
        location: checkoutData.location,
        phone: checkoutData.phone,
        contactChannel: checkoutData.contactChannel,
        status: 'Pending',
        createdAt: new Date().toISOString()
      });

      const orderDetails = cartItems.map(item => `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
      const message = `New Order from ZURI CART:\n\nItems:\n${orderDetails}\n\nTotal: $${total.toFixed(2)}\nLocation: ${checkoutData.location}\nPhone: ${checkoutData.phone}\n\nPayment: Momo (*182*8*1*2054917# - Christella)`;

      clearCart();
      setOrderPlaced(true);

      if (checkoutData.contactChannel === 'Whatsapp') {
        window.open(`https://wa.me/250792876203?text=${encodeURIComponent(message)}`, '_blank');
      } else {
        window.location.href = `mailto:christellahumurerwa5@gmail.com?subject=New Order from ZURI CART&body=${encodeURIComponent(message)}`;
      }
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to submit order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div style={{ padding: '6rem 5%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Order Placed!</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>Thank you! Your order has been recorded. We'll contact you shortly to confirm delivery.</p>
        <Link to="/" className="premium-btn" style={{ textDecoration: 'none', display: 'inline-flex' }}>Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ padding: '4rem 5%' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>YOUR CART</h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <ShoppingBag size={64} style={{ color: '#ddd', marginBottom: '1.5rem' }} />
          <h3 style={{ color: '#999', marginBottom: '1.5rem' }}>Your cart is empty.</h3>
          <Link to="/catalog" className="premium-btn" style={{ textDecoration: 'none', display: 'inline-flex' }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* Cart Items */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 1fr auto auto',
                  alignItems: 'center',
                  gap: '1.5rem',
                  borderBottom: '1px solid #efefef',
                  paddingBottom: '2rem'
                }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', borderRadius: '12px', aspectRatio: '1', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontWeight: 600, marginBottom: '4px', fontSize: '1rem' }}>{item.name}</h3>
                    <p style={{ color: '#999', fontSize: '0.9rem' }}>{item.category}</p>
                    <p style={{ fontWeight: 700, marginTop: '6px' }}>${item.price.toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f5f5f5', padding: '8px 15px', borderRadius: '25px' }}>
                    <Minus size={14} style={{ cursor: 'pointer' }} onClick={() => updateQuantity(item.id, -1)} />
                    <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <Plus size={14} style={{ cursor: 'pointer' }} onClick={() => updateQuantity(item.id, 1)} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, marginBottom: '10px' }}>${(item.price * item.quantity).toFixed(2)}</p>
                    <Trash2 size={16} color="#ff4d4f" style={{ cursor: 'pointer' }} onClick={() => removeFromCart(item.id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ background: '#f9f9f9', padding: '2.5rem', borderRadius: '24px', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>ORDER SUMMARY</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
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
                <input type="text" placeholder="Ex: Kigali, Nyarugenge, KN 2 St" required value={checkoutData.location} onChange={e => setCheckoutData({ ...checkoutData, location: e.target.value })} />
              </div>
              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> Phone Number</label>
                <input type="tel" placeholder="+250..." required value={checkoutData.phone} onChange={e => setCheckoutData({ ...checkoutData, phone: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Send Order Via</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['Whatsapp', 'Email'].map(ch => (
                    <button key={ch} type="button" onClick={() => setCheckoutData({ ...checkoutData, contactChannel: ch })} style={{
                      flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd',
                      background: checkoutData.contactChannel === ch ? '#000' : '#fff',
                      color: checkoutData.contactChannel === ch ? '#fff' : '#000',
                      fontWeight: 600, cursor: 'pointer'
                    }}>{ch}</button>
                  ))}
                </div>
              </div>

              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #efefef', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={16} /> MOMO PAYMENT
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Dial the code below to pay:</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '1px' }}>*182*8*1*2054917#</p>
                <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>Name: Humurerwa Christella</p>
              </div>

              <button className="premium-btn" style={{ width: '100%', padding: '15px', justifyContent: 'center' }} disabled={placing}>
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .cart-page > div { grid-template-columns: 1fr !important; }
          .cart-page > div > div:last-child { position: static !important; }
        }
        @media (max-width: 600px) {
          .cart-page > div > div > div { grid-template-columns: 70px 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Cart;
