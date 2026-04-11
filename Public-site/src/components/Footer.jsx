import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#000', color: '#fff', padding: '5rem 5% 2rem', marginTop: '4rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem'
      }}>
        {/* Column 1: About Us */}
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>ZURI CART</h3>
          <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.8 }}>
            Premium baby requirements starting from clothes, shoes, pampers, suitcases, equipment, and Toys. 
            Providing the best quality for your little ones.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quick Links</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#aaa', fontSize: '0.9rem' }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/catalog">Catalog</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Categories</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#aaa', fontSize: '0.9rem' }}>
            <li><Link to="/catalog?category=Clothes">Clothes</Link></li>
            <li><Link to="/catalog?category=Shoes">Shoes</Link></li>
            <li><Link to="/catalog?category=Toys">Toys</Link></li>
            <li><Link to="/catalog?category=Equipment">Equipment</Link></li>
            <li><Link to="/catalog?category=Pampers">Pampers</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact & Social */}
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Get in Touch</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} /> +250783018853</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} /> +250792876203 (Whatsapp)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={16} /> christellahumurerwa5@gmail.com</li>
          </ul>
          <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
            <a href="#" style={{ color: '#fff' }}>IG</a>
            <a href="#" style={{ color: '#fff' }}>FB</a>
            <a href="#" style={{ color: '#fff' }}>X (Twitter)</a>
          </div>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #222',
        paddingTop: '2rem',
        textAlign: 'center',
        color: '#666',
        fontSize: '0.8rem'
      }}>
        © 2026 ZURI CART. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
