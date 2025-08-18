import { 
  SUPPORTED_CURRENCIES, 
  COUNTRY_TO_CURRENCY, 
  Currency, 
  ExchangeRates,
  CurrencyDetectionResult,
  ConvertedPrice 
} from '@/types/currency';

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds
const EXCHANGE_RATES_CACHE_KEY = 'exchange_rates';
const CURRENCY_PREFERENCE_KEY = 'currency_preference';
const LAST_FETCH_KEY = 'last_exchange_rates_fetch';

interface CachedRates {
  rates: ExchangeRates;
  timestamp: number;
}

export async function detectUserCurrency(): Promise<string> {
  // Check user preference first
  const savedPreference = localStorage.getItem(CURRENCY_PREFERENCE_KEY);
  if (savedPreference && SUPPORTED_CURRENCIES[savedPreference]) {
    return savedPreference;
  }

  try {
    // Use ipapi.co for free IP geolocation
    const response = await fetch('https://ipapi.co/json/');
    const data: CurrencyDetectionResult = await response.json();
    
    const currency = COUNTRY_TO_CURRENCY[data.country] || 'USD';
    
    // Only return if we support this currency
    if (SUPPORTED_CURRENCIES[currency]) {
      return currency;
    }
  } catch (error) {
    console.warn('Failed to detect user currency:', error);
  }
  
  // Fallback to USD
  return 'USD';
}

export async function getExchangeRates(): Promise<ExchangeRates> {
  // Check cache first
  const cached = getCachedRates();
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.rates;
  }

  try {
    // Use exchangerate-api.com for free exchange rates
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    const rates: ExchangeRates = data.rates;
    
    // Cache the results
    setCachedRates(rates);
    
    return rates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates:', error);
    
    // Return cached rates if available, even if expired
    if (cached) {
      return cached.rates;
    }
    
    // Fallback to 1:1 rates
    return Object.keys(SUPPORTED_CURRENCIES).reduce((acc, currency) => {
      acc[currency] = 1;
      return acc;
    }, {} as ExchangeRates);
  }
}

function getCachedRates(): CachedRates | null {
  try {
    const cached = localStorage.getItem(EXCHANGE_RATES_CACHE_KEY);
    const timestamp = localStorage.getItem(LAST_FETCH_KEY);
    
    if (cached && timestamp) {
      return {
        rates: JSON.parse(cached),
        timestamp: parseInt(timestamp)
      };
    }
  } catch (error) {
    console.warn('Failed to get cached rates:', error);
  }
  
  return null;
}

function setCachedRates(rates: ExchangeRates): void {
  try {
    localStorage.setItem(EXCHANGE_RATES_CACHE_KEY, JSON.stringify(rates));
    localStorage.setItem(LAST_FETCH_KEY, Date.now().toString());
  } catch (error) {
    console.warn('Failed to cache rates:', error);
  }
}

function smartRoundPrice(price: number, currencyCode: string): number {
  // For currencies without decimals or with very large values, round to nearest whole number
  if (currencyCode === 'PYG' || currencyCode === 'CLP') {
    return Math.round(price);
  }
  
  // For very small amounts (< 1), keep original precision
  if (price < 1) {
    return Math.round(price * 100) / 100;
  }
  
  // Get the integer and decimal parts
  const integerPart = Math.floor(price);
  const decimalPart = price - integerPart;
  
  // Apply psychological pricing rules
  if (decimalPart <= 0.25) {
    // Round down to .99 of the previous integer (unless it's already very low)
    return integerPart === 0 ? 0.99 : integerPart - 0.01;
  } else if (decimalPart <= 0.75) {
    // Round to .99
    return integerPart + 0.99;
  } else {
    // Round up to next .99
    return integerPart + 1.99;
  }
}

export function convertPrice(usdPrice: number, targetCurrency: string, rates: ExchangeRates): ConvertedPrice {
  const currency = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.USD;
  const rate = rates[targetCurrency] || 1;
  const rawConverted = usdPrice * rate;
  
  // Apply smart rounding for better psychological pricing
  const converted = targetCurrency === 'USD' ? rawConverted : smartRoundPrice(rawConverted, targetCurrency);
  
  return {
    original: usdPrice,
    converted,
    currency,
    rate
  };
}

export function formatPrice(price: number, currency: Currency, locale?: string): string {
  try {
    // Currencies that don't use decimals
    const noDecimalCurrencies = ['PYG', 'CLP'];
    const useDecimals = !noDecimalCurrencies.includes(currency.code);
    
    // Use Intl.NumberFormat for proper currency formatting
    const formatter = new Intl.NumberFormat(locale || 'es-ES', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: useDecimals ? 2 : 0,
      maximumFractionDigits: useDecimals ? 2 : 0,
    });
    
    return formatter.format(price);
  } catch {
    // Fallback formatting
    const symbol = currency.symbol;
    const noDecimalCurrencies = ['PYG', 'CLP'];
    const formattedPrice = noDecimalCurrencies.includes(currency.code)
      ? Math.round(price).toLocaleString()
      : price.toFixed(2);
    
    return `${symbol}${formattedPrice}`;
  }
}

export function saveCurrencyPreference(currency: string): void {
  if (SUPPORTED_CURRENCIES[currency]) {
    localStorage.setItem(CURRENCY_PREFERENCE_KEY, currency);
  }
}

export function getCurrencyPreference(): string | null {
  return localStorage.getItem(CURRENCY_PREFERENCE_KEY);
}