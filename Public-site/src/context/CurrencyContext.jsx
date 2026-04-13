import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

const CACHE_KEY = 'zuricart_currency_data';
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [rate, setRate] = useState(1);
  const [symbol, setSymbol] = useState('$');
  const [isLoading, setIsLoading] = useState(true);

  const fetchExchangeRate = async (targetCurrency) => {
    try {
      if (targetCurrency === 'USD') return 1;
      // Using open.er-api.com for better coverage of African currencies (RWF, KES, etc.)
      const res = await fetch(`https://open.er-api.com/v6/latest/USD`);
      const data = await res.json();
      if (data.result === 'success') {
        const newRate = data.rates[targetCurrency] || 1;
        return newRate;
      }
      return 1;
    } catch (err) {
      console.error('Exchange rate fetch failed:', err);
      return 1;
    }
  };

  const detectAndSetCurrency = async (forceRefresh = false) => {
    setIsLoading(true);
    
    // Check cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached && !forceRefresh) {
      const { currency: c, rate: r, symbol: s, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < WEEK_IN_MS) {
        setCurrency(c);
        setRate(r);
        setSymbol(s);
        setIsLoading(false);
        return;
      }
    }

    try {
      // 1. Detect Location/Currency via IP
      const geoRes = await fetch('https://ipapi.co/json/');
      const geoData = await geoRes.json();
      const detectedCurrency = geoData.currency || 'USD';
      
      // 2. Fetch Rate
      const newRate = await fetchExchangeRate(detectedCurrency);
      
      // 3. Determine Symbol
      const newSymbol = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: detectedCurrency,
      }).format(0).replace(/[0-9\s.,]/g, '');

      const newData = {
        currency: detectedCurrency,
        rate: newRate,
        symbol: newSymbol || detectedCurrency,
        timestamp: Date.now()
      };

      setCurrency(newData.currency);
      setRate(newData.rate);
      setSymbol(newData.symbol);
      localStorage.setItem(CACHE_KEY, JSON.stringify(newData));

    } catch (err) {
      console.error('Auto-detection failed, defaulting to USD:', err);
      setCurrency('USD');
      setRate(1);
      setSymbol('$');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    detectAndSetCurrency();
  }, []);

  const changeCurrency = async (newCode) => {
    setIsLoading(true);
    const newRate = await fetchExchangeRate(newCode);
    
    const newSymbol = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: newCode,
    }).format(0).replace(/[0-9\s.,]/g, '');

    const newData = {
      currency: newCode,
      rate: newRate,
      symbol: newSymbol || newCode,
      timestamp: Date.now()
    };

    setCurrency(newData.currency);
    setRate(newData.rate);
    setSymbol(newData.symbol);
    localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
    setIsLoading(false);
  };

  const formatPrice = (usdAmount) => {
    if (!usdAmount && usdAmount !== 0) return '';
    const converted = usdAmount * rate;
    
    if (currency === 'RWF') {
      return `${Math.round(converted).toLocaleString()} ${symbol}`;
    }

    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      rate, 
      symbol, 
      formatPrice, 
      isLoading, 
      changeCurrency,
      refreshRate: () => detectAndSetCurrency(true)
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
