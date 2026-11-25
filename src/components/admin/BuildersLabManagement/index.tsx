"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Minus, Plus } from "lucide-react";
import { ui, badge } from "@/components/admin/ui";

interface BuildersLabManagementProps {
  onSuccess: (cupos: number) => void;
}

type Estado = {
  cupos: number;
  fuente: "firestore" | "respaldo";
  updatedAt: string | null;
  cuposTotales: number;
};

// Cupos restantes del Builders Lab (/builders-lab), guardados en Firestore.
export default function BuildersLabManagement({
  onSuccess,
}: BuildersLabManagementProps) {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [cupos, setCupos] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/builders-lab");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "No se pudieron cargar");
        setEstado(data);
        setCupos(data.cupos);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar");
      }
    })();
  }, []);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/builders-lab", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuposRestantes: cupos }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudieron guardar");
      setEstado(data);
      onSuccess(data.cupos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  if (!estado) {
    return (
      <div className={ui.cardPadded}>
        {error ? (
          <p className="text-sm text-red-300">{error}</p>
        ) : (
          <div className="h-24 rounded-lg bg-white/5 animate-pulse" />
        )}
      </div>
    );
  }

  const total = estado.cuposTotales;
  const sinCambios = cupos === estado.cupos && estado.fuente === "firestore";

  return (
    <div className={`${ui.cardPadded} max-w-xl`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Builders Lab</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Cupos restantes que muestra la landing.
          </p>
        </div>
        <a
          href="/builders-lab"
          target="_blank"
          rel="noopener noreferrer"
          className={ui.btnGhost}
        >
          Ver landing
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {estado.fuente === "respaldo" && (
        <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          Todavía no hay cupos guardados en Firestore: la landing usa el valor
          de respaldo ({estado.cupos}). Guarda una vez para empezar a
          manejarlos desde aquí.
        </div>
      )}

      <form onSubmit={guardar} className="space-y-6">
        <div>
          <label htmlFor="cupos" className={ui.label}>
            Cupos restantes (de {total})
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Restar un cupo"
              onClick={() => setCupos((c) => Math.max(0, c - 1))}
              disabled={cupos <= 0}
              className={`${ui.btnGhost} h-12 w-12 px-0 disabled:opacity-40`}
            >
              <Minus className="h-5 w-5" />
            </button>
            <input
              id="cupos"
              type="number"
              inputMode="numeric"
              min={0}
              max={total}
              step={1}
              value={cupos}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isInteger(n)) setCupos(Math.min(total, Math.max(0, n)));
              }}
              className={`${ui.input} h-12 w-24 text-center text-2xl font-bold`}
            />
            <button
              type="button"
              aria-label="Sumar un cupo"
              onClick={() => setCupos((c) => Math.min(total, c + 1))}
              disabled={cupos >= total}
              className={`${ui.btnGhost} h-12 w-12 px-0 disabled:opacity-40`}
            >
              <Plus className="h-5 w-5" />
            </button>
            <span
              className={badge(
                cupos === 0 ? "red" : cupos <= 5 ? "amber" : "emerald"
              )}
            >
              {cupos === 0 ? "Lista de espera" : `${total - cupos} ocupados`}
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Con 0 cupos se ocultan los precios de lanzamiento y la landing
            muestra solo el botón de lista de espera.
          </p>
        </div>

        <div className="flex items-center gap-4 border-t border-white/10 pt-4">
          <button
            type="submit"
            disabled={guardando || sinCambios}
            className={ui.btnPrimary}
          >
            {guardando ? "Guardando..." : "Guardar cupos"}
          </button>
          {estado.updatedAt && (
            <span className="text-xs text-zinc-500">
              Último cambio:{" "}
              {new Date(estado.updatedAt).toLocaleString("es-PE", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
