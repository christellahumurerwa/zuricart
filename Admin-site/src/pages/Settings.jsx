import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Layout, AlignLeft, Link as LinkIcon, Image } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const TABS = ['header', 'footer_branding', 'footer_categories', 'footer_links'];
const TAB_LABELS = {
  header: '🔝 Header & Logo',
  footer_branding: '🏷 Footer Branding',
  footer_categories: '📂 Footer Categories',
  footer_links: '🔗 Footer Quick Links',
};

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
  const [logoUrl, setLogoUrl] = useState('');

  // Footer Branding
  const [footerBranding, setFooterBranding] = useState({
    tagline: 'Premium baby essentials, thoughtfully sourced for your little one.',
    about: 'ZURI CART is Rwanda\'s premium online baby shop. We source quality products internationally to bring you the best for your baby\'s journey.',
    email: 'christellahumurerwa5@gmail.com',
    phone: '+250783018853',
    whatsapp: '+250792876203',
    address: 'Kigali, Rwanda',
    copyright: '© 2026 ZURI CART. All rights reserved.',
    instagram: '',
  });

  // Footer Categories
  const [footerCategories, setFooterCategories] = useState([
    { label: 'Clothes', url: '/catalog?category=Clothes' },
    { label: 'Shoes', url: '/catalog?category=Shoes' },
    { label: 'Toys', url: '/catalog?category=Toys' },
    { label: 'Equipment', url: '/catalog?category=Equipment' },
    { label: 'Pampers', url: '/catalog?category=Pampers' },
    { label: 'Suitcases', url: '/catalog?category=Suitcases' },
  ]);
  const [newCat, setNewCat] = useState({ label: '', url: '' });

  // Footer Quick Links
  const [quickLinks, setQuickLinks] = useState([
    { label: 'Home', url: '/' },
    { label: 'My Cart', url: '/cart' },
    { label: 'Log In', url: '/login' },
    { label: 'Sign Up', url: '/signup' },
  ]);
  const [newQuickLink, setNewQuickLink] = useState({ label: '', url: '' });

  // Load from Firestore
  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'siteSettings', 'config'));
        if (snap.exists()) {
          const data = snap.data();
          if (data.navLinks) setNavLinks(data.navLinks);
          if (data.logoUrl !== undefined) setLogoUrl(data.logoUrl);
          if (data.footerBranding) setFooterBranding(prev => ({ ...prev, ...data.footerBranding }));
          if (data.footerCategories) setFooterCategories(data.footerCategories);
          if (data.quickLinks) setQuickLinks(data.quickLinks);
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
        logoUrl,
        footerBranding,
        footerCategories,
        quickLinks,
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

  const tabBtn = (tab) => ({
    padding: '9px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.82rem',
    background: activeTab === tab ? '#000' : '#f5f5f5',
    color: activeTab === tab ? '#fff' : '#666',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  });

  const RowItem = ({ label, url, onRemove }) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      background: '#f9f9f9', padding: '10px 16px', borderRadius: '10px', border: '1px solid #efefef'
    }}>
      <LinkIcon size={14} color="#999" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: '0.9rem' }}>{label}</strong>
        <span style={{ color: '#999', marginLeft: '12px', fontSize: '0.82rem' }}>{url}</span>
      </div>
      {onRemove && (
        <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545' }}>
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );

  const AddRow = ({ value, onChange, onAdd, placeholderLabel, placeholderUrl }) => (
    <div style={{ background: '#f9f9f9', padding: '1.25rem', borderRadius: '12px', border: '1px dashed #ccc', marginTop: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.82rem' }}>Label</label>
          <input type="text" placeholder={placeholderLabel} value={value.label} onChange={e => onChange({ ...value, label: e.target.value })} />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.82rem' }}>URL</label>
          <input type="text" placeholder={placeholderUrl} value={value.url} onChange={e => onChange({ ...value, url: e.target.value })} />
        </div>
        <button onClick={onAdd} className="btn btn-primary" style={{ padding: '10px 16px' }}><Plus size={16} /></button>
      </div>
    </div>
  );

  return (
    <div className="settings-page" style={{ maxWidth: '860px' }}>
      <div className="page-header">
        <h1 className="page-title">Site Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={18} />
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '10px', marginBottom: '1.5rem', fontWeight: 600 }}>
          ✓ Settings saved! Changes reflect on the public site immediately.
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button key={tab} style={tabBtn(tab)} onClick={() => setActiveTab(tab)}>{TAB_LABELS[tab]}</button>
        ))}
      </div>

      {/* ── HEADER TAB ── */}
      {activeTab === 'header' && (
        <div className="data-card" style={{ padding: '2rem' }}>
          {/* Logo */}
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Store Logo</h3>
          <p style={{ color: '#999', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
            Enter a direct image URL for the logo shown in the top-left of the store. Leave blank to use the ZURI CART text brand.
          </p>
          <div className="form-group" style={{ margin: 0, marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Image size={14} /> Logo Image URL</label>
            <input type="text" placeholder="https://example.com/logo.png or /images/logo.jpg" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
            {logoUrl && <img src={logoUrl} alt="Logo preview" style={{ marginTop: '10px', height: '40px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #eee' }} onError={e => e.target.style.display = 'none'} />}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', marginBottom: '2rem' }} />

          {/* Nav Links */}
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Navigation Links</h3>
          <p style={{ color: '#999', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
            These appear in the top navigation bar of the store. Default links cannot be removed.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.5rem' }}>
            {navLinks.map((link, idx) => (
              <RowItem key={idx} label={link.label} url={link.url}
                onRemove={link.isDefault ? null : () => setNavLinks(navLinks.filter((_, i) => i !== idx))}
              />
            ))}
          </div>
          <AddRow
            value={newLink} onChange={setNewLink}
            placeholderLabel="Ex: New Arrivals" placeholderUrl="/catalog?category=New"
            onAdd={() => {
              if (!newLink.label || !newLink.url) return;
              setNavLinks([...navLinks, { ...newLink, isDefault: false }]);
              setNewLink({ label: '', url: '' });
            }}
          />
        </div>
      )}

      {/* ── FOOTER BRANDING TAB ── */}
      {activeTab === 'footer_branding' && (
        <div className="data-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Brand & Contact Info</h3>
          <p style={{ color: '#999', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Displayed in the footer across all pages of the public store.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Store Tagline (short description)</label>
              <input type="text" value={footerBranding.tagline} onChange={e => setFooterBranding({ ...footerBranding, tagline: e.target.value })} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>About Zuri Cart (longer description)</label>
              <textarea rows={3} value={footerBranding.about} onChange={e => setFooterBranding({ ...footerBranding, about: e.target.value })} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Email</label>
                <input type="email" value={footerBranding.email} onChange={e => setFooterBranding({ ...footerBranding, email: e.target.value })} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Phone</label>
                <input type="text" value={footerBranding.phone} onChange={e => setFooterBranding({ ...footerBranding, phone: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>WhatsApp Number</label>
                <input type="text" value={footerBranding.whatsapp} onChange={e => setFooterBranding({ ...footerBranding, whatsapp: e.target.value })} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Instagram Handle</label>
                <input type="text" placeholder="@zuricart" value={footerBranding.instagram} onChange={e => setFooterBranding({ ...footerBranding, instagram: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Address</label>
                <input type="text" value={footerBranding.address} onChange={e => setFooterBranding({ ...footerBranding, address: e.target.value })} />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Copyright Text</label>
                <input type="text" value={footerBranding.copyright} onChange={e => setFooterBranding({ ...footerBranding, copyright: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER CATEGORIES TAB ── */}
      {activeTab === 'footer_categories' && (
        <div className="data-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Footer Category Links</h3>
          <p style={{ color: '#999', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Displayed in the "Categories" column of the footer.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {footerCategories.map((cat, i) => (
              <RowItem key={i} label={cat.label} url={cat.url}
                onRemove={() => setFooterCategories(footerCategories.filter((_, idx) => idx !== i))}
              />
            ))}
          </div>
          <AddRow
            value={newCat} onChange={setNewCat}
            placeholderLabel="Ex: New Arrivals" placeholderUrl="/catalog?category=New"
            onAdd={() => {
              if (!newCat.label || !newCat.url) return;
              setFooterCategories([...footerCategories, newCat]);
              setNewCat({ label: '', url: '' });
            }}
          />
        </div>
      )}

      {/* ── FOOTER QUICK LINKS TAB ── */}
      {activeTab === 'footer_links' && (
        <div className="data-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Footer Quick Links</h3>
          <p style={{ color: '#999', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Displayed in the "Quick Links" column of the footer.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {quickLinks.map((lnk, i) => (
              <RowItem key={i} label={lnk.label} url={lnk.url}
                onRemove={() => setQuickLinks(quickLinks.filter((_, idx) => idx !== i))}
              />
            ))}
          </div>
          <AddRow
            value={newQuickLink} onChange={setNewQuickLink}
            placeholderLabel="Ex: About Us" placeholderUrl="/about"
            onAdd={() => {
              if (!newQuickLink.label || !newQuickLink.url) return;
              setQuickLinks([...quickLinks, newQuickLink]);
              setNewQuickLink({ label: '', url: '' });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Settings;
