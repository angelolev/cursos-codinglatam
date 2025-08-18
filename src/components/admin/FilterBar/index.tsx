interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  premiumFilter: "all" | "premium" | "free";
  onPremiumFilterChange: (filter: "all" | "premium" | "free") => void;
  subscriptionFilter: "all" | "active" | "cancelled" | "expired";
  onSubscriptionFilterChange: (
    filter: "all" | "active" | "cancelled" | "expired"
  ) => void;
  dateFilter: "all" | "week" | "month" | "quarter" | "year";
  onDateFilterChange: (
    filter: "all" | "week" | "month" | "quarter" | "year"
  ) => void;
  onResetFilters: () => void;
  totalFilteredUsers: number;
  totalUsers: number;
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  premiumFilter,
  onPremiumFilterChange,
  subscriptionFilter,
  onSubscriptionFilterChange,
  dateFilter,
  onDateFilterChange,
  onResetFilters,
  totalFilteredUsers,
  totalUsers,
}: FilterBarProps) {
  const hasActiveFilters =
    searchTerm !== "" ||
    premiumFilter !== "all" ||
    subscriptionFilter !== "all" ||
    dateFilter !== "all";

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Buscar usuarios
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por nombre o email..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-2/3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado de suscripción
            </label>
            <select
              value={premiumFilter}
              onChange={(e) =>
                onPremiumFilterChange(
                  e.target.value as "all" | "premium" | "free"
                )
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="premium">Solo Premium</option>
              <option value="free">Solo Free</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado de suscripción
            </label>
            <select
              value={subscriptionFilter}
              onChange={(e) =>
                onSubscriptionFilterChange(
                  e.target.value as "all" | "active" | "cancelled" | "expired"
                )
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="active">Activo</option>
              <option value="cancelled">Cancelado</option>
              <option value="expired">Expirado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periodo de registro
            </label>
            <select
              value={dateFilter}
              onChange={(e) =>
                onDateFilterChange(
                  e.target.value as
                    | "all"
                    | "week"
                    | "month"
                    | "quarter"
                    | "year"
                )
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="quarter">Último trimestre</option>
              <option value="year">Último año</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Mostrando{" "}
            <span className="font-semibold text-gray-900">
              {totalFilteredUsers}
            </span>{" "}
            de <span className="font-semibold text-gray-900">{totalUsers}</span>{" "}
            usuarios
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Reiniciar filtros
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Buscar: {searchTerm}
              </span>
            )}
            {premiumFilter !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {premiumFilter === "premium"
                  ? "Usuarios Premium"
                  : "Usuarios Free"}
              </span>
            )}
            {subscriptionFilter !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {subscriptionFilter} suscripciones
              </span>
            )}
            {dateFilter !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {dateFilter === "week"
                  ? "Última semana"
                  : dateFilter === "month"
                  ? "Último mes"
                  : dateFilter === "quarter"
                  ? "Último trimestre"
                  : "Último año"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
