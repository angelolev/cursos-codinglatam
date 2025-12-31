import { CourseCard } from "@/components/CourseCard";
import Workshop from "@/components/WorkshopCard";
import Hero from "@/components/Hero";
import {
  getCourses,
  getProducts,
  getWorkshops,
  getStarterRepos,
} from "@/utils/common";
import { hasStartedAnyCourse, getRecentCourseActivity } from "@/utils/progress";
import { auth } from "./auth";
import { generatePageMetadata } from "@/utils/metadata";

import { ProductsInfiniteScroll } from "@/components/ProductsInfiniteScroll";
import ContinueLearningServerSide from "@/components/ContinueLearningServerSide";
import PricingServerSide from "@/components/PricingServerSide";
import { CourseGridSkeleton } from "@/components/SkeletonLoader";
import Link from "next/link";
import StarterRepoCard from "@/components/StarterRepoCard";

// Enable revalidation for better performance (ISR)
export const revalidate = 300; // Revalidate every 5 minutes

export function generateMetadata() {
  return generatePageMetadata(
    "Aprende a programar HACIENDO proyectos",
    "Mejora tus habilidades de desarrollo web con nuestros cursos, proyectos y guías impartidos por expertos de la industria",
    "/"
  );
}

export default async function Home() {
  try {
    // Fetch all data in parallel with limits for better performance
    const [courses, products, workshops, starterRepos, session] =
      await Promise.all([
        getCourses(12).catch((err) => {
          console.error("Failed to fetch courses:", err);
          return null;
        }),
        getProducts(8).catch((err) => {
          console.error("Failed to fetch products:", err);
          return null;
        }),
        getWorkshops(8).catch((err) => {
          console.error("Failed to fetch workshops:", err);
          return null;
        }),
        getStarterRepos(4).catch((err) => {
          console.error("Failed to fetch starter repos:", err);
          return null;
        }),
        auth().catch((err) => {
          console.error("Failed to get auth:", err);
          return null;
        }),
      ]);

    console.log(workshops, "wk");

    // Check if user has started any course and get recent activity
    const [userHasStartedAnyCourse, recentCourseActivity] = session?.user?.email
      ? await Promise.all([
          hasStartedAnyCourse(session.user.email).catch((err) => {
            console.error("Failed to check user progress:", err);
            return false;
          }),
          getRecentCourseActivity(session.user.email).catch((err) => {
            console.error("Failed to fetch recent course activity:", err);
            return [];
          }),
        ])
      : [false, []];

    return (
      <main className="pt-24 mx-auto max-w-7xl sm:px-6 md:px-8 px-4 lg:px-0 flex-grow">
        {session?.user?.isPremium || userHasStartedAnyCourse ? null : <Hero />}

        {/* Show continue learning for logged-in users */}
        <ContinueLearningServerSide recentCourses={recentCourseActivity} />

        <div className="text-center mb-24">
          <h1 className="text-4xl font-bold text-white/90 mb-4">
            Nuestros cursos
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Mejora tus habilidades de desarrollo web con nuestros cursos
            impartidos por expertos de la industria
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses && courses.length > 0 ? (
            courses.map((course, index) => (
              <CourseCard key={course.id || index} {...course} />
            ))
          ) : (
            <CourseGridSkeleton count={8} />
          )}
          {workshops &&
            workshops.length > 0 &&
            workshops.map((workshop, index) => (
              <Workshop key={workshop.id || index} {...workshop} />
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

        <div>
          <div className="text-center my-24">
            <h1 className="text-4xl font-bold text-white/90 mb-4">
              Repositorios de Apoyo
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Arranca tus proyectos más rápido con repositorios optimizados y
              mejores prácticas integradas
            </p>
          </div>
          {starterRepos && starterRepos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-6">
                {starterRepos.map((repo) => (
                  <StarterRepoCard key={repo.id} {...repo} />
                ))}
              </div>
              <Link
                href="/repositorios"
                className="text-white/60 text-center block mx-auto cursor-pointer hover:text-white/80 transition-colors"
              >
                Ver todos los repositorios →
              </Link>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/60">
                Próximamente: Repositorios de apoyo optimizados
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="text-center my-24">
            <h1 className="text-4xl font-bold text-white/90 mb-4">
              Guías de estudio para ti
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Material enfocado en ayudarte a optimizar todo lo necesario para
              la búsqueda laboral y mejora de skills
            </p>
          </div>
          <ProductsInfiniteScroll initialProducts={products || []} />
          <Link
            href="/guias"
            className="text-white/60 text-center block mx-auto cursor-pointer"
          >
            Ver todas las guías
          </Link>
        </div>

        {session?.user?.isPremium ? null : (
          <PricingServerSide userSession={session} />
        )}
      </main>
    );
  } catch (error) {
    console.error("Home page error:", error);
    return (
      <main className="pt-24 mx-auto max-w-7xl sm:px-6 md:px-8 px-4 lg:px-0 flex-grow">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-red-300 mb-4">
            Error cargando la página
          </h1>
          <p className="text-red-200 mb-6">
            Ocurrió un error inesperado. Por favor, recarga la página.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block"
          >
            Recargar página
          </Link>
        </div>
      </main>
    );
  }
}
