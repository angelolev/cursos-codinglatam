"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { StarterRepoProps } from "@/types/starter-repo";
import { ui, badge } from "@/components/admin/ui";

interface AddRepoFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: (StarterRepoProps & { id: string }) | null;
  mode?: 'create' | 'edit';
}

export default function AddRepoForm({ onSuccess, onCancel, initialData = null, mode = 'create' }: AddRepoFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    thumbnail: "",
    githubUrl: "",
    demoUrl: "",
    category: "",
    difficulty: "Intermedio",
    setupTime: "",
    isPremium: false,
    readme: "",
  });

  const [stack, setStack] = useState<string[]>([]);
  const [stackInput, setStackInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title,
        shortDescription: initialData.shortDescription || "",
        description: initialData.description,
        thumbnail: initialData.thumbnail,
        githubUrl: initialData.githubUrl,
        demoUrl: initialData.demoUrl || "",
        category: initialData.category,
        difficulty: initialData.difficulty,
        setupTime: initialData.setupTime || "",
        isPremium: initialData.isPremium,
        readme: initialData.readme || "",
      });
      setStack(initialData.stack || []);
      setFeatures(initialData.features || []);
    }
  }, [initialData, mode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addStackItem = () => {
    if (stackInput.trim() && !stack.includes(stackInput.trim())) {
      setStack([...stack, stackInput.trim()]);
      setStackInput("");
    }
  };

  const removeStackItem = (item: string) => {
    setStack(stack.filter((s) => s !== item));
  };

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (item: string) => {
    setFeatures(features.filter((f) => f !== item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = mode === 'edit' && initialData
        ? `/api/admin/repos?id=${initialData.id}`
        : "/api/admin/repos";

      const method = mode === 'edit' ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          stack,
          features,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${mode} repository`);
      }

      // Reset form only in create mode
      if (mode === 'create') {
        setFormData({
          title: "",
          shortDescription: "",
          description: "",
          thumbnail: "",
          githubUrl: "",
          demoUrl: "",
          category: "",
          difficulty: "Intermedio",
          setupTime: "",
          isPremium: false,
          readme: "",
        });
        setStack([]);
        setFeatures([]);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error ${mode === 'edit' ? 'updating' : 'creating'} repository`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${ui.cardPadded} mb-8`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {mode === 'edit' ? 'Editar Repositorio' : 'Nuevo Repositorio'}
        </h2>
        <button
          onClick={onCancel}
          className="text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className={ui.label}>
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={ui.input}
              placeholder="Next.js E-commerce Starter"
            />
          </div>

          {/* Category */}
          <div>
            <label className={ui.label}>
              Categoría <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className={ui.input}
              placeholder="Full Stack, Frontend, Backend..."
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className={ui.label}>
            Descripción Corta
          </label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            className={ui.input}
            placeholder="Resumen breve del repositorio"
          />
        </div>

        {/* Description */}
        <div>
          <label className={ui.label}>
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            className={ui.input}
            placeholder="Descripción detallada del repositorio"
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className={ui.label}>
            URL de Imagen (Thumbnail) <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
            required
            className={ui.input}
            placeholder="https://images.unsplash.com/..."
          />
          {formData.thumbnail && (
            <div className="mt-2">
              <p className="text-sm text-zinc-500 mb-2">Preview:</p>
              <Image
                src={formData.thumbnail}
                alt="Preview"
                width={400}
                height={200}
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* GitHub URL */}
          <div>
            <label className={ui.label}>
              GitHub URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleInputChange}
              required
              className={ui.input}
              placeholder="https://github.com/username/repo"
            />
          </div>

          {/* Demo URL */}
          <div>
            <label className={ui.label}>
              Demo URL
            </label>
            <input
              type="url"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleInputChange}
              className={ui.input}
              placeholder="https://demo.example.com"
            />
          </div>
        </div>

        {/* Stack */}
        <div>
          <label className={ui.label}>
            Stack de Tecnologías
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addStackItem())}
              className={`${ui.input} flex-1`}
              placeholder="Next.js, TypeScript, etc."
            />
            <button
              type="button"
              onClick={addStackItem}
              className={ui.btnPrimary}
            >
              Agregar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <span key={item} className={badge("indigo")}>
                {item}
                <button
                  type="button"
                  onClick={() => removeStackItem(item)}
                  className="transition-colors hover:text-indigo-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Difficulty */}
          <div>
            <label className={ui.label}>
              Dificultad
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className={ui.select}
            >
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          {/* Setup Time */}
          <div>
            <label className={ui.label}>
              Tiempo de Setup
            </label>
            <input
              type="text"
              name="setupTime"
              value={formData.setupTime}
              onChange={handleInputChange}
              className={ui.input}
              placeholder="10 min, 30 min..."
            />
          </div>

          {/* Premium */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPremium"
                checked={formData.isPremium}
                onChange={handleInputChange}
                className="h-5 w-5 rounded border-white/20 bg-white/[0.04] text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-zinc-300">
                Repositorio Premium
              </span>
            </label>
          </div>
        </div>

        {/* Features */}
        <div>
          <label className={ui.label}>
            Características
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              className={`${ui.input} flex-1`}
              placeholder="Stripe integration, Admin dashboard..."
            />
            <button
              type="button"
              onClick={addFeature}
              className={ui.btnPrimary}
            >
              Agregar
            </button>
          </div>
          <ul className="space-y-1">
            {features.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-zinc-300">
                <span>• {item}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(item)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* README */}
        <div>
          <label className={ui.label}>
            README / Instrucciones
          </label>
          <textarea
            name="readme"
            value={formData.readme}
            onChange={handleInputChange}
            rows={6}
            className={`${ui.input} font-mono`}
            placeholder="# Installation&#10;&#10;npm install&#10;npm run dev"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={ui.btnPrimary}
          >
            {isLoading ? "Guardando..." : mode === 'edit' ? "Actualizar Repositorio" : "Guardar Repositorio"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={ui.btnGhost}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
