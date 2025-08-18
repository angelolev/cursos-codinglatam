"use client";
import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function CurrencySelector() {
  const { currentCurrency, supportedCurrencies, setCurrency, isLoading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-white/60">
        <Globe className="h-4 w-4 animate-pulse" />
        <span className="text-sm">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors"
      >
        <span className="text-sm">{currentCurrency.flag}</span>
        <span className="text-sm font-medium">{currentCurrency.code}</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
              Seleccionar moneda
            </div>
            <div className="max-h-60 overflow-y-auto">
              {supportedCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setCurrency(currency.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                    currentCurrency.code === currency.code
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{currency.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-xs text-gray-500">{currency.name}</div>
                  </div>
                  {currentCurrency.code === currency.code && (
                    <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
            <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200 mt-2">
              Los pagos se procesan en USD
            </div>
          </div>
        </>
      )}
    </div>
  );
}