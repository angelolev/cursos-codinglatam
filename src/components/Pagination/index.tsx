"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    
    const query = params.toString();
    const url = query ? `?${query}` : "/";
    router.push(url);
  };

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Anterior
      </button>

      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            disabled={page === "..."}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              page === currentPage
                ? "bg-indigo-600 text-white"
                : page === "..."
                ? "text-gray-400 cursor-default"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
      >
        Siguiente
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}