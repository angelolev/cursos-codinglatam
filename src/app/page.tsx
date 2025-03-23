import { CourseCard } from "@/components/CourseCard";
import Product from "@/components/ProductCard";
import Workshop from "@/components/WorkshopCard";
import { getCourses, getProducts, getWorkshops } from "@/utils/common";
import { auth } from "./auth";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";

export default async function Home() {
  const courses = await getCourses();
  const products = await getProducts();
  const workshops = await getWorkshops();
  const session = await auth();

  return (
    <>
      {session?.user?.isPremium ? null : <Hero />}

      <div className="text-center mb-24">
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
        {workshops?.map((workshop, index) => (
          <Workshop key={index} {...workshop} />
        ))}
      </div>

      {/* <div className="text-center my-24">
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
          </div> */}

      <div className="text-center my-24">
        <h1 className="text-4xl font-bold text-white/90 mb-4">
          Guías de estudio para ti
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Material enfocado en ayudarte a optimizar todo lo necesario para la
          búsqueda laboral y mejora de skills
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products?.map((product, index) => (
          <Product key={index} {...product} />
        ))}
      </div>
      {session?.user?.isPremium ? null : <Pricing />}
    </>
  );
}
