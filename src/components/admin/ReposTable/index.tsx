"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, ExternalLink, Crown, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import { StarterRepoProps } from "@/types/starter-repo";
import { ui, badge } from "@/components/admin/ui";

interface ReposTableProps {
  repos: (StarterRepoProps & { id: string })[];
  onDelete: () => void;
  onEdit: (repo: StarterRepoProps & { id: string }) => void;
}

export default function ReposTable({ repos, onDelete, onEdit }: ReposTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar "${title}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#1e1e1e",
      color: "#e4e4e7",
    });

    if (result.isConfirmed) {
      try {
        setDeletingId(id);

        const response = await fetch(`/api/admin/repos?id=${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to delete repository");
        }

        Swal.fire({
          title: "¡Eliminado!",
          text: "El repositorio ha sido eliminado.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "#1e1e1e",
          color: "#e4e4e7",
        });

        onDelete();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error instanceof Error ? error.message : "Error al eliminar",
          icon: "error",
          background: "#1e1e1e",
          color: "#e4e4e7",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const difficultyColors = {
    Principiante: badge("emerald"),
    Intermedio: badge("amber"),
    Avanzado: badge("red"),
  };

  if (repos.length === 0) {
    return (
      <div className={`${ui.cardPadded} p-8 text-center`}>
        <p className="text-zinc-400 text-lg">
          No hay repositorios creados todavía.
        </p>
        <p className="text-zinc-500 mt-2">
          Haz clic en &quot;Nuevo Repositorio&quot; para crear uno.
        </p>
      </div>
    );
  }

  return (
    <div className={ui.card}>
      <div className="overflow-x-auto">
        <table className={ui.table}>
          <thead className={ui.thead}>
            <tr>
              <th className={ui.th}>Imagen</th>
              <th className={ui.th}>Título / Categoría</th>
              <th className={ui.th}>Stack</th>
              <th className={ui.th}>Dificultad</th>
              <th className={ui.th}>Estado</th>
              <th className={ui.th}>Acciones</th>
            </tr>
          </thead>
          <tbody className={ui.tbody}>
            {repos.map((repo) => (
              <tr key={repo.id} className={ui.tr}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Image
                    src={repo.thumbnail}
                    alt={repo.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-zinc-100">
                    {repo.title}
                  </div>
                  <div className="text-sm text-zinc-500">{repo.category}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {repo.stack.slice(0, 3).map((tech, index) => (
                      <span key={index} className={badge("indigo")}>
                        {tech}
                      </span>
                    ))}
                    {repo.stack.length > 3 && (
                      <span className={badge("zinc")}>
                        +{repo.stack.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={
                      difficultyColors[
                        repo.difficulty as keyof typeof difficultyColors
                      ]
                    }
                  >
                    {repo.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {repo.isPremium ? (
                    <span className={badge("indigo")}>
                      <Crown className="h-3 w-3" />
                      Premium
                    </span>
                  ) : (
                    <span className={badge("emerald")}>Gratis</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-3">
                    <a
                      href={`/repositorios/${repo.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ver
                    </a>
                    <button
                      onClick={() => onEdit(repo)}
                      className="text-zinc-300 hover:text-white inline-flex items-center gap-1 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(repo.id, repo.title)}
                      disabled={deletingId === repo.id}
                      className={`inline-flex items-center gap-1 transition-colors ${
                        deletingId === repo.id
                          ? "text-zinc-600 cursor-not-allowed"
                          : "text-red-400 hover:text-red-300"
                      }`}
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingId === repo.id ? "..." : "Eliminar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10">
        <p className="text-sm text-zinc-500">
          Total:{" "}
          <span className="tabular-nums text-zinc-300">{repos.length}</span>{" "}
          repositorio{repos.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
