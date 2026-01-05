import Link from "next/link";
import { Sparkles, Calendar, Users, Award } from "lucide-react";

export default function AICertificationBanner() {
  return (
    <div className="mb-16">
      {/* Main Banner */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 rounded-3xl overflow-hidden border border-gray-700/50 shadow-2xl relative">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 to-transparent"></div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-br from-cyan-600/10 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-2/3 bg-gradient-to-tl from-blue-600/10 via-transparent to-transparent"></div>

        <div className="relative px-6 py-10 md:px-12 md:py-12">
          {/* Badge */}
          <div className="inline-flex items-center bg-cyan-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-cyan-400/30">
            <Sparkles className="h-4 w-4 text-cyan-300 mr-2" />
            <span className="text-sm font-semibold text-cyan-300">
              Cohorte 1 · Febrero 2026 · 40% OFF Primeros 15
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Conviértete en{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  AI Engineer
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Domina el desarrollo profesional con IA en 6 semanas. No es un
                curso más de ChatGPT, es una certificación que demuestra que
                sabes usar IA como un profesional.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">3-5x</div>
                  <div className="text-xs text-gray-400">Productividad</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">6 sem</div>
                  <div className="text-xs text-gray-400">Duración</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">40%</div>
                  <div className="text-xs text-gray-400">Descuento</div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href="/waitlist"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <Award className="h-5 w-5" />
                Asegurar mi lugar con 40% OFF
              </Link>
            </div>

            {/* Right Content - Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30 hover:border-cyan-500/30 transition-all duration-300">
                <Calendar className="h-6 w-6 text-cyan-400 mb-3" />
                <h3 className="text-base font-semibold text-white mb-1">
                  Inicia Febrero 10
                </h3>
                <p className="text-sm text-gray-300">
                  Mar/Jue 8PM-10PM
                  <br />8 hrs/semana
                </p>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30 hover:border-blue-500/30 transition-all duration-300">
                <Users className="h-6 w-6 text-blue-400 mb-3" />
                <h3 className="text-base font-semibold text-white mb-1">
                  +79 registrados
                </h3>
                <p className="text-sm text-gray-300">
                  Solo 15 lugares con Early Bird
                </p>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30 hover:border-purple-500/30 transition-all duration-300">
                <Sparkles className="h-6 w-6 text-purple-400 mb-3" />
                <h3 className="text-base font-semibold text-white mb-1">
                  Herramientas Pro
                </h3>
                <p className="text-sm text-gray-300">
                  Claude Code, Cursor, v0, y más
                </p>
              </div>

              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30 hover:border-green-500/30 transition-all duration-300">
                <Award className="h-6 w-6 text-green-400 mb-3" />
                <h3 className="text-base font-semibold text-white mb-1">
                  Certificación
                </h3>
                <p className="text-sm text-gray-300">
                  Badge verificable en LinkedIn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
