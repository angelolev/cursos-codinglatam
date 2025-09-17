"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-400 text-white py-3 px-4 sticky top-16 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <div className="flex-1">
          <p className="text-sm md:text-base font-medium">
            🎉 <span className="font-bold">Semana de Promoción</span> - Usa el código{" "}
            <span className="bg-slate-800 px-2 py-1 rounded-md font-bold text-primary-200 border border-primary-200/20">
              CLAUDE
            </span>{" "}
            y obtén <span className="font-bold">20% de descuento</span> en todos los planes
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-black/20 rounded-full transition-colors"
          aria-label="Cerrar banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}