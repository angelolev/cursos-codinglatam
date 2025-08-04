import { CourseCard } from "@/components/CourseCard";
import Workshop from "@/components/WorkshopCard";
import { getCourses, getProducts, getWorkshops } from "@/utils/common";
import { auth } from "./auth";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import { ProductsInfiniteScroll } from "@/components/ProductsInfiniteScroll";

export default async function Home() {
  const courses = await getCourses();
  const products = await getProducts();
  const workshops = await getWorkshops();
  const session = await auth();

  return (
    <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
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

      {/* <MonthlyEvents /> */}

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
      <ProductsInfiniteScroll initialProducts={products || []} />
      {session?.user?.isPremium ? null : <Pricing />}
    </main>
  );
}
