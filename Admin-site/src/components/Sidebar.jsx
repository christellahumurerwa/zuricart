import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, LogOut, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/orders' },
    { name: 'Stock / Products', icon: <Package size={20} />, path: '/stock' },
    { name: 'Users', icon: <Users size={20} />, path: '/users' },
    { name: 'Payment Channels', icon: <CreditCard size={20} />, path: '/payments' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo" style={{ marginBottom: '1rem' }}>
        <img src="/images/brand-mark.png" alt="Z" style={{ height: '32px', width: '32px', objectFit: 'contain' }} onError={(e) => e.target.style.display='none'} />
        <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>ZURI ADMIN</span>
      </div>
      
      <nav className="nav-links">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={item.path === '/'}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <button onClick={() => logout()} className="nav-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
