import { getRecentCourseActivity } from "@/utils/progress";
import { auth } from "./auth";
import { generatePageMetadata } from "@/utils/metadata";

import ContinueLearningServerSide from "@/components/ContinueLearningServerSide";
import Link from "next/link";
import CompanyLogos from "@/components/CompanyLogos";
import EnterpriseHero from "@/components/home/EnterpriseHero";
import Credentials from "@/components/home/Credentials";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import Programs from "@/components/home/Programs";
import ContactCTA from "@/components/home/ContactCTA";
import { ctaPrimary } from "@/components/ui/actions";

// Enable revalidation for better performance (ISR)
export const revalidate = 300; // Revalidate every 5 minutes

export function generateMetadata() {
  return generatePageMetadata(
    "Capacitación e implementación de IA para empresas",
    "Somos el socio tecnológico de empresas y equipos que quieren potenciar sus proyectos con IA: capacitación in-company, agentes a medida y automatización de procesos.",
    "/",
  );
}

// El acento de las primitivas del brochure toma el dorado de la marca
// (mismo color del logo) en lugar del terracota de las landings de Claude.
const mainClass =
  "pt-24 mx-auto max-w-7xl w-full sm:px-6 md:px-8 px-4 lg:px-0 flex-grow [--accent:#ecb033] [--accent-deep:#e4911c]";

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
      <main className={mainClass}>
        <ContinueLearningServerSide recentCourses={recentCourseActivity} />
        <EnterpriseHero />
        {/* Prueba social: las cifras y los logos se leen como un solo bloque. */}
        <Credentials />
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
      <main className={mainClass}>
        <div className="mx-auto my-20 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h2 className="text-xl font-bold text-white/90">
            No pudimos cargar la página
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Algo falló de nuestro lado. Vuelve a intentarlo en unos segundos.
          </p>
          <Link href="/" className={`${ctaPrimary} mt-6`}>
            Reintentar
          </Link>
        </div>
      </main>
    );
  }
}
