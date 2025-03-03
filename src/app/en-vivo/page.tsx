import { LiveCourseCard } from "@/components/LiveCourseCard";
import { getLiveCourses } from "@/utils/common";

export default async function EnVivo() {
  const courses = await getLiveCourses();

  return (
    <main className="pb-16 px-4 sm:px-0">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 text-center">
          Cursos en vivo
        </h1>
        <p className="text-xl text-indigo-100 text-center max-w-4xl mx-auto mb-16">
          Descubre cursos creados para llevar tus habilidades al siguiente
          nivel, ya sea que estés empezando o busques perfeccionar tu dominio.
          ¡Empieza hoy y alcanza tus metas más rápido!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course, index) => (
            <LiveCourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </main>
  );
}
