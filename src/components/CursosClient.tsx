"use client";
import { useState } from "react";
import { ClientCourseCard } from "@/components/CourseCard/ClientCourseCard";
import SearchInput from "@/components/filters/SearchInput";
import FilterButtons from "@/components/filters/FilterButtons";
import { CourseProps } from "@/types/course";
import { COURSE_AVAILABILITY_FILTER_CONFIG } from "@/utils/filterTypes";
import {
  applyFilters,
  filterBySearch,
  filterByAvailability,
} from "@/utils/filterHelpers";

interface CursosClientProps {
  courses: CourseProps[];
}

export default function CursosClient({ courses }: CursosClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState(
    COURSE_AVAILABILITY_FILTER_CONFIG.defaultValue
  );

  // Filter courses using the helper functions
  const filteredCourses = applyFilters(
    courses,
    searchTerm,
    courseFilter,
    filterBySearch,
    filterByAvailability
  );

  const hasResults = filteredCourses.length > 0;

  return (
    <>
      {/* Search and Filter Section */}
      <div className="mb-16 space-y-4">
        {/* Search Bar */}
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Buscar cursos..."
        />

        {/* Course Filter Buttons */}
        <FilterButtons
          config={COURSE_AVAILABILITY_FILTER_CONFIG}
          value={courseFilter}
          onChange={setCourseFilter}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hasResults ? (
          <>
            {filteredCourses.map((course, index) => (
              <ClientCourseCard key={`course-${index}`} {...course} />
            ))}
          </>
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-white/60">
              No se encontraron resultados que coincidan con los filtros
              seleccionados.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
