"use client";
import { useState, use } from "react";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/utils/common";
import { Search } from "lucide-react";
import { ProjectProps } from "@/types/project";

// Create a promise outside the component that will be used by the use hook
const projectsPromise = getProjects();

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Use the new "use" API to handle the promise
  const projects: ProjectProps[] = use(projectsPromise) || [];

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 text-center">
          Aprende HACIENDO proyectos REALES
        </h1>
        <p className="text-xl text-indigo-100 mb-8 text-center max-w-3xl mx-auto">
          Domina el código con nuestros proyectos prácticos y convierte la
          teoría en experiencia real.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar proyectos..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-white">
              No se encontraron proyectos con ese nombre.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
