"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import DOMPurify from 'dompurify';

interface BannerConfig {
  message: string;
  isActive: boolean;
}

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [bannerConfig, setBannerConfig] = useState<BannerConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const response = await fetch("/api/admin/banner");
        const data = await response.json();
        setBannerConfig(data.banner);
      } catch (error) {
        console.error("Failed to fetch banner:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBanner();
  }, []);

  // Don't render if:
  // - Still loading
  // - Banner not active in Firestore
  // - User dismissed it in this session
  // - No message configured
  if (
    loading ||
    !bannerConfig?.isActive ||
    !isVisible ||
    !bannerConfig?.message
  ) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-rose-200 to-purple-200 text-gray-800 py-3 sticky top-16 z-40 shadow-sm w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center px-4">
        <div className="flex-1">
          <div
            className="text-sm leading-6 md:text-base font-medium"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(bannerConfig.message, {
                ALLOWED_TAGS: ['p', 'strong', 'em', 'b', 'i', 'span'],
                ALLOWED_ATTR: []
              })
            }}
          />
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
