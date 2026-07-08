"use client";

import { useEffect } from "react";
import { ui } from "@/components/admin/ui";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-light-black p-6 shadow-2xl shadow-black/50 animate-[admin-toast-in_0.2s_ease-out]">
        <h3
          id="confirm-dialog-title"
          className="text-lg font-semibold text-white"
        >
          {title}
        </h3>
        <div className="mt-2 text-sm leading-relaxed text-zinc-400">
          {description}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className={ui.btnGhost}>
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className={tone === "danger" ? ui.btnDanger : ui.btnPrimary}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
