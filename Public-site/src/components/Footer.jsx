import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// Inline Instagram icon (lucide-react version doesn't include it)
const InstagramIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const DEFAULT = {
  branding: {
    tagline: 'Premium baby essentials, thoughtfully sourced for your little one.',
    about: "ZURI CART is Rwanda's premium online baby shop. We source quality products internationally to bring you the best for your baby's journey.",
    email: 'christellahumurerwa5@gmail.com',
    phone: '+250783018853',
    whatsapp: '+250792876203',
    address: 'Kigali, Rwanda',
    copyright: '© 2026 ZURI CART. All rights reserved.',
    instagram: '',
  },
  categories: [
    { label: 'Clothes', url: '/catalog?category=Clothes' },
    { label: 'Shoes', url: '/catalog?category=Shoes' },
    { label: 'Toys', url: '/catalog?category=Toys' },
    { label: 'Equipment', url: '/catalog?category=Equipment' },
    { label: 'Pampers', url: '/catalog?category=Pampers' },
    { label: 'Suitcases', url: '/catalog?category=Suitcases' },
  ],
  quickLinks: [
    { label: 'Home', url: '/' },
    { label: 'My Cart', url: '/cart' },
    { label: 'Log In', url: '/login' },
    { label: 'Sign Up', url: '/signup' },
  ],
};

const Footer = () => {
  const [branding, setBranding] = useState(DEFAULT.branding);
  const [categories, setCategories] = useState(DEFAULT.categories);
  const [quickLinks, setQuickLinks] = useState(DEFAULT.quickLinks);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'siteSettings', 'config'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.footerBranding) setBranding(b => ({ ...b, ...data.footerBranding }));
          if (data.footerCategories) setCategories(data.footerCategories);
          if (data.quickLinks) setQuickLinks(data.quickLinks);
        }
      } catch (_) { /* use defaults */ }
    };
    load();
  }, []);

  const linkStyle = { color: '#aaa', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' };

  return (
    <footer style={{ background: '#000', color: '#fff', padding: '5rem 5% 2rem', marginTop: '4rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem'
      }}>
        {/* Column 1: Branding */}
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>ZURI CART</h3>
          <p style={{ color: '#aaa', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>{branding.tagline}</p>
          <p style={{ color: '#666', fontSize: '0.82rem', lineHeight: 1.7 }}>{branding.about}</p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
            {branding.instagram && (
              <a href={`https://instagram.com/${branding.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" style={{ color: '#fff' }}>
                <InstagramIcon size={20} />
              </a>
            )}
            <a href={`https://wa.me/${branding.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#fff' }}>
              <MessageCircle size={20} />
            </a>
            <a href={`mailto:${branding.email}`} style={{ color: '#fff' }}>
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quick Links</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', listStyle: 'none', padding: 0, margin: 0 }}>
            {quickLinks.map((lnk, i) => (
              <li key={i}><Link to={lnk.url} style={linkStyle}>{lnk.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Categories</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', listStyle: 'none', padding: 0, margin: 0 }}>
            {categories.map((cat, i) => (
              <li key={i}><Link to={cat.url} style={linkStyle}>{cat.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Get in Touch</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#aaa', fontSize: '0.88rem', listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={15} /><a href={`tel:${branding.phone}`} style={linkStyle}>{branding.phone}</a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MessageCircle size={15} />
              <a href={`https://wa.me/${branding.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={linkStyle}>{branding.whatsapp} (WhatsApp)</a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={15} /><a href={`mailto:${branding.email}`} style={linkStyle}>{branding.email}</a>
            </li>
            {branding.address && <li style={{ color: '#666', fontSize: '0.82rem' }}>📍 {branding.address}</li>}
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #222', paddingTop: '2rem', textAlign: 'center', color: '#555', fontSize: '0.8rem' }}>
        {branding.copyright}
      </div>
    </footer>
  );
};

export default Footer;
