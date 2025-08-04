export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRates {
  [key: string]: number;
}

export interface CurrencyDetectionResult {
  currency: string;
  country: string;
}

export interface ConvertedPrice {
  original: number;
  converted: number;
  currency: Currency;
  rate: number;
}

export const SUPPORTED_CURRENCIES: Record<string, Currency> = {
  USD: { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', flag: '🇺🇸' },
  MXN: { code: 'MXN', name: 'Peso Mexicano', symbol: '$', flag: '🇲🇽' },
  BRL: { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', flag: '🇧🇷' },
  ARS: { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
  CLP: { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
  COP: { code: 'COP', name: 'Peso Colombiano', symbol: '$', flag: '🇨🇴' },
  PEN: { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', flag: '🇵🇪' },
  UYU: { code: 'UYU', name: 'Peso Uruguayo', symbol: '$', flag: '🇺🇾' },
  BOB: { code: 'BOB', name: 'Boliviano', symbol: 'Bs', flag: '🇧🇴' },
  PYG: { code: 'PYG', name: 'Guaraní Paraguayo', symbol: '₲', flag: '🇵🇾' },
};

export const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // North America
  'US': 'USD',
  'MX': 'MXN',
  
  // South America
  'BR': 'BRL',
  'AR': 'ARS',
  'CL': 'CLP',
  'CO': 'COP',
  'PE': 'PEN',
  'UY': 'UYU',
  'BO': 'BOB',
  'PY': 'PYG',
  'VE': 'USD', // Venezuela often uses USD due to economic situation
  'EC': 'USD', // Ecuador uses USD as official currency
  'GY': 'USD', // Guyana (fallback to USD)
  'SR': 'USD', // Suriname (fallback to USD)
  'GF': 'USD', // French Guiana (fallback to USD)
  
  // Other countries default to USD
};