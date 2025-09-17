import { FC } from "react";
import { BookOpen, Users, Zap } from "lucide-react";
import { generatePageMetadata } from "@/utils/metadata";

export const dynamic = 'force-static';

export function generateMetadata() {
  return generatePageMetadata(
    "Sobre Nosotros",
    "Conoce más sobre Coding Latam, nuestra misión de democratizar el acceso a la educación en tecnología y cómo ayudamos a formar desarrolladores exitosos.",
    "/about"
  );
}

const AboutPage: FC = () => {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-6">Sobre Nosotros</h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
          Nuestra misión es democratizar el acceso a la educación en tecnología,
          ofreciendo contenido de alta calidad que sea práctico y relevante para
          las demandas del mercado actual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cursos Prácticos
          </h2>
          <p className="text-gray-600">
            Aprende con proyectos reales y adquiere experiencia aplicable desde
            el primer día.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Users className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Comunidad Activa
          </h2>
          <p className="text-gray-600">
            Únete a una comunidad de estudiantes y profesionales para colaborar
            y crecer juntos.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tecnología de Vanguardia
          </h2>
          <p className="text-gray-600">
            Explora las últimas tendencias y herramientas en el mundo del
            desarrollo de software.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Nuestra Historia
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          CodingLatam nació de la pasión por la enseñanza y el deseo de crear
          una plataforma que realmente preparara a los estudiantes para los
          desafíos del mundo tecnológico. Fundada por un grupo de
          desarrolladores con experiencia en la industria, nos enfocamos en
          cerrar la brecha entre la teoría y la práctica.
        </p>
        <p className="text-lg text-gray-700">
          Creemos en un aprendizaje flexible y accesible, por lo que ofrecemos
          una variedad de formatos, desde cursos a tu propio ritmo hasta
          workshops intensivos en vivo. Nuestro compromiso es con tu éxito, y te
          acompañamos en cada paso de tu camino para convertirte en un
          profesional destacado.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
