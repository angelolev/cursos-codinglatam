"use client";
import { useEffect, useState } from "react";

// Cierre de la promoción Black Friday: lunes 30 de noviembre de 2026 a las
// 23:59:59 hora Perú (UTC-5, sin horario de verano).
export const PROMO_DEADLINE = new Date("2026-11-30T23:59:59-05:00");

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getRemaining(deadline: Date): Remaining | "expired" {
  const ms = deadline.getTime() - Date.now();
  if (ms <= 0) return "expired";
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

// El tiempo restante se calcula solo en el cliente: en el servidor (y en el
// primer render) es null para no provocar diferencias de hidratación.
function useCountdown(deadline: Date) {
  const [remaining, setRemaining] = useState<Remaining | "expired" | null>(
    null
  );

  useEffect(() => {
    const tick = () => setRemaining(getRemaining(deadline));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return remaining;
}

const pad = (n: number) => String(n).padStart(2, "0");

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

function srLabel(r: Remaining) {
  return `La promoción termina en ${plural(r.days, "día", "días")}, ${plural(r.hours, "hora", "horas")} y ${plural(r.minutes, "minuto", "minutos")}`;
}

/**
 * Cuenta regresiva de la promoción.
 * - `full`: cajas con días, horas, minutos y segundos (hero y bloque de precio).
 * - `compact`: una línea "5d 12h 30m 10s" (sidebar y barra fija de mobile).
 * Cuando la promoción termina, no se muestra nada.
 */
export function Countdown({
  variant = "full",
  label = "La promo termina en",
  className = "",
}: {
  variant?: "full" | "compact";
  label?: string;
  className?: string;
}) {
  const remaining = useCountdown(PROMO_DEADLINE);

  if (remaining === "expired") return null;

  if (variant === "compact") {
    return (
      <span role="timer" className={`tabular-nums ${className}`}>
        {remaining ? (
          <>
            <span className="sr-only">{srLabel(remaining)}</span>
            <span aria-hidden>
              {label} {remaining.days}d {pad(remaining.hours)}h{" "}
              {pad(remaining.minutes)}m {pad(remaining.seconds)}s
            </span>
          </>
        ) : (
          // Mismo ancho aproximado mientras carga, para evitar saltos.
          <span aria-hidden className="invisible">
            {label} 0d 00h 00m 00s
          </span>
        )}
      </span>
    );
  }

  const units = [
    { value: remaining ? String(remaining.days) : "0", label: "días" },
    { value: remaining ? pad(remaining.hours) : "00", label: "horas" },
    { value: remaining ? pad(remaining.minutes) : "00", label: "min" },
    { value: remaining ? pad(remaining.seconds) : "00", label: "seg" },
  ];

  return (
    <div
      role="timer"
      className={`${remaining ? "" : "invisible"} ${className}`}
    >
      {remaining && <span className="sr-only">{srLabel(remaining)}</span>}
      <p
        aria-hidden
        className="mb-2.5 text-xs font-semibold uppercase tracking-[0.08em] md:tracking-[0.2em] text-primary-400"
      >
        {label}
      </p>
      <div aria-hidden className="flex items-start justify-center gap-2 sm:gap-3">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-start gap-2 sm:gap-3">
            {i > 0 && (
              <span className="pt-2 text-2xl font-bold text-primary-400/50">
                :
              </span>
            )}
            <div className="flex min-w-[3.75rem] flex-col items-center rounded-xl border border-primary-400/30 bg-[#1e1e1e] px-2.5 py-2 sm:min-w-[4.25rem]">
              <span className="text-3xl font-bold leading-none text-white tabular-nums sm:text-4xl">
                {u.value}
              </span>
              <span className="mt-1.5 text-xs uppercase tracking-[0.08em] text-white/60">
                {u.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
