"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface ToastProps {
  success: string | null;
  error: string | null;
}

// Toast fijo abajo a la derecha: el feedback aparece siempre en el viewport,
// sin importar en qué fila o tab se disparó la acción. El auto-dismiss lo
// controla la página (mismos setTimeout que ya gobiernan success/error).
export default function Toast({ success, error }: ToastProps) {
  const message = success || error;
  if (!message) return null;

  const isSuccess = Boolean(success);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-xl border p-4 shadow-2xl shadow-black/40 backdrop-blur-md animate-[admin-toast-in_0.25s_ease-out] ${
        isSuccess
          ? "border-emerald-500/30 bg-emerald-950/90 text-emerald-200"
          : "border-red-500/30 bg-red-950/90 text-red-200"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0 text-red-400" />
      )}
      <p className="text-sm leading-snug">{message}</p>
    </div>
  );
}
