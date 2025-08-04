"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ClientProductCard } from "@/components/ProductCard/ClientProductCard";
import { ProductProps } from "@/types/product";

interface ProductsInfiniteScrollProps {
  initialProducts: ProductProps[];
}

export function ProductsInfiniteScroll({
  initialProducts,
}: ProductsInfiniteScrollProps) {
  const [products, setProducts] = useState<ProductProps[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative">
      {/* Horizontal scrolling container */}
      <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
        {products.map((product, index) => (
          <div key={product.id || index} className="flex-none snap-start">
            <ClientProductCard {...product} />
          </div>
        ))}

        {/* Loading placeholder */}
        {loading && (
          <div className="flex-none">
            <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse md:max-w-[320px]">
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

      {/* Intersection observer target */}
      <div ref={observerRef} className="w-full h-4 absolute -bottom-4 left-0" />

      {/* Scroll indicators */}
      <div className="flex justify-center mt-6 gap-2">
        <div className="text-sm text-white/60">
          {products.length} de {products.length} guías
          {hasMore && " (desliza para ver más)"}
        </div>
      </div>

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
