"use client";

import StarterRepoCard from "@/components/StarterRepoCard";
import { StarterRepoProps } from "@/types/starter-repo";

interface StarterReposClientProps {
  repos: StarterRepoProps[];
}

export default function StarterReposClient({
  repos,
}: StarterReposClientProps) {
  return (
    <div>
      {repos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/60 text-lg">
            No hay repositorios disponibles todavía.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {repos.map((repo) => (
            <StarterRepoCard key={repo.id} {...repo} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-white/60">
        <p>
          {repos.length} repositorio{repos.length !== 1 ? "s" : ""} disponible{repos.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
