import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const products = [
    { id: 1, name: 'Premium Baby Romper', price: '$24.99', image: '/images/hero1.png' },
    { id: 2, name: 'Soft Leather Shoes', price: '$35.00', image: '/images/hero2.png' },
    { id: 3, name: 'Wooden Organic Toy', price: '$18.50', image: '/images/hero3.png' },
    { id: 4, name: 'Cotton Sleep Set', price: '$29.99', image: '/images/hero1.png' },
    { id: 5, name: 'Designer Baby Boots', price: '$45.00', image: '/images/hero2.png' },
    { id: 6, name: 'Minimalist Play Blocks', price: '$22.00', image: '/images/hero3.png' },
  ];

  // Duplicate products for seamless loop
  const rollingProducts = [...products, ...products];

  return (
    <section className="hero" style={{ padding: '4rem 0', background: '#fff' }}>
      <div style={{ padding: '0 5%', marginBottom: '4rem' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '4.5rem', fontWeight: 800, lineHeight: 1, marginBottom: '2rem' }}
        >
          PREMIUM CARE <br />
          FOR YOUR LITTLE <span style={{ color: '#ccc' }}>ANGELS.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', marginBottom: '2.5rem' }}
        >
          Discover our curated collection of high-quality baby clothes, shoes, and toys. 
          Designed for comfort, styled for the modern family.
        </motion.p>
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="premium-btn"
        >
          Explore Collection <ArrowRight size={20} />
        </motion.button>
      </div>

      <div className="rolling-container">
        <div className="rolling-content">
          {rollingProducts.map((product, index) => (
            <div key={index} style={{
              minWidth: '350px',
              margin: '0 1rem',
              textAlign: 'center'
            }}>
              <div style={{
                width: '100%',
                aspectRatio: '1/1',
                overflow: 'hidden',
                borderRadius: '12px',
                marginBottom: '1rem',
                border: '1px solid #f0f0f0'
              }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{product.name}</p>
              <p style={{ fontWeight: 800, color: '#999' }}>{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
