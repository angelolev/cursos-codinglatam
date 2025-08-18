"use client";
import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Search } from "lucide-react";
import { ProjectProps } from "@/types/project";

interface ProjectsClientProps {
  projects: ProjectProps[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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
    </>
  );
}