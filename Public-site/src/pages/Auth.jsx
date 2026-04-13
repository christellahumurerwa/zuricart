import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Calendar, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = ({ mode = 'login' }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup, login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthday: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const slidingProducts = [
    { name: 'Mini Romper', price: '$22', image: '/images/hero1.png' },
    { name: 'Baby Sneakers', price: '$45', image: '/images/hero2.png' },
    { name: 'Organic Bunny', price: '$15', image: '/images/hero3.png' },
    { name: 'Cotton Beanie', price: '$12', image: '/images/hero1.png' },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (currentMode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          return setError('Passwords do not match');
        }
        await signup(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          birthday: formData.birthday
        });
        navigate('/');
      } else {
        await login(formData.email, formData.password);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      background: '#fff'
    }}>
      {/* Left Side: Animation */}
      <div style={{
        background: '#000',
        color: '#fff',
        padding: '4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            JOIN THE <br />ZURI FAMILY.
          </h2>
          <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '400px', marginBottom: '3rem' }}>
            Get exclusive access to the latest premium baby collections and special offers.
          </p>
        </div>

        {/* Sliding Clothes Animation */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: 0,
          width: '100%',
          overflow: 'hidden'
        }}>
          <div className="rolling-container" style={{ padding: 0 }}>
            <div className="rolling-content" style={{ animationDuration: '15s' }}>
              {[...slidingProducts, ...slidingProducts].map((item, i) => (
                <div key={i} style={{
                  minWidth: '150px',
                  margin: '0 1rem',
                  background: 'rgba(255,255,255,0.1)',
                  padding: '1rem',
                  borderRadius: '12px',
                  textAlign: 'center',
                  backdropFilter: 'blur(5px)'
                }}>
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '8px', marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.7rem', fontWeight: 600 }}>{item.name}</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800 }}>{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: '450px', width: '100%', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {currentMode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p style={{ color: '#666', marginBottom: '2.5rem' }}>
            {currentMode === 'login' 
              ? "Don't have an account? " 
              : "Already have an account? "}
            <span 
              onClick={() => setCurrentMode(currentMode === 'login' ? 'signup' : 'login')}
              style={{ color: '#000', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
            >
              {currentMode === 'login' ? 'Sign Up' : 'Log In'}
            </span>
          </p>

          {error && <div style={{ background: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {currentMode === 'signup' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" onChange={handleInputChange} required />
                </div>
              </div>
            )}

            {currentMode === 'signup' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Gender</label>
                  <select name="gender" onChange={handleInputChange} required style={{
                    width: '100%', padding: '12px', border: '1px solid #e2e2e2', borderRadius: '12px'
                  }}>
                    <option value="">Select</option>
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Birthday</label>
                  <input type="date" name="birthday" onChange={handleInputChange} required />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" onChange={handleInputChange} required />
            </div>

            <div className="input-group" style={{ position: 'relative' }}>
              <label>Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                onChange={handleInputChange} 
                required 
                minLength={6}
              />
              <div 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '15px', top: '42px', cursor: 'pointer', color: '#999' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {currentMode === 'signup' && (
              <div className="input-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" onChange={handleInputChange} required />
              </div>
            )}

            <button className="premium-btn" style={{ width: '100%', padding: '15px', marginBottom: '1.5rem' }}>
              {currentMode === 'login' ? 'Log In' : 'Sign Up'}
            </button>

            <div style={{ position: 'relative', textAlign: 'center', marginBottom: '1.5rem' }}>
              <hr style={{ border: 'none', borderTop: '1px solid #efefef' }} />
              <span style={{ 
                position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', 
                background: '#fff', padding: '0 15px', fontSize: '0.85rem', color: '#999' 
              }}>OR</span>
            </div>

            <button 
              type="button"
              onClick={handleGoogle}
              className="premium-btn secondary" 
              style={{ width: '100%', padding: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}
            >
              <Smile size={20} /> Continue with Google
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-container { grid-template-columns: 1fr !important; }
          .auth-container > div:first-child { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Auth;
