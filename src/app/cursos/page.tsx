import CursosClient from "@/components/CursosClient";
import { getCourses } from "@/utils/common";
import { generatePageMetadata } from "@/utils/metadata";

export const dynamic = "force-static";

export function generateMetadata() {
  return generatePageMetadata(
    "Nuestros Cursos",
    "Mejora tus habilidades de desarrollo web con nuestros cursos prácticos impartidos por expertos de la industria. Aprende haciendo proyectos reales.",
    "/cursos"
  );
}

export default async function Cursos() {
  const courses = await getCourses();

  return (
    <main className="pt-32 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
      <div className="text-center my-12">
        <h1 className="text-4xl font-bold text-white/90 mb-4">
          Nuestros cursos
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Mejora tus habilidades de desarrollo web con nuestros cursos
          impartidos por expertos de la industria
        </p>
      </div>
      <CursosClient courses={courses || []} />
    </main>
  );
}
