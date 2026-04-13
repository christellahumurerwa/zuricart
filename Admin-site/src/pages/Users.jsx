import React, { useState, useEffect } from 'react';
import { Search, Mail, User, Cake, MoreVertical, Shield } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = [];
      snapshot.forEach(doc => usersData.push({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });
    return () => unsub();
  }, []);

  const filteredUsers = users.filter((u) => {
    const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

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
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', background: '#000', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                    }}>
                      {(u.firstName || 'U').charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#999' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>{u.gender || 'N/A'}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cake size={14} color="#999" /> {u.birthday || 'N/A'}
                  </div>
                </td>
                <td>{u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : 'N/A'}</td>
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
