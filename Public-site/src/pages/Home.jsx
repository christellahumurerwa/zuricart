import React from 'react';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';

const Home = () => {
  const categories = [
    { name: 'Clothes', image: '/images/hero1.png', items: '120+ Items' },
    { name: 'Shoes', image: '/images/hero2.png', items: '45+ Items' },
    { name: 'Toys', image: '/images/hero3.png', items: '80+ Items' },
    { name: 'Equipment', image: '/images/hero1.png', items: '30+ Items' },
  ];

  return (
    <div className="home-page">
      <Hero />
      
      <section style={{ padding: '6rem 5%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <span style={{ textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '2px', color: '#999' }}>Shop by</span>
            <h2 className="section-title" style={{ margin: 0 }}>CATEGORIES</h2>
          </div>
          <button className="premium-btn secondary">View All</button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {categories.map((cat, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -10 }}
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '4/5',
                cursor: 'pointer'
              }}
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem',
                color: '#fff'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{cat.name}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{cat.items}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section style={{ background: '#f9f9f9', padding: '6rem 5%' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
          <h2 className="section-title">WHY ZURI CART?</h2>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            We understand that your baby deserves only the best. 
            That's why we source our products from top global manufacturers, 
            ensuring safety, quality, and style in every piece.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          textAlign: 'center'
        }}>
          {[
            { title: 'Premium Quality', desc: 'Handpicked materials that are soft on baby skin.' },
            { title: 'Fast Delivery', desc: 'We deliver your orders within 24-48 hours.' },
            { title: 'Secure Payment', desc: 'Safe transactions via Momo and other channels.' }
          ].map((feature, i) => (
            <div key={i}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>{feature.title}</h4>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
