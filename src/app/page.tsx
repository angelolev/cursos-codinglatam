import { CourseCard } from "@/components/CourseCard";
import Product from "@/components/ProductCard";
import Workshop from "@/components/WorkshopCard";
import { getCourses, getProducts, getWorkshops } from "@/utils/common";
import { BookOpen, Code2, Rocket, Users } from "lucide-react";
import Link from "next/link";
import { auth } from "./auth";

export default async function Home() {
  const courses = await getCourses();
  const products = await getProducts();
  const workshops = await getWorkshops();

  /* const session = await auth();

  console.log(session, "user"); */

  return (
    <>
      <main className="pb-16 px-4 sm:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl overflow-hidden mb-24">
            <div className="px-8 py-16 sm:px-16 sm:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6">
                    Transforma tu carrera en desarrollo web
                  </h1>
                  <p className="text-xl text-indigo-100 mb-8">
                    Únete a otros desarrolladores que aprenden HACIENDO con
                    nuestros cursos, proyectos prácticos y guías escritos por
                    expertos.
                  </p>
                  <div className="flex gap-4">
                    <Link
                      href="https://www.patreon.com/c/codinglatam/membership"
                      target="_blank"
                      className="bg-primary-300 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors"
                    >
                      Unirme
                    </Link>
                    {/* <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                      Unirme
                    </button> */}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <Users className="h-8 w-8 text-white mb-3" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Communidad
                      </h3>
                      <p className="text-indigo-100">
                        Unidos por el código, juntos en cada error
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <BookOpen className="h-8 w-8 text-white mb-3" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Recursos
                      </h3>
                      <p className="text-indigo-100">
                        Accede a material extra en cada aprendizaje
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6 sm:mt-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <Rocket className="h-8 w-8 text-white mb-3" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Crecimiento profesional
                      </h3>
                      <p className="text-indigo-100">
                        No solo aspectos técnicos, sino también habilidades
                        blandas
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                      <Code2 className="h-8 w-8 text-white mb-3" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Proyectos
                      </h3>
                      <p className="text-indigo-100">
                        Aprende HACIENDO proyectos REALES
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center my-24">
            <h1 className="text-4xl font-bold text-white/90 mb-4">
              Nuestros cursos
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Mejora tus habilidades de desarrollo web con nuestros cursos
              impartidos por expertos de la industria
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses?.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>

          <div className="text-center my-24">
            <h1 className="text-4xl font-bold text-white/90 mb-4">
              Guías de estudio para ti
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Material enfocado en ayudarte a optimizar todo lo necesario para
              la búsqueda laboral y mejora de skills
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product, index) => (
              <Product key={index} {...product} />
            ))}
          </div>

          <div className="text-center my-24">
            <h1 className="text-4xl font-bold text-white/90 mb-4">
              Workshops y training
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Talleres pensados no solo en habilidades técnicas sino también en
              habilidades blandas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops?.map((workshop, index) => (
              <Workshop key={index} {...workshop} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
