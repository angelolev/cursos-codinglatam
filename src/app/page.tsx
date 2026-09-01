import { getRecentCourseActivity } from "@/utils/progress";
import { auth } from "./auth";
import { generatePageMetadata } from "@/utils/metadata";

import ContinueLearningServerSide from "@/components/ContinueLearningServerSide";
import Link from "next/link";
import CompanyLogos from "@/components/CompanyLogos";
import EnterpriseHero from "@/components/home/EnterpriseHero";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import Programs from "@/components/home/Programs";
import ContactCTA from "@/components/home/ContactCTA";

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
    const session = await auth().catch((err) => {
      console.error("Failed to get auth:", err);
      return null;
    });

    // Un estudiante con actividad reciente ve un acceso rápido a sus cursos
    // encima de la landing; el catálogo completo vive en /cursos.
    const recentCourseActivity = session?.user?.email
      ? await getRecentCourseActivity(session.user.email).catch((err) => {
          console.error("Failed to fetch recent course activity:", err);
          return [];
        })
      : [];

    return (
      // El acento de las primitivas del brochure toma el dorado de la marca
      // (mismo color del logo) en lugar del terracota de las landings de Claude.
      <main className="pt-24 mx-auto max-w-7xl w-full sm:px-6 md:px-8 px-4 lg:px-0 flex-grow [--accent:#ecb033] [--accent-deep:#e4911c]">
        <ContinueLearningServerSide recentCourses={recentCourseActivity} />
        <EnterpriseHero />
        <CompanyLogos />
        <Services />
        <Process />
        <Programs />
        <ContactCTA />
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
