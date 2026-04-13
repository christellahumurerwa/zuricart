import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading product details...</div>;
  if (!product) return <div style={{ padding: '5rem', textAlign: 'center' }}>Product not found.</div>;

  return (
    <div className="product-detail" style={{ padding: '4rem 5%', display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.2fr', gap: '5rem' }}>
      <button 
        onClick={() => window.history.back()}
        style={{ position: 'absolute', top: '100px', left: '5%', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
      >
        <ChevronLeft size={20} /> Back to Catalog
      </button>

      <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #efefef' }}>
        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#999', fontWeight: 700, letterSpacing: '2px' }}>{product.category}</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '1rem 0' }}>{product.name}</h1>
          <p style={{ fontSize: '1.8rem', fontWeight: 800 }}>{formatPrice(product.price)}</p>
        </div>

        <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: 1.8 }}>
          {product.description} This premium product is designed for comfort and safety. 
          Perfect for toddlers aged {product.ageMonths || product.ageYears} months. 
          The {product.color} finish adds a touch of elegance to your baby's essentials.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: '#999', fontWeight: 600, marginBottom: '4px' }}>Age Group</p>
            <p style={{ fontWeight: 700 }}>{product.ageMonths || product.ageYears} Months</p>
          </div>
          <div style={{ padding: '1.5rem', background: '#f9f9f9', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: '#999', fontWeight: 600, marginBottom: '4px' }}>Weight Class</p>
            <p style={{ fontWeight: 700 }}>{product.weight}</p>
          </div>
        </div>

        <button 
          onClick={() => {
            addToCart(product);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="premium-btn" 
          style={{ padding: '20px', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          {added ? <Check size={20} /> : <ShoppingCart size={20} />}
          {added ? 'Added to Cart!' : 'Add to Cart'}
        </button>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem', marginTop: '1rem', display: 'flex', gap: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#666' }}>
            <Truck size={18} /> Fast Delivery
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#666' }}>
            <ShieldCheck size={18} /> Quality Certified
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
