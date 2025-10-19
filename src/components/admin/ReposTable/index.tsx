"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, ExternalLink, Crown, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import { StarterRepoProps } from "@/types/starter-repo";

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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
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
        });

        onDelete();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error instanceof Error ? error.message : "Error al eliminar",
          icon: "error",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const difficultyColors = {
    Principiante: "bg-green-100 text-green-800",
    Intermedio: "bg-yellow-100 text-yellow-800",
    Avanzado: "bg-red-100 text-red-800",
  };

  if (repos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 text-lg">
          No hay repositorios creados todavía.
        </p>
        <p className="text-gray-400 mt-2">
          Haz clic en &quot;Nuevo Repositorio&quot; para crear uno.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título / Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stack
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dificultad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {repos.map((repo) => (
              <tr key={repo.id} className="hover:bg-gray-50">
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
                  <div className="text-sm font-medium text-gray-900">
                    {repo.title}
                  </div>
                  <div className="text-sm text-gray-500">{repo.category}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {repo.stack.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {repo.stack.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{repo.stack.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      difficultyColors[
                        repo.difficulty as keyof typeof difficultyColors
                      ]
                    }`}
                  >
                    {repo.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {repo.isPremium ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-full text-xs font-semibold">
                      <Crown className="h-3 w-3" />
                      Premium
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Gratis
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-3">
                    <a
                      href={`/repositorios/${repo.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ver
                    </a>
                    <button
                      onClick={() => onEdit(repo)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(repo.id, repo.title)}
                      disabled={deletingId === repo.id}
                      className={`inline-flex items-center gap-1 ${
                        deletingId === repo.id
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-red-600 hover:text-red-900"
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
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Total: {repos.length} repositorio{repos.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
