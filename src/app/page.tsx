import { CourseCard } from "@/components/CourseCard";
import Product from "@/components/ProductCard";
import Workshop from "@/components/WorkshopCard";
import { getCourses, getProducts, getWorkshops } from "@/utils/common";

export default async function Home() {
  const courses = await getCourses();
  const products = await getProducts();
  const workshops = await getWorkshops();

  return (
    <>
      <main className="pb-16 px-4 sm:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
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

          <div className="text-center my-12">
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

          <div className="text-center my-12">
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
