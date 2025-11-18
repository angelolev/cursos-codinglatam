"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-rose-200 to-purple-200 text-gray-800 py-3 sticky top-16 z-40 shadow-sm w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center px-4">
        <div className="flex-1">
          <p className="text-sm leading-6 md:text-base font-medium">
            🔥 <span className="font-bold">BLACK FRIDAY</span> - Código{" "}
            <span className="bg-indigo-100 px-2 py-1 rounded-md font-bold text-indigo-800 border border-indigo-300/50">
              BLACKFRIDAY
            </span>{" "}
            = <span className="font-bold">50% OFF</span> 🚀
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-gray-300/30 rounded-full transition-colors"
          aria-label="Cerrar banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
