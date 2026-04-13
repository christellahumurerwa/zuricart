import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin access limit logic
  const isAdminUser = currentUser && currentUser.email === 'christellahumurerwa5@gmail.com';

  async function login(email, password) {
    if (email === 'christellahumurerwa5@gmail.com' && password === 'Umurerwa$123') {
      localStorage.setItem('mockAdminAuth', 'true');
      setCurrentUser({ email: 'christellahumurerwa5@gmail.com', uid: 'admin-hardcoded' });
      return;
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    localStorage.removeItem('mockAdminAuth');
    setCurrentUser(null);
    return signOut(auth);
  }

  useEffect(() => {
    // Check if we have hardcoded admin session first
    if (localStorage.getItem('mockAdminAuth') === 'true') {
      setCurrentUser({ email: 'christellahumurerwa5@gmail.com', uid: 'admin-hardcoded' });
      setLoading(false);
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (localStorage.getItem('mockAdminAuth') !== 'true') {
        setCurrentUser(user);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdminUser,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
