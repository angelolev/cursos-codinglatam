"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import DOMPurify from 'dompurify';
import dynamic from "next/dynamic";
import { ui } from "@/components/admin/ui";

// TipTap is heavy and only needed in this admin editor, so load it on demand
// (client-only) instead of shipping it in the shared bundle.
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[120px] rounded-lg bg-white/5 animate-pulse" />
  ),
});

interface BannerManagementProps {
  onSuccess: () => void;
}

export default function BannerManagement({ onSuccess }: BannerManagementProps) {
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await fetch("/api/admin/banner");
      const data = await response.json();

      if (response.ok) {
        setMessage(data.banner.message || "");
        setIsActive(data.banner.isActive || false);
      }
    } catch (err) {
      console.error("Failed to fetch banner:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, isActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update banner");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating banner");
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className={ui.cardPadded}>
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.cardPadded}>
      <h2 className="text-2xl font-bold text-white mb-6">
        Gestión del Banner Promocional
      </h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Active Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <div>
            <label className="text-sm font-medium text-zinc-200 flex items-center gap-2">
              {isActive ? (
                <Eye className="h-5 w-5 text-emerald-400" />
              ) : (
                <EyeOff className="h-5 w-5 text-zinc-500" />
              )}
              Estado del Banner
            </label>
            <p className="text-sm text-zinc-500 mt-1">
              {isActive
                ? "El banner está visible para todos los usuarios"
                : "El banner está oculto"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              isActive ? "bg-emerald-600" : "bg-white/15"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                isActive ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Message Input */}
        <div>
          <label className={ui.label}>
            Mensaje del Banner <span className="text-red-400">*</span>
          </label>
          <RichTextEditor
            value={message}
            onChange={setMessage}
          />
          <p className="text-xs text-zinc-500 mt-1">
            Usa los botones para aplicar <strong>negrita</strong> o <em>cursiva</em>
          </p>
        </div>

        {/* Preview */}
        {message && (
          <div>
            <label className={ui.label}>Vista Previa</label>
            <div className="bg-gradient-to-r from-rose-200 to-purple-200 text-gray-800 py-3 rounded-lg">
              <div className="max-w-7xl mx-auto text-center px-4">
                <div
                  className="text-sm md:text-base font-medium"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(message, {
                      ALLOWED_TAGS: ['p', 'strong', 'em', 'b', 'i', 'span'],
                      ALLOWED_ATTR: []
                    })
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={isLoading}
            className={ui.btnPrimary}
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
