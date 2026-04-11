import React, { useState } from 'react';
import { Search, Mail, User, Cake, MoreVertical, Shield } from 'lucide-react';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', gender: 'Boy', bday: '2023-05-15', registered: '2026-04-01' },
    { id: '2', name: 'Alice Smith', email: 'alice@example.com', gender: 'Girl', bday: '2024-02-10', registered: '2026-04-05' },
    { id: '3', name: 'Zura Baby', email: 'zura@example.com', gender: 'Girl', bday: '2025-11-20', registered: '2026-04-10' },
  ];

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">Registered Users</h1>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px', width: '300px' }} 
          />
        </div>
      </div>

      <div className="data-card">
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Gender</th>
              <th>Baby Birthday</th>
              <th>Registered At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', background: '#000', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                    }}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#999' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>{u.gender}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cake size={14} color="#999" /> {u.bday}
                  </div>
                </td>
                <td>{u.registered}</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn" style={{ padding: '6px', background: '#f5f5f5' }}><Mail size={16} /></button>
                    <button className="btn" style={{ padding: '6px', background: '#e9ecef' }}><Shield size={16} title="Grant Admin" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
