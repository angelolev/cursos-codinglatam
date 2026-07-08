// Design tokens del panel de administración. Todas las superficies del admin
// comparten estas clases para mantener un solo tema (dark, acento indigo,
// badges translúcidos) en vez de estilos ad-hoc por componente.

export const ui = {
  // Superficies
  card: "rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden",
  cardPadded: "rounded-xl border border-white/10 bg-white/[0.03] p-6",

  // Tablas
  table: "min-w-full divide-y divide-white/10",
  thead: "bg-white/[0.02]",
  th: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500",
  thSortable:
    "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 cursor-pointer transition-colors hover:bg-white/5 hover:text-zinc-300",
  tbody: "divide-y divide-white/5",
  tr: "transition-colors hover:bg-white/[0.04]",
  td: "px-6 py-4 whitespace-nowrap text-sm text-zinc-300",
  tdEmpty: "px-6 py-10 text-center text-sm text-zinc-500",

  // Formularios
  label: "block text-sm font-medium text-zinc-400 mb-1.5",
  input:
    "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent",
  select:
    "w-full rounded-lg border border-white/10 bg-light-black px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent",

  // Botones
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed",
  btnGhost:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5",
  btnDanger:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed",
  btnSuccess:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed",
} as const;

export type BadgeTone =
  | "emerald"
  | "amber"
  | "red"
  | "indigo"
  | "blue"
  | "zinc";

const badgeTones: Record<BadgeTone, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  red: "bg-red-500/10 text-red-400 ring-red-500/20",
  indigo: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20",
  blue: "bg-sky-500/10 text-sky-400 ring-sky-500/20",
  zinc: "bg-white/5 text-zinc-400 ring-white/10",
};

export function badge(tone: BadgeTone): string {
  return `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeTones[tone]}`;
}
