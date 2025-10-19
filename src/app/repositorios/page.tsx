import { getStarterRepos } from "@/utils/common";
import { StarterRepoProps } from "@/types/starter-repo";
import StarterReposClient from "@/components/StarterReposClient";
import { generatePageMetadata } from "@/utils/metadata";

export const revalidate = 86400; // 24 hours

export function generateMetadata() {
  return generatePageMetadata(
    "Repositorios de Apoyo",
    "Accede a repositorios de apoyo optimizados con las mejores prácticas y configuraciones listas para usar.",
    "/repositorios"
  );
}

export default async function RepositoriosPage() {
  const repos: StarterRepoProps[] = (await getStarterRepos()) || [];

  return (
    <main className="pt-32 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 text-center">
          Repositorios de Apoyo
        </h1>
        <p className="text-xl text-indigo-100 mb-8 text-center max-w-3xl mx-auto">
          Arranca tus proyectos más rápido con repositorios de apoyo
          optimizados, configuraciones listas para producción y mejores
          prácticas integradas.
        </p>
      </div>

      <StarterReposClient repos={repos} />
    </main>
  );
}
