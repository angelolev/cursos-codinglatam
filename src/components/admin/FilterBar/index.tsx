import { ui, badge } from "@/components/admin/ui";

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
    <div className={`${ui.cardPadded} mb-6`}>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className={ui.label}>
            Buscar usuarios
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-zinc-500"
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
              className={`${ui.input} pl-10`}
              placeholder="Buscar por nombre o email..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-2/3">
          <div>
            <label className={ui.label}>Tipo de usuario</label>
            <select
              value={premiumFilter}
              onChange={(e) =>
                onPremiumFilterChange(
                  e.target.value as "all" | "premium" | "free"
                )
              }
              className={ui.select}
            >
              <option value="all">Todos</option>
              <option value="premium">Solo Premium</option>
              <option value="free">Solo Free</option>
            </select>
          </div>

          <div>
            <label className={ui.label}>Estado de suscripción</label>
            <select
              value={subscriptionFilter}
              onChange={(e) =>
                onSubscriptionFilterChange(
                  e.target.value as "all" | "active" | "cancelled" | "expired"
                )
              }
              className={ui.select}
            >
              <option value="all">Todos</option>
              <option value="active">Activo</option>
              <option value="cancelled">Cancelado</option>
              <option value="expired">Expirado</option>
            </select>
          </div>

          <div>
            <label className={ui.label}>Periodo de registro</label>
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
              className={ui.select}
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

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-zinc-500">
            Mostrando{" "}
            <span className="font-semibold tabular-nums text-zinc-200">
              {totalFilteredUsers}
            </span>{" "}
            de{" "}
            <span className="font-semibold tabular-nums text-zinc-200">
              {totalUsers}
            </span>{" "}
            usuarios
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
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
              <span className={badge("blue")}>Buscar: {searchTerm}</span>
            )}
            {premiumFilter !== "all" && (
              <span className={badge("emerald")}>
                {premiumFilter === "premium"
                  ? "Usuarios Premium"
                  : "Usuarios Free"}
              </span>
            )}
            {subscriptionFilter !== "all" && (
              <span className={badge("indigo")}>
                {subscriptionFilter} suscripciones
              </span>
            )}
            {dateFilter !== "all" && (
              <span className={badge("amber")}>
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
