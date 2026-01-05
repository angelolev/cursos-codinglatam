"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Mail, ArrowRight } from "lucide-react";
import { WaitlistAvatar } from "@/types/waitlist";
import { useCurrency } from "@/contexts/CurrencyContext";
import CurrencySelector from "@/components/CurrencySelector";
import paypalImage from "@/assets/paypal.svg";
import visaImage from "@/assets/visa.svg";
import cardImage from "@/assets/card.svg";
import americanExpressImage from "@/assets/amex.svg";
import yapeImage from "@/assets/yape.svg";
import plinImage from "@/assets/plin.svg";
import yapeQR from "@/assets/yape-qr.png";

// Peru Flag Component
const PEFlag = () => {
  return (
    <svg
      className="w-5 h-5 inline-block"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="0" width="512" height="512" fill="#fff" />
      <rect y="0" width="170.67" height="512" fill="#D80027" />
      <rect x="341.33" width="170.67" height="512" fill="#D80027" />
    </svg>
  );
};

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
  const REGULAR_PRICE_USD = 299; // ~800 PEN
  const EARLY_BIRD_PRICE_USD = 179.4; // 40% OFF
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
          "¡Listo! Recibirás información del programa y futuras versiones por email.",
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
          Domina
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Claude Code
          </span>
        </h1>

        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">
          El AI coding assistant más potente del mercado, integrado en tu
          terminal. Aprende a desarrollar 5x más rápido con MCP, custom skills y
          workflows profesionales que las empresas tech están usando hoy.
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
          Únete a más de 79 desarrolladores que quieren dominar Claude Code en
          la Cohorte 1
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

            {/* Currency Selector */}
            <div className="flex justify-center mb-6">
              <div className="inline-block">
                <CurrencySelector />
              </div>
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

      {/* Direct Checkout CTA */}
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Asegura tu lugar con 40% OFF
        </h2>
        <p className="text-gray-600 mb-6 text-lg">
          Únete a la primera cohorte que dominará Claude Code profesionalmente
        </p>

        {/* Discount Code Badge */}
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-400 rounded-lg px-6 py-3 mb-8">
          <span className="text-gray-700 font-medium">Usa el código:</span>
          <span className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-4 py-1.5 rounded-md font-bold text-lg tracking-wide">
            AIDEV40
          </span>
        </div>

        <Link
          href="https://cursoscodinglatam.lemonsqueezy.com/checkout/buy/6ca73d5c-90e2-4340-aeb9-5f1e842f64ab"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white px-10 py-5 rounded-lg font-bold text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer"
        >
          <CheckCircle2 className="h-6 w-6" />
          Pagar y Asegurar mi Lugar (40% OFF)
          <ArrowRight className="h-6 w-6" />
        </Link>
        <p className="text-gray-500 text-sm mt-4">
          💳 Pago seguro procesado por Lemon Squeezy
        </p>
      </div>

      {/* Payment Methods Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Paga con</h3>
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <Image src={visaImage} alt="Visa" width={50} height={50} />
              <Image src={cardImage} alt="Card" width={60} height={60} />
              <Image src={paypalImage} alt="Paypal" width={50} height={50} />
              <Image
                src={americanExpressImage}
                alt="American Express"
                width={50}
                height={50}
              />
            </div>
            <div className="bg-gradient-to-r from-red-50 to-white border-2 border-red-500 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <PEFlag />
                <h4 className="text-lg font-bold text-gray-900">
                  Opciones para Perú
                </h4>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Image src={yapeImage} alt="Yape" width={50} height={50} />
                <Image src={plinImage} alt="Plin" width={50} height={50} />
              </div>
              <p className="text-gray-700 text-sm font-medium">
                Envía tu voucher al <b>+51 964225808</b> para completar tu
                registro
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-lg">
              <div className="bg-white rounded-xl p-4 mb-4">
                <Image
                  src={yapeQR}
                  alt="Yape QR"
                  width={280}
                  height={280}
                  className="w-full h-auto"
                />
              </div>
              <p className="w-full  text-white font-bold rounded-lg transition-colors text-center">
                Paga con QR
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card - Hidden for now */}
      {/* <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Recibe información del programa
          </h2>
          <p className="text-gray-600">
            Regístrate para recibir información del programa y futuras
            versiones.
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
            className="w-full bg-gray-100 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-gray-700 border-t-transparent rounded-full" />
                Enviando...
              </>
            ) : (
              <>
                Recibir Información
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

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
          🔒 Te enviaremos información del programa por correo. Sin spam.
        </p>
      </div> */}

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
          Domina Claude Code como tu herramienta principal de desarrollo
        </h3>
        <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
          El AI coding assistant más poderoso del mercado, integrado
          directamente en tu terminal y workflow diario
        </p>

        {/* Curriculum Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Card 1: Claude Code CLI */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Claude Code CLI Completo
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    Comandos desde terminal:
                  </strong>{" "}
                  Genera features completas, refactoriza archivos y debuggea
                  código sin salir de la CLI
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    Context window 200K tokens:
                  </strong>{" "}
                  Lee proyectos enteros simultáneamente, entiende toda tu
                  arquitectura
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">Interactive mode:</strong>{" "}
                  Conversaciones multi-turn donde Claude recuerda todo el
                  contexto del proyecto
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">File operations:</strong>{" "}
                  Lee, edita, crea y elimina archivos automáticamente basado en
                  tus instrucciones
                </span>
              </li>
            </ul>
          </div>

          {/* Card 2: MCP & Skills */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔌</span>
              MCP Servers & Custom Skills
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    MCP (Model Context Protocol):
                  </strong>{" "}
                  Conecta Claude con filesystem, git, SQLite, Postgres y
                  cualquier herramienta externa
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">Custom Skills:</strong> Crea
                  comandos slash personalizados (/deploy, /test, /migrate) para
                  tu stack
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">Hooks & Automation:</strong>{" "}
                  Ejecuta scripts automáticos antes/después de cada interacción
                  con Claude
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    Subagents especializados:
                  </strong>{" "}
                  Delega tareas complejas a agentes especializados (explore,
                  plan, review) que trabajan en paralelo
                </span>
              </li>
            </ul>
          </div>

          {/* Card 3: Advanced Prompting */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Prompt Engineering Avanzado
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    Modelos Opus, Sonnet & Haiku:
                  </strong>{" "}
                  Aprende cuándo usar cada modelo (Opus para tareas complejas,
                  Sonnet balance perfecto, Haiku para velocidad)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    System prompts efectivos:
                  </strong>{" "}
                  Configura Claude para que genere código en tu style guide
                  específico
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">Context management:</strong>{" "}
                  Técnicas para maximizar los 200K tokens y procesar codebases
                  enormes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    Prompts por tipo de tarea:
                  </strong>{" "}
                  Aprende los prompts exactos para refactoring, debugging, E2E
                  testing con Playwright y documentation
                </span>
              </li>
            </ul>
          </div>

          {/* Card 4: Real Development Workflows */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h4 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Workflows Profesionales
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    Feature development completo:
                  </strong>{" "}
                  Desde diseño hasta tests E2E con Playwright, usando Claude en
                  cada paso del proceso
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">Code review con AI:</strong>{" "}
                  Revisa PRs completos, detecta bugs y mejora code quality antes
                  de merge
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    Legacy code modernization:
                  </strong>{" "}
                  Migra proyectos viejos a TypeScript, actualiza dependencies,
                  moderniza patterns
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>
                  <strong className="text-white/90">
                    AI pair programming:
                  </strong>{" "}
                  Debugging interactivo, explicaciones de código y pair
                  programming 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Curriculum Week by Week */}
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 mb-16">
          <h4 className="text-xl font-bold text-white/90 mb-6 text-center">
            📅 Tu roadmap de developer tradicional a Claude Code expert en 6
            semanas
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Week 1-2 */}
            <div>
              <div className="text-cyan-400 font-bold mb-3">
                Semanas 1-2: Fundamentos
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Instalación y configuración de Claude Code</li>
                <li>• Comandos esenciales y modo interactivo</li>
                <li>• Prompting efectivo para desarrollo</li>
                <li>
                  • <strong className="text-white/90">Proyecto:</strong> Genera
                  tu primer feature completo con Claude
                </li>
              </ul>
            </div>

            {/* Week 3-4 */}
            <div>
              <div className="text-cyan-400 font-bold mb-3">
                Semanas 3-4: MCP & Automatización
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Configuración de MCP servers</li>
                <li>• Custom Skills para tu workflow</li>
                <li>• Hooks y automatización avanzada</li>
                <li>
                  • <strong className="text-white/90">Proyecto:</strong>{" "}
                  Automatiza code review y testing E2E con Playwright usando
                  Claude
                </li>
              </ul>
            </div>

            {/* Week 5-6 */}
            <div>
              <div className="text-cyan-400 font-bold mb-3">
                Semanas 5-6: Production Ready
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Feature development end-to-end</li>
                <li>• Refactoring de proyectos legacy</li>
                <li>• Best practices y workflows profesionales</li>
                <li>
                  • <strong className="text-white/90">Certificación:</strong>{" "}
                  Proyecto final
                </li>
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
            <p>📅 Inicia: Febrero 17, 2026 · Duración: 6 semanas</p>
            <p>🕐 Clases: Martes y Jueves, 8:00 PM - 10:00 PM (8 hrs/semana)</p>
            <p>🏆 Certificación oficial al finalizar</p>
          </div>
        </div>
      </div>
    </main>
  );
}
