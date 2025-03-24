// Add the RATES object (you might want to move this to a shared constants file)
export const RATES = {
  USD: 1,
  PEN: 3.7,
  MXN: 16.75,
  CLP: 987,
  COP: 3950,
} as const;

export type CurrencyType = keyof typeof RATES;

// Format price function
export const formatPrice = (price: number, currency: CurrencyType) => {
  const value = Math.round(price * RATES[currency]);
  const symbols = {
    USD: "$",
    PEN: "S/",
    MXN: "$",
    CLP: "$",
    COP: "$",
  };

  const formatted = new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);

  return `${symbols[currency]}${formatted}${
    ["MXN", "CLP", "COP"].includes(currency) ? ` ${currency}` : ""
  }`;
};
