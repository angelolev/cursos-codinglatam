"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Currency, 
  ExchangeRates, 
  ConvertedPrice, 
  SUPPORTED_CURRENCIES 
} from '@/types/currency';
import { 
  detectUserCurrency, 
  getExchangeRates, 
  convertPrice, 
  formatPrice,
  saveCurrencyPreference 
} from '@/utils/currency';

interface CurrencyContextType {
  currentCurrency: Currency;
  exchangeRates: ExchangeRates;
  isLoading: boolean;
  error: string | null;
  convertAndFormatPrice: (usdPrice: number, locale?: string) => string;
  convertPrice: (usdPrice: number) => ConvertedPrice;
  setCurrency: (currencyCode: string) => void;
  supportedCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(SUPPORTED_CURRENCIES.USD);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supportedCurrencies = Object.values(SUPPORTED_CURRENCIES);

  useEffect(() => {
    initializeCurrency();
  }, []);

  const initializeCurrency = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Detect user currency and fetch exchange rates in parallel
      const [currencyCode, rates] = await Promise.all([
        detectUserCurrency(),
        getExchangeRates()
      ]);

      setCurrentCurrency(SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD);
      setExchangeRates(rates);
    } catch (err) {
      setError('Failed to initialize currency settings');
      console.error('Currency initialization error:', err);
      
      // Set defaults on error
      setCurrentCurrency(SUPPORTED_CURRENCIES.USD);
      setExchangeRates({});
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrency = (currencyCode: string) => {
    const currency = SUPPORTED_CURRENCIES[currencyCode];
    if (currency) {
      setCurrentCurrency(currency);
      saveCurrencyPreference(currencyCode);
    }
  };

  const convertAndFormatPrice = (usdPrice: number, locale?: string): string => {
    const converted = convertPrice(usdPrice, currentCurrency.code, exchangeRates);
    return formatPrice(converted.converted, converted.currency, locale);
  };

  const convertPriceOnly = (usdPrice: number): ConvertedPrice => {
    return convertPrice(usdPrice, currentCurrency.code, exchangeRates);
  };

  const contextValue: CurrencyContextType = {
    currentCurrency,
    exchangeRates,
    isLoading,
    error,
    convertAndFormatPrice,
    convertPrice: convertPriceOnly,
    setCurrency,
    supportedCurrencies,
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}