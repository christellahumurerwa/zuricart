import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Smartphone, CreditCard, Link as LinkIcon, DollarSign } from 'lucide-react';

const Payments = () => {
  const [channels, setChannels] = useState([
    { id: '1', name: 'MTN MoMo', code: '*182*8*1*2054917#', owner: 'Christella', type: 'USSD' },
    { id: '2', name: 'Direct Bank Transfer', code: 'BK: 0000 0000 0000 0000', owner: 'ZURI CART LTD', type: 'Bank' },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentChannel, setCurrentChannel] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    // Logic to save/update
    setIsEditing(false);
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <h1 className="page-title">Payment Channels</h1>
        <button onClick={() => { setCurrentChannel(null); setIsEditing(true); }} className="btn btn-primary">
          <Plus size={18} /> Add New Channel
        </button>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Configure the payment methods available to your customers during checkout. 
          The information below will be displayed in the public cart page.
        </p>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {channels.map((ch) => (
            <div key={ch.id} className="data-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '12px' }}>
                  {ch.type === 'USSD' ? <Smartphone size={24} /> : <CreditCard size={24} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{ch.name}</h3>
                  <p style={{ fontWeight: 800, fontSize: '1.2rem', margin: '8px 0', fontFamily: 'monospace' }}>{ch.code}</p>
                  <p style={{ color: '#999', fontSize: '0.85rem' }}>Account Owner: {ch.owner}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { setCurrentChannel(ch); setIsEditing(true); }} className="btn" style={{ padding: '8px', background: '#f5f5f5' }}><Edit2 size={18} /></button>
                <button className="btn" style={{ padding: '8px', background: '#f8d7da', color: '#721c24' }}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="overlay" style={{ display: 'flex' }}>
          <div className="data-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{currentChannel ? 'Edit Channel' : 'Add Channel'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Channel Name</label>
                <input type="text" placeholder="Ex: Airtel Money" defaultValue={currentChannel?.name} required />
              </div>
              <div className="form-group">
                <label>Payment Code / Acc Number</label>
                <input type="text" placeholder="Ex: *182*..." defaultValue={currentChannel?.code} required />
              </div>
              <div className="form-group">
                <label>Owner Name</label>
                <input type="text" placeholder="Ex: Christella" defaultValue={currentChannel?.owner} required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select defaultValue={currentChannel?.type}>
                  <option value="USSD">USSD / Mobile</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="Link">Payment Link</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn" style={{ flex: 1, background: '#eee' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
