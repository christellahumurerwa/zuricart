import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Stock from './pages/Stock';
import Users from './pages/Users';
import Payments from './pages/Payments';
import Auth from './pages/Auth';
import './index.css';

// Simple Auth Guard Mock
const ProtectedRoute = ({ children }) => {
  const isAdmin = true; // Temporary mock
  return isAdmin ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="admin-layout">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/stock" element={<Stock />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/payments" element={<Payments />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
