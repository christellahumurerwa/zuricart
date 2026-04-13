import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RWF' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
];

const CurrencySelector = () => {
  const { currency, changeCurrency, isLoading } = useCurrency();

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <select 
        value={currency} 
        onChange={(e) => changeCurrency(e.target.value)}
        disabled={isLoading}
        style={{
          background: '#f5f5f5',
          border: '1px solid #eee',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
          appearance: 'none',
          textAlign: 'center'
        }}
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code}>
            {c.code} {c.symbol}
          </option>
        ))}
      </select>
      {isLoading && <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#999' }}>...</span>}
    </div>
  );
};

export default CurrencySelector;
