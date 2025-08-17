"use client";
import { useState } from "react";
import { ClientProductCard } from "@/components/ProductCard/ClientProductCard";
import SearchInput from "@/components/filters/SearchInput";
import FilterButtons from "@/components/filters/FilterButtons";
import { ProductProps } from "@/types/product";
import { FREE_PREMIUM_FILTER_CONFIG } from "@/utils/filterTypes";
import {
  applyFilters,
  filterBySearch,
  filterByFreePremium,
} from "@/utils/filterHelpers";
import Link from "next/link";

interface GuiasClientProps {
  products: ProductProps[];
}

export default function GuiasClient({ products }: GuiasClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(
    FREE_PREMIUM_FILTER_CONFIG.defaultValue
  );

  // Filter products using the helper functions
  const filteredProducts = applyFilters(
    products,
    searchTerm,
    filterType,
    filterBySearch,
    filterByFreePremium
  );

  return (
    <>
      {/* Search and Filter Section */}
      <div className="mb-16 space-y-4">
        {/* Search Bar */}
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar guías..."
        />

        {/* Filter Buttons */}
        <FilterButtons
          config={FREE_PREMIUM_FILTER_CONFIG}
          value={filterType}
          onChange={setFilterType}
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ClientProductCard key={index} {...product} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-white/60">
              No se encontraron guías que coincidan con los filtros
              seleccionados.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
