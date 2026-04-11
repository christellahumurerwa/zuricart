import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
      <Link to="/" style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-1.5px' }}>
        ZURI <span style={{ color: '#666' }}>CART</span>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
          <User size={20} />
          <span className="hide-mobile">Login</span>
        </Link>
        <Link to="/cart" style={{ position: 'relative' }}>
          <ShoppingCart size={22} />
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
          }}>0</span>
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
