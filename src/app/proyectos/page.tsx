import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/utils/common";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects?.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
