import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [navLinks, setNavLinks] = useState([
    { label: 'Home', url: '/' },
    { label: 'All Categories', url: '/categories' },
  ]);
  const [logoUrl, setLogoUrl] = useState('');
  const { currentUser, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Load custom nav links from Firestore settings
  useEffect(() => {
    const loadNav = async () => {
      try {
        const snap = await getDoc(doc(db, 'siteSettings', 'config'));
        if (snap.exists() && snap.data().navLinks) {
          setNavLinks(snap.data().navLinks);
          if (snap.data().logoUrl) setLogoUrl(snap.data().logoUrl);
        }
      } catch (err) {
        // Silently fall back to defaults
      }
    };
    loadNav();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 5%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        {logoUrl
          ? <img src={logoUrl} alt="ZURI CART" style={{ height: '40px', objectFit: 'contain' }} />
          : <span style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-1.5px', color: '#000' }}>ZURI <span style={{ color: '#666' }}>CART</span></span>
        }
      </Link>

      <form onSubmit={handleSearch} style={{ flex: 1, margin: '0 3rem', maxWidth: '600px', position: 'relative' }}>
        <input 
          type="text" 
          placeholder="Search for clothes, toys, shoes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 20px 12px 45px',
            borderRadius: '25px',
            border: '1px solid #efefef',
            background: '#f9f9f9',
            fontSize: '0.95rem'
          }}
        />
        <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Dynamic nav links from Firestore / defaults */}
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.url}
            style={{ fontWeight: 500, color: '#000', textDecoration: 'none', whiteSpace: 'nowrap' }}
            className="hide-mobile"
          >
            {link.label}
          </Link>
        ))}
        {currentUser ? (
          <button onClick={() => logout()} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span className="hide-mobile">Logout</span>
          </button>
        ) : (
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            <User size={20} />
            <span className="hide-mobile">Login</span>
          </Link>
        )}
        <Link to="/cart" style={{ position: 'relative' }}>
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#000',
              color: '#fff',
              fontSize: '0.7rem',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: 700
            }}>{cartCount}</span>
          )}
        </Link>
        <div className="show-mobile" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
          form { display: none; }
        }
      `}</style>
    </header>
  );
};

export default Header;
