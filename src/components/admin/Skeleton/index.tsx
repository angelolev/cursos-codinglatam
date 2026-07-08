import { ui } from "@/components/admin/ui";

export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-8 w-16 rounded bg-white/10" />
            <div className="h-3 w-32 rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className={ui.card}>
      <div className="animate-pulse">
        <div className="border-b border-white/10 bg-white/[0.02] px-6 py-4">
          <div className="h-3 w-1/3 rounded bg-white/10" />
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-white/5 px-6 py-4"
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/4 rounded bg-white/10" />
              <div className="h-3 w-1/3 rounded bg-white/5" />
            </div>
            <div className="h-5 w-16 rounded-full bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton de una tab completa mientras carga su primer fetch.
export default function TabSkeleton({ withMetrics = false }: { withMetrics?: boolean }) {
  return (
    <div aria-busy="true" aria-live="polite">
      {withMetrics && <MetricsSkeleton />}
      <TableSkeleton />
    </div>
  );
}
