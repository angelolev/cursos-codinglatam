"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import DOMPurify from 'dompurify';
import RichTextEditor from './RichTextEditor';

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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Gestión del Banner Promocional
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              {isActive ? (
                <Eye className="h-5 w-5 text-green-600" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400" />
              )}
              Estado del Banner
            </label>
            <p className="text-sm text-gray-500 mt-1">
              {isActive
                ? "El banner está visible para todos los usuarios"
                : "El banner está oculto"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              isActive ? "bg-green-600" : "bg-gray-300"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje del Banner <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={message}
            onChange={setMessage}
          />
          <p className="text-xs text-gray-500 mt-1">
            Usa los botones para aplicar <strong>negrita</strong> o <em>cursiva</em>
          </p>
        </div>

        {/* Preview */}
        {message && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista Previa
            </label>
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
        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
