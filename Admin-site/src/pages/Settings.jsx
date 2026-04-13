import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Layout, AlignLeft, Link as LinkIcon, Globe } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('header');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Header Nav settings
  const [navLinks, setNavLinks] = useState([
    { label: 'Home', url: '/', isDefault: true },
    { label: 'All Categories', url: '/catalog', isDefault: true },
  ]);
  const [newLink, setNewLink] = useState({ label: '', url: '' });

  // Footer settings
  const [footerData, setFooterData] = useState({
    description: 'Premium baby essentials, thoughtfully sourced for your little one.',
    email: 'christellahumurerwa5@gmail.com',
    phone: '+250783018853',
    whatsapp: '+250792876203',
    address: 'Kigali, Rwanda',
    copyright: '© 2026 ZURI CART. All rights reserved.',
  });

  // Load from Firestore
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'siteSettings', 'config'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.navLinks) setNavLinks(data.navLinks);
          if (data.footer) setFooterData(data.footer);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'siteSettings', 'config'), {
        navLinks,
        footer: footerData,
        updatedAt: new Date().toISOString(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save. Check Firestore rules.');
    } finally {
      setSaving(false);
    }
  };

  const addNavLink = () => {
    if (!newLink.label.trim() || !newLink.url.trim()) return;
    setNavLinks([...navLinks, { ...newLink, isDefault: false }]);
    setNewLink({ label: '', url: '' });
  };

  const removeNavLink = (index) => {
    const updated = navLinks.filter((_, i) => i !== index);
    setNavLinks(updated);
  };

  const tabStyle = (tab) => ({
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
    background: activeTab === tab ? '#000' : '#f5f5f5',
    color: activeTab === tab ? '#fff' : '#666',
    transition: 'all 0.2s',
  });

  return (
    <div className="settings-page" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1 className="page-title">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 600 }}>
          ✓ Settings saved! Changes will reflect on the public site shortly.
        </div>
      )}

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <button style={tabStyle('header')} onClick={() => setActiveTab('header')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Layout size={16} /> Header / Navigation</span>
        </button>
        <button style={tabStyle('footer')} onClick={() => setActiveTab('footer')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlignLeft size={16} /> Footer Content</span>
        </button>
      </div>

      {/* HEADER TAB */}
      {activeTab === 'header' && (
        <div className="data-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Navigation Links</h3>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '2rem' }}>
            These links appear in the top navigation bar of the public-facing store. The "All Categories" link always appears and cannot be removed.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {navLinks.map((link, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                background: '#f9f9f9', padding: '12px 16px', borderRadius: '10px',
                border: '1px solid #efefef'
              }}>
                <LinkIcon size={16} color="#999" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.95rem' }}>{link.label}</strong>
                  <span style={{ color: '#999', marginLeft: '12px', fontSize: '0.85rem' }}>{link.url}</span>
                </div>
                {link.isDefault ? (
                  <span style={{ fontSize: '0.75rem', background: '#e9ecef', padding: '3px 8px', borderRadius: '6px', color: '#666' }}>Default</span>
                ) : (
                  <button onClick={() => removeNavLink(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', border: '1px dashed #ccc' }}>
            <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Add New Navigation Link</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Link Label</label>
                <input
                  type="text"
                  placeholder="Ex: New Arrivals"
                  value={newLink.label}
                  onChange={e => setNewLink({ ...newLink, label: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>URL Path</label>
                <input
                  type="text"
                  placeholder="Ex: /catalog?category=New"
                  value={newLink.url}
                  onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                />
              </div>
              <button onClick={addNavLink} className="btn btn-primary" style={{ padding: '12px 20px' }}>
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff8e1', borderRadius: '12px', border: '1px solid #ffe082' }}>
            <p style={{ fontSize: '0.85rem', color: '#795548' }}>
              <strong>💡 Tip:</strong> After saving, the public site will reflect these changes. Custom links support query params like <code>/catalog?category=Toys</code>
            </p>
          </div>
        </div>
      )}

      {/* FOOTER TAB */}
      {activeTab === 'footer' && (
        <div className="data-card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 700 }}>Footer Content</h3>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Edit the information displayed in the footer of the public store.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Store Description</label>
              <textarea
                rows={3}
                value={footerData.description}
                onChange={e => setFooterData({ ...footerData, description: e.target.value })}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={footerData.email}
                  onChange={e => setFooterData({ ...footerData, email: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Phone Number</label>
                <input
                  type="text"
                  value={footerData.phone}
                  onChange={e => setFooterData({ ...footerData, phone: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>WhatsApp Number</label>
                <input
                  type="text"
                  value={footerData.whatsapp}
                  onChange={e => setFooterData({ ...footerData, whatsapp: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Address</label>
                <input
                  type="text"
                  value={footerData.address}
                  onChange={e => setFooterData({ ...footerData, address: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Copyright Text</label>
              <input
                type="text"
                value={footerData.copyright}
                onChange={e => setFooterData({ ...footerData, copyright: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
