import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Filter, X, ChevronDown, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Catalog = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialCategory = queryParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // States for filters
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedAge, setSelectedAge] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');

  const categories = ['All', 'Clothes', 'Shoes', 'Toys', 'Equipment', 'Pampers', 'Suitcases'];
  const ageGroups = ['All', '0-6 Months', '6-12 Months', '12-24 Months', '2+ Years', '5+ Years'];
  const colors = ['All', 'White', 'Black', 'Natural', 'Grey', 'Pink', 'Blue'];

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    // Filter by search
    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by age (Simplified for mock)
    if (selectedAge !== 'All') {
      result = result.filter(p => p.ageMonths.includes(selectedAge.split(' ')[0]) || p.ageYears === selectedAge.split(' ')[0]);
    }

    // Filter by color
    if (selectedColor !== 'All') {
      result = result.filter(p => p.color === selectedColor);
    }

    setFilteredProducts(result);
  }, [search, selectedCategory, priceRange, selectedAge, selectedColor, products]);

  return (
    <div className="catalog-page" style={{ padding: '2rem 5%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>COLLECTION</h1>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="premium-btn secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Filter size={18} /> Filters
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem' }}>
        {/* Filters Sidebar (Desktop) */}
        <aside className="hide-mobile" style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map(cat => (
                <label key={cat} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  color: selectedCategory === cat ? '#000' : '#666',
                  fontWeight: selectedCategory === cat ? 600 : 400
                }}>
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    style={{ accentColor: '#000' }}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Price Range</h4>
            <input 
              type="range" 
              min="0" 
              max="1000" 
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              style={{ width: '100%', accentColor: '#000' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
              <span>$0</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Age / Months</h4>
            <select 
              value={selectedAge} 
              onChange={(e) => setSelectedAge(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              {ageGroups.map(age => <option key={age} value={age}>{age}</option>)}
            </select>
          </div>

          <div>
            <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Color</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid #ddd',
                    background: selectedColor === color ? '#000' : '#fff',
                    color: selectedColor === color ? '#fff' : '#000',
                    fontSize: '0.85rem'
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {filteredProducts.map(product => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={product.id} 
                className="product-card"
              >
                <Link to={`/product/${product.id}`} style={{ position: 'relative', overflow: 'hidden', display: 'block' }}>
                  <img src={product.image} alt={product.name} className="product-image" />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#fff',
                    padding: '8px',
                    borderRadius: '50%',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}>
                    <ShoppingBag size={18} />
                  </div>
                </Link>
                <div className="product-info">
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#999', fontWeight: 600 }}>{product.category}</span>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <h3 style={{ color: '#999' }}>No products found matching your filters.</h3>
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('All');
                  setPriceRange([0, 1000]);
                  setSelectedAge('All');
                  setSelectedColor('All');
                }}
                style={{ marginTop: '1rem', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          .catalog-page { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Catalog;
