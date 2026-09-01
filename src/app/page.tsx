import { CourseCard } from "@/components/CourseCard";
import Workshop from "@/components/WorkshopCard";
import { getCourses, getProducts, getWorkshops } from "@/utils/common";
import { hasStartedAnyCourse, getRecentCourseActivity } from "@/utils/progress";
import { auth } from "./auth";
import { generatePageMetadata } from "@/utils/metadata";

import { ProductsInfiniteScroll } from "@/components/ProductsInfiniteScroll";
import ContinueLearningServerSide from "@/components/ContinueLearningServerSide";
import PricingServerSide from "@/components/PricingServerSide";
import { CourseGridSkeleton } from "@/components/SkeletonLoader";
import Link from "next/link";
import CompanyLogos from "@/components/CompanyLogos";
import EnterpriseHero from "@/components/home/EnterpriseHero";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import Programs from "@/components/home/Programs";
import ContactCTA from "@/components/home/ContactCTA";
import { Eyebrow } from "@/components/claude-brochure/primitives";

// Enable revalidation for better performance (ISR)
export const revalidate = 300; // Revalidate every 5 minutes

export function generateMetadata() {
  return generatePageMetadata(
    "Capacitación e implementación de IA para empresas",
    "Somos el socio tecnológico de empresas y equipos que quieren potenciar sus proyectos con IA: capacitación in-company, agentes a medida y automatización de procesos.",
    "/",
  );
}

export default async function Home() {
  try {
    // Fetch all data in parallel with limits for better performance
    const [courses, products, workshops, session] = await Promise.all([
      getCourses(8).catch((err) => {
        console.error("Failed to fetch courses:", err);
        return null;
      }),
      getProducts(8).catch((err) => {
        console.error("Failed to fetch products:", err);
        return null;
      }),
      getWorkshops(4).catch((err) => {
        console.error("Failed to fetch workshops:", err);
        return null;
      }),
      auth().catch((err) => {
        console.error("Failed to get auth:", err);
        return null;
      }),
    ]);

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

    // Un estudiante activo (Pro o con progreso) entra a seguir aprendiendo:
    // le mostramos su actividad y el catálogo, no el pitch para empresas.
    const isActiveStudent = Boolean(
      session?.user?.isPremium || userHasStartedAnyCourse,
    );

    return (
      // El acento de las primitivas del brochure toma el dorado de la marca
      // (mismo color del logo) en lugar del terracota de las landings de Claude.
      <main className="pt-24 mx-auto max-w-7xl w-full sm:px-6 md:px-8 px-4 lg:px-0 flex-grow [--accent:#ecb033] [--accent-deep:#e4911c]">
        {isActiveStudent ? (
          <ContinueLearningServerSide recentCourses={recentCourseActivity} />
        ) : (
          <>
            <EnterpriseHero />
            <CompanyLogos />
            <Services />
            <Process />
            <Programs />
            <ContactCTA />
          </>
        )}

        {/* Catálogo para profesionales que aprenden por su cuenta */}
        <section id="cursos" className="scroll-mt-28">
          <div className="text-center mb-12">
            <Eyebrow>Para profesionales</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-white/90 mt-3 mb-4">
              Aprende haciendo proyectos reales
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Cursos y talleres para integrar IA en tu trabajo diario, con
              proyectos reales y todo lo que hemos aprendido construyendo en
              producción.
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
          <Link
            href="/cursos"
            className="text-white/60 text-center block mx-auto mt-8 cursor-pointer hover:text-white/80 transition-colors"
          >
            Ver todos los cursos →
          </Link>
        </section>

        <div>
          <div className="text-center my-24">
            <Eyebrow>Recursos</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold text-white/90 mt-3 mb-4">
              Guías prácticas de IA y desarrollo
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Recursos sobre herramientas modernas e IA aplicada, pensados para
              que apliques lo aprendido el mismo día.
            </p>
          </div>
          <ProductsInfiniteScroll initialProducts={products || []} />
          <Link
            href="/guias"
            className="text-white/60 text-center block mx-auto cursor-pointer hover:text-white/80 transition-colors"
          >
            Ver todas las guías →
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
      <main className="pt-24 mx-auto max-w-7xl w-full sm:px-6 md:px-8 px-4 lg:px-0 flex-grow">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-red-300 mb-4">
            Error cargando la página
          </h2>
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
