import { getProjects } from "@/utils/common";
import { ProjectProps } from "@/types/project";
import ProjectsClient from "@/components/ProjectsClient";

export const revalidate = 86400; // 24 hours

export default async function ProjectsPage() {
  // Fetch projects server-side
  const projects: ProjectProps[] = (await getProjects()) || [];

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
      </div>

      <ProjectsClient projects={projects} />
    </main>
  );
}
