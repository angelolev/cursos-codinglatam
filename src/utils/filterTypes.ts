export type FilterValue = string;

export interface FilterButton {
  value: FilterValue;
  label: string;
  icon?: string; // Icon name as string for easier configuration
  colorClass: {
    active: string;
    inactive: string;
  };
}

export interface FilterConfig {
  buttons: FilterButton[];
  defaultValue: FilterValue;
}

// Common filter configurations
export const FREE_PREMIUM_FILTER_CONFIG: FilterConfig = {
  defaultValue: "all",
  buttons: [
    {
      value: "all",
      label: "Todos",
      colorClass: {
        active: "bg-indigo-600 text-white",
        inactive: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
      },
    },
    {
      value: "free",
      label: "Gratis",
      icon: "gift",
      colorClass: {
        active: "bg-green-600 text-white",
        inactive: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
      },
    },
    {
      value: "premium",
      label: "Pro",
      icon: "crown",
      colorClass: {
        active: "bg-indigo-600 text-white",
        inactive: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
      },
    },
  ],
};

export const COURSE_AVAILABILITY_FILTER_CONFIG: FilterConfig = {
  defaultValue: "all",
  buttons: [
    {
      value: "all",
      label: "Todos",
      colorClass: {
        active: "bg-indigo-600 text-white",
        inactive: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
      },
    },
    {
      value: "available",
      label: "Disponible",
      colorClass: {
        active: "bg-green-600 text-white",
        inactive: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
      },
    },
    {
      value: "coming_soon",
      label: "Próximamente",
      colorClass: {
        active: "bg-red-600 text-white",
        inactive: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
      },
    },
  ],
};