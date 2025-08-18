"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ClientProductCard } from "@/components/ProductCard/ClientProductCard";
import { ProductProps } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsInfiniteScrollProps {
  initialProducts: ProductProps[];
}

export function ProductsInfiniteScroll({
  initialProducts,
}: ProductsInfiniteScrollProps) {
  const [products, setProducts] = useState<ProductProps[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/products?offset=${products.length}&limit=6`
      );
      const data = await response.json();

      if (data.products && data.products.length > 0) {
        setProducts((prev) => [...prev, ...data.products]);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [products.length, loading, hasMore]);

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      const cardWidth = 290 + 24; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 2,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      const cardWidth = 290 + 24; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 2,
        behavior: "smooth",
      });
    }
  }, []);

  const updateScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreProducts, hasMore, loading]);

  // Track scroll position to update button states
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Initial check
      updateScrollButtons();

      container.addEventListener("scroll", updateScrollButtons);
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [updateScrollButtons]);

  // Update scroll buttons when products change
  useEffect(() => {
    updateScrollButtons();
  }, [products, updateScrollButtons]);

  return (
    <div className="relative">
      {/* Mobile: Responsive grid */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((product, index) => (
            <div key={product.id || index} className="flex justify-center">
              <ClientProductCard {...product} />
            </div>
          ))}

          {/* Loading placeholder */}
          {loading && (
            <div className="flex justify-center">
              <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse w-full max-w-[290px]">
                <div className="h-48 w-full bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid indicator */}
        <div className="flex justify-center mt-6">
          <div className="text-sm text-white/60">
            {products.length} guías
            {hasMore && " (más contenido se carga automáticamente)"}
          </div>
        </div>
      </div>

      {/* Tablet and Desktop (MD and up): Horizontal scroll */}
      <div className="hidden md:block">
        <div className="relative overflow-hidden">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? "bg-white hover:bg-gray-50 text-gray-700 hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? "bg-white hover:bg-gray-50 text-gray-700 hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide md:px-8 lg:px-16"
          >
            {products.map((product, index) => (
              <div key={product.id || index} className="flex-none snap-start">
                <ClientProductCard {...product} />
              </div>
            ))}

            {/* Loading placeholder */}
            {loading && (
              <div className="flex-none">
                <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse w-full max-w-[290px]">
                  <div className="h-48 w-full bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal scroll indicator */}
        {/* <div className="flex justify-center mt-6">
          <div className="text-sm text-white/60">
            {products.length} guías
            {hasMore && " (desliza horizontalmente para ver más)"}
          </div>
        </div> */}
      </div>

      {/* Intersection observer target */}
      <div ref={observerRef} className="w-full h-4 absolute -bottom-4 left-0" />

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
