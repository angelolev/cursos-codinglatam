import CursosClient from "@/components/CursosClient";
import { getCourses } from "@/utils/common";

export const dynamic = "force-static";

export default async function Cursos() {
  const courses = await getCourses();

  return (
    <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
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
