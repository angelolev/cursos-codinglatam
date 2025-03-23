import { Users, BookOpen, Rocket, Code2 } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl overflow-hidden mb-24">
      <div className="px-8 py-16 sm:px-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6">
              Transforma tu carrera en programación
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Únete a otros desarrolladores que aprenden HACIENDO con nuestros
              cursos, proyectos prácticos y guías escritos por expertos.
            </p>
            <div className="flex gap-4">
              <Link
                href="/pro"
                className="bg-primary-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-500 transition-colors uppercase text-xl tracking-wider"
              >
                Aprende hoy
              </Link>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  No solo aspectos técnicos, sino también habilidades blandas
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
  );
}
