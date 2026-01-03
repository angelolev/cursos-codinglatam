"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, AlertCircle, Mail, ArrowRight } from "lucide-react";
import { WaitlistAvatar } from "@/types/waitlist";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [avatars, setAvatars] = useState<WaitlistAvatar[]>([]);
  const [avatarsLoading, setAvatarsLoading] = useState(true);

  // Currency hook for dynamic price conversion
  const {
    convertAndFormatPrice,
    currentCurrency,
    isLoading: currencyLoading,
  } = useCurrency();

  // Precios en USD (moneda base del sistema)
  const REGULAR_PRICE_USD = 220; // ~800 PEN
  const EARLY_BIRD_PRICE_USD = 132; // 40% OFF
  const DISCOUNT_PERCENTAGE = 40;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

    // Client validation
    if (!email.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Por favor ingresa tu email",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitStatus({
        type: "error",
        message: "Por favor ingresa un email válido",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar email");
      }

      setSubmitStatus({
        type: "success",
        message:
          "¡Listo! Recibirás todos los detalles del programa y tu código Early Bird por email.",
      });
      setEmail("");

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Algo salió mal",
      });

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchAvatars() {
      try {
        const response = await fetch("/api/users/random");
        const data = await response.json();

        if (data.users && data.users.length >= 3) {
          setAvatars(data.users.slice(0, 3)); // Tomar primeros 3
        }
      } catch (error) {
        console.error("Failed to load avatars:", error);
        // Mantener avatars vacío -> fallback a estáticos
      } finally {
        setAvatarsLoading(false);
      }
    }

    fetchAvatars();
  }, []);

  return (
    <main className="pt-24 pb-16 mx-auto max-w-4xl sm:px-6 px-4 lg:px-0 flex-grow">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-4 py-2 text-blue-300 mb-8 border border-blue-400/30">
          <span className="text-sm font-medium">
            Cohorte 1 · Febrero 2026 · 40% OFF Primeros 15
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white/90 mb-6 leading-tight">
          Conviértete en
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            AI Engineer
          </span>
        </h1>

        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
          Domina el desarrollo profesional con IA en 6 semanas. No es un curso
          más de ChatGPT, es una certificación que demuestra que sabes usar IA
          como un profesional.
        </p>
      </div>

      {/* Social Proof Section */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="flex -space-x-4 mb-4">
          {avatarsLoading ? (
            // Loading skeleton
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full bg-gray-300 animate-pulse border-2 border-white"
                />
              ))}
            </>
          ) : avatars.length >= 3 ? (
            // Avatares reales con tooltip
            <>
              {avatars.map((avatar, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={avatar.image}
                    alt={avatar.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover"
                  />
                  {/* Tooltip CSS-only */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {avatar.name}
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Fallback: avatares estáticos
            <>
              <Image
                src="https://ui-avatars.com/api/?name=Maria+Garcia&background=4F46E5&color=fff&size=48"
                alt="Usuario"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <Image
                src="https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=7C3AED&color=fff&size=48"
                alt="Usuario"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <Image
                src="https://ui-avatars.com/api/?name=Ana+Martinez&background=EC4899&color=fff&size=48"
                alt="Usuario"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </>
          )}

          {/* Badge +2K (mantener) */}
          <div className="w-12 h-12 rounded-full bg-primary-300 border-2 border-white flex items-center justify-center">
            <span className="text-xs font-bold text-white">+79</span>
          </div>
        </div>
        <p className="text-white/70 text-sm">
          Únete a más de 79 desarrolladores esperando la Cohorte 1
        </p>
      </div>

      {/* Pricing Section */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Early Bird Badge */}
            <div className="inline-flex items-center bg-blue-600/30 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-blue-400/30">
              <span className="text-sm font-semibold text-cyan-300">
                🎯 Early Bird - Solo primeros 15
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4">
              {/* Regular Price (crossed out) */}
              <div className="text-center">
                <p className="text-white/50 text-sm mb-1">Precio regular</p>
                {currencyLoading ? (
                  <div className="h-8 w-24 bg-white/10 animate-pulse rounded mx-auto" />
                ) : (
                  <p className="text-2xl text-white/60 line-through">
                    {convertAndFormatPrice(REGULAR_PRICE_USD)}
                  </p>
                )}
              </div>

              {/* Arrow */}
              <div className="text-3xl text-cyan-400">→</div>

              {/* Early Bird Price */}
              <div className="text-center">
                <p className="text-cyan-300 text-sm mb-1 font-semibold">
                  Precio Early Bird
                </p>
                {currencyLoading ? (
                  <div className="h-12 w-32 bg-white/10 animate-pulse rounded mx-auto" />
                ) : (
                  <div className="flex items-baseline gap-2 justify-center">
                    <p className="text-5xl font-bold text-white">
                      {convertAndFormatPrice(EARLY_BIRD_PRICE_USD)}
                    </p>
                    <span className="text-lg text-white/70">
                      {currentCurrency.code}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Discount Badge */}
            <div className="text-center">
              <span className="inline-block bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-bold border border-cyan-400/30">
                Ahorras {DISCOUNT_PERCENTAGE}% ={" "}
                {currencyLoading
                  ? "..."
                  : convertAndFormatPrice(
                      REGULAR_PRICE_USD - EARLY_BIRD_PRICE_USD
                    )}
              </span>
            </div>

            {/* Payment note */}
            <p className="text-center text-white/50 text-xs mt-4">
              Los pagos se procesan en USD. Precio mostrado en{" "}
              {currentCurrency.name} es referencial.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Asegura tu lugar con 40% OFF
          </h2>
          <p className="text-gray-600">
            Los primeros 15 inscritos obtienen Early Bird. Regístrate ahora y
            recibe todos los detalles.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-lg bg-white border border-gray-300 shadow-sm pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-gray-900 placeholder-gray-400"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-300 text-white px-8 py-4 rounded-lg hover:bg-primary-400 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Enviando...
              </>
            ) : (
              <>
                Asegurar mi Early Bird (40% OFF)
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Success/Error Messages */}
          {submitStatus.type === "success" && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm">{submitStatus.message}</p>
            </div>
          )}

          {submitStatus.type === "error" && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{submitStatus.message}</p>
            </div>
          )}
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          🔒 Sin spam. Solo información del programa y tu código Early Bird.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
        <div className="text-center">
          <div className="text-3xl mb-2">⚡</div>
          <h3 className="font-semibold text-white/90 mb-1">
            Productividad 3-5x
          </h3>
          <p className="text-sm text-white/60">
            Tareas que tomaban días ahora toman horas con IA
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">🎓</div>
          <h3 className="font-semibold text-white/90 mb-1">
            Certificación Oficial
          </h3>
          <p className="text-sm text-white/60">
            Badge verificable en LinkedIn y portfolio
          </p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-2">💰</div>
          <h3 className="font-semibold text-white/90 mb-1">Mayor Salario</h3>
          <p className="text-sm text-white/60">
            Justifica pedir 20-30% más con skills de IA
          </p>
        </div>
      </div>

      {/* Value Props Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white/90 text-center mb-4">
          Lo que aprenderás en 6 semanas
        </h3>
        <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
          Programa intensivo diseñado para llevarte de developer a AI Engineer
          certificado
        </p>

        {/* Curriculum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Card 1: Herramientas */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              Dominio de Herramientas IA
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    Claude Code & Cursor:
                  </strong>{" "}
                  IDEs potenciados con IA
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">MCP & Skills:</strong>{" "}
                  Personaliza tu flujo de trabajo
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    GitHub Copilot & Codeium:
                  </strong>{" "}
                  Autocompletado inteligente
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">v0, Bolt & Lovable:</strong>{" "}
                  Generación de UI/UX
                </span>
              </li>
            </ul>
          </div>

          {/* Card 2: Debugging */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
              <span className="text-2xl">🐛</span>
              Debugging Avanzado con IA
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  Identifica bugs en{" "}
                  <strong className="text-white/90">segundos</strong> con
                  análisis de IA
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Stack trace analysis automático</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Debugging en tiempo real con pair programming IA</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  Prevención de bugs con pre-commit hooks inteligentes
                </span>
              </li>
            </ul>
          </div>

          {/* Card 3: Code Review */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              Code Review & Refactoring
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Mejora código legacy con IA en minutos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Code reviews automáticos antes de cada commit</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Aprende best practices de código limpio</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Refactoring inteligente que mantiene funcionalidad</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Comunidad */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
              <span className="text-2xl">👥</span>
              Comunidad & Networking
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Grupo privado de AI Engineers certificados</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Sesiones en vivo con expertos de la industria</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Networking con developers de Latam y USA</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Acceso de por vida a la comunidad</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Curriculum Week by Week */}
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 mb-16">
          <h4 className="text-xl font-bold text-white/90 mb-6 text-center">
            📅 Curriculum Semana por Semana
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Week 1-2 */}
            <div>
              <div className="text-cyan-400 font-bold mb-2">
                Semanas 1-2: Fundamentos
              </div>
              <ul className="space-y-1 text-sm text-white/70">
                <li>• Setup de herramientas IA</li>
                <li>• Prompting profesional</li>
                <li>• Workflows básicos</li>
                <li>• Primer proyecto guiado</li>
              </ul>
            </div>

            {/* Week 3-4 */}
            <div>
              <div className="text-cyan-400 font-bold mb-2">
                Semanas 3-4: Avanzado
              </div>
              <ul className="space-y-1 text-sm text-white/70">
                <li>• Custom agents & MCP</li>
                <li>• Debugging avanzado</li>
                <li>• Code review </li>
                <li>• Proyecto individual</li>
              </ul>
            </div>

            {/* Week 5-6 */}
            <div>
              <div className="text-cyan-400 font-bold mb-2">
                Semanas 5-6: Certificación
              </div>
              <ul className="space-y-1 text-sm text-white/70">
                <li>• Proyecto final</li>
                <li>• Mejores prácticas de producción</li>
                <li>• Certificación</li>
                <li>• Portafolio profesional</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Outcomes Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h4 className="text-xl font-bold text-white/90 mb-6 text-center">
            🎯 Resultados Garantizados
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">3-5x</div>
              <p className="text-sm text-white/70">
                Más productivo que antes del programa
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">90%</div>
              <p className="text-sm text-white/70">
                De tiempo ahorrado en tareas repetitivas
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                20%-30%
              </div>
              <p className="text-sm text-white/70">
                Incremento salarial en promedio
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20 text-center">
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20">
          <p className="text-white/90 text-lg mb-4">
            <span className="font-bold text-cyan-400">
              Solo quedan pocos lugares
            </span>{" "}
            con 40% OFF para la Cohorte 1
          </p>
          <div className="space-y-2 text-white/60 text-sm">
            <p>
              📅 Inicia: Febrero 3, 2026 · Duración: 6 semanas
            </p>
            <p>
              🕐 Clases: Martes y Jueves, 8:00 PM - 10:00 PM (8 hrs/semana)
            </p>
            <p>
              🏆 Certificación oficial al finalizar
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
