import { Users, BookOpen, Rocket, Code2 } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 rounded-3xl overflow-hidden mb-12 border border-gray-700/50 shadow-2xl relative">
      {/* Clean gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-transparent"></div>
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-br from-blue-600/10 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-2/3 bg-gradient-to-tl from-purple-600/8 via-transparent to-transparent"></div>

      <div className="relative px-8 py-16 sm:px-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
              Transforma tu carrera en programación
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Únete a otros desarrolladores que aprenden HACIENDO con nuestros
              cursos, proyectos prácticos y guías escritos por expertos.
            </p>
            <div className="flex gap-4">
              <Link
                href="/pro"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 uppercase text-xl tracking-wider shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Aprende hoy
              </Link>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 hover:border-blue-500/30 transition-all duration-300 group">
                <Users className="h-8 w-8 text-blue-400 mb-3 group-hover:text-blue-300 transition-colors" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Comunidad
                </h3>
                <p className="text-gray-300">
                  Unidos por el código, juntos en cada error
                </p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 hover:border-green-500/30 transition-all duration-300 group">
                <BookOpen className="h-8 w-8 text-green-400 mb-3 group-hover:text-green-300 transition-colors" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Recursos
                </h3>
                <p className="text-gray-300">
                  Accede a material extra en cada aprendizaje
                </p>
              </div>
            </div>
            <div className="space-y-6 lg:mt-6">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 hover:border-purple-500/30 transition-all duration-300 group">
                <Rocket className="h-8 w-8 text-purple-400 mb-3 group-hover:text-purple-300 transition-colors" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Crecimiento profesional
                </h3>
                <p className="text-gray-300">
                  No solo aspectos técnicos, sino también habilidades blandas
                </p>
              </div>
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30 hover:border-orange-500/30 transition-all duration-300 group">
                <Code2 className="h-8 w-8 text-orange-400 mb-3 group-hover:text-orange-300 transition-colors" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Proyectos
                </h3>
                <p className="text-gray-300">
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
