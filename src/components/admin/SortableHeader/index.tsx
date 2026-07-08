import { SortField, SortDirection } from "@/types/admin";
import { ui } from "@/components/admin/ui";

interface SortableHeaderProps {
  label: string;
  field: SortField;
  sortConfig: { field: SortField; direction: SortDirection };
  onSort: (field: SortField) => void;
}

export default function SortableHeader({
  label,
  field,
  sortConfig,
  onSort,
}: SortableHeaderProps) {
  const isActive = sortConfig.field === field;

  return (
    <th
      scope="col"
      aria-sort={
        isActive
          ? sortConfig.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
      className={ui.thSortable}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        {/* Chevron siempre visible (atenuado si inactivo) para que se note que la columna es ordenable */}
        <svg
          className={`w-3 h-3 transition-all ${
            isActive
              ? sortConfig.direction === "asc"
                ? "rotate-180"
                : ""
              : "opacity-30"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.5-4.25a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </th>
  );
}
