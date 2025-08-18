"use client";
import { useState } from "react";
import { ClientWorkshopCard } from "@/components/WorkshopCard/ClientWorkshopCard";
import SearchInput from "@/components/filters/SearchInput";
import FilterButtons from "@/components/filters/FilterButtons";
import { WorkshopProps } from "@/types/workshop";
import { FREE_PREMIUM_FILTER_CONFIG } from "@/utils/filterTypes";
import {
  applyFilters,
  filterBySearch,
  filterByFreePremium,
} from "@/utils/filterHelpers";

interface WorkshopsClientProps {
  workshops: WorkshopProps[];
}

export default function WorkshopsClient({ workshops }: WorkshopsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(
    FREE_PREMIUM_FILTER_CONFIG.defaultValue
  );

  // Filter workshops using the helper functions
  const filteredWorkshops = applyFilters(
    workshops,
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
          placeholder="Buscar workshops..."
        />

        {/* Filter Buttons */}
        <FilterButtons
          config={FREE_PREMIUM_FILTER_CONFIG}
          value={filterType}
          onChange={setFilterType}
        />
      </div>

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWorkshops.length > 0 ? (
          filteredWorkshops.map((workshop, index) => (
            <ClientWorkshopCard key={index} {...workshop} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-white/60">
              No se encontraron workshops que coincidan con los filtros
              seleccionados.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
