"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  ArrowRight,
  Zap,
  GraduationCap,
  TrendingUp,
  Video,
  BadgeCheck,
  Users,
  MessageCircle,
  Code2,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  Bot,
  FolderGit2,
} from "lucide-react";
import angeloImage from "@/assets/angelo.jpeg";

// --- Brochure UI primitives (Antigravity look & feel, compartidas con /claude) ---

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-antigravity-deep">
    <span className="text-antigravity/40">{"// "}</span>
    {children}
  </span>
);

const cardClass =
  "relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.015] backdrop-blur-sm overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_-28px_rgba(0,0,0,0.7)]";

const TopAccent = () => (
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-antigravity/80 via-antigravity/20 to-transparent" />
);

// Terminal window — agente ejecutando una tarea en Antigravity
const TerminalSnippet = () => (
  <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-white/10 bg-black/50 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
    <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-antigravity/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </span>
      <span className="ml-1 text-xs text-white/40">antigravity — agent manager</span>
    </div>
    <div className="px-5 py-4 text-sm leading-relaxed">
      <div className="text-terminal-green">
        <span className="text-antigravity">$</span> agent run
      </div>
      <div className="mt-1 text-white/55">
        &quot;Implementa el endpoint y su suite de tests&quot;
        <span className="animate-caret ml-1 inline-block h-4 w-2 translate-y-0.5 bg-antigravity" />
      </div>
      <div className="mt-2 text-white/30">
        <span className="text-terminal-green">✓</span> Navegando el codebase, editando y verificando en el browser…
      </div>
    </div>
  </div>
);

// Scroll-reveal: anima los hijos directos de <main> al entrar al viewport.
function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const items = Array.from(root.children) as HTMLElement[];
    items.forEach((el, i) => {
      el.classList.add("reveal-init");
      el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("reveal-in");
            el.classList.remove("reveal-init");
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

export default function AntigravityPage() {
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef);

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

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
          "¡Listo! Te avisaremos por email apenas abramos inscripciones.",
      });
      setEmail("");

      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Algo salió mal",
      });

      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Programa: temario propuesto para el curso de Google Antigravity
  const program = [
    {
      block: "Fundamentos",
      classes: [
        {
          n: 1,
          title: "Qué es Google Antigravity",
          items: [
            "El IDE agéntico de Google sobre Gemini 3",
            "Diferencias frente a Claude Code, Cursor y Copilot",
            "Instalación y configuración en vivo",
            "Editor, Terminal y Browser como superficies del agente",
          ],
        },
        {
          n: 2,
          title: "Agent Manager y flujo de trabajo",
          items: [
            "Cómo delegar tareas completas a un agente autónomo",
            "Planes de ejecución, revisión y aprobación de cambios",
            "Artifacts: capturas, listas de tareas y walkthroughs",
            "Trabajar con múltiples agentes en paralelo",
          ],
        },
      ],
    },
    {
      block: "Flujo agéntico avanzado",
      classes: [
        {
          n: 3,
          title: "Verificación con el browser integrado",
          items: [
            "El agente navega y prueba tu app como lo haría un QA",
            "Screenshots y grabaciones automáticas como evidencia",
            "Debugging guiado por el propio agente",
          ],
        },
        {
          n: 4,
          title: "Contexto, reglas y MCP",
          items: [
            "Archivos de contexto a nivel de proyecto",
            "Conectar fuentes externas vía MCP",
            "Buenas prácticas de prompt engineering para tareas largas",
          ],
        },
        {
          n: 5,
          title: "Proyecto final end-to-end",
          items: [
            "De un requerimiento real a una app funcionando",
            "Supervisión de agentes en un flujo de producción",
            "Entrega, revisión de código y demo final",
          ],
        },
      ],
    },
  ];

  const methodology = [
    {
      n: "01",
      title: "Learning by Doing",
      text: "Cada sesión delega tareas reales a agentes y revisa el resultado, no ves slides pasivamente.",
    },
    {
      n: "02",
      title: "Progresivo y guiado",
      text: "De instalar Antigravity a supervisar agentes en un proyecto completo, con complejidad creciente.",
    },
    {
      n: "03",
      title: "Proyecto real",
      text: "Construyes un proyecto completo orquestando agentes autónomos, listo para tu portfolio.",
    },
  ];

  const inclusions = [
    {
      icon: Video,
      title: "Grabaciones de por vida",
      text: "Acceso permanente a las grabaciones de todas las clases para repasar cuando quieras",
    },
    {
      icon: BadgeCheck,
      title: "Certificación verificable",
      text: "Badge para LinkedIn que valida tus habilidades con Google Antigravity",
    },
    {
      icon: Users,
      title: "Comunidad privada",
      text: "Acceso al grupo exclusivo de alumnos y egresados para networking y soporte",
    },
    {
      icon: MessageCircle,
      title: "Mentoría en vivo",
      text: "Resuelve dudas en tiempo real durante cada clase con el instructor",
    },
    {
      icon: Code2,
      title: "Proyectos prácticos",
      text: "Cada clase incluye ejercicios reales que suman a tu portfolio profesional",
    },
    {
      icon: RefreshCw,
      title: "Actualizaciones incluidas",
      text: "Acceso a futuras actualizaciones del contenido sin costo adicional",
    },
  ];

  return (
    <main
      ref={mainRef}
      className="pt-24 pb-16 mx-auto w-full max-w-4xl sm:px-6 px-4 lg:px-0 flex-grow min-w-0"
    >
      {/* Hero Section */}
      <div className="relative text-center mb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-6rem] -z-10 h-[28rem] w-[42rem] max-w-[110vw] -translate-x-1/2 rounded-full bg-antigravity/10 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[-6rem] -z-10 h-[26rem] opacity-[0.12] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="inline-flex items-center gap-2 rounded-full border border-antigravity-deep/40 bg-antigravity-deep/10 px-4 py-1.5 mb-8">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-antigravity opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-antigravity" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-antigravity-deep">
            Waitlist abierta
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white/90 mb-6 leading-[1.1]">
          Google Antigravity
          <br />
          <span className="text-antigravity underline decoration-antigravity-deep/50 decoration-2 underline-offset-[10px] drop-shadow-[0_0_30px_rgba(102,157,246,0.35)]">
            desde cero
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12">
          Aprende a construir software con{" "}
          <strong className="text-antigravity">agentes autónomos</strong>{" "}
          usando Google Antigravity, el IDE agéntico impulsado por Gemini 3.
          Un programa 100% práctico donde sales orquestando agentes que
          escriben, prueban y verifican código por ti.
        </p>

        <div className="flex justify-center mb-12">
          {[
            { value: "Gemini 3", label: "Modelo base" },
            { value: "100%", label: "Práctico" },
            { value: "IA", label: "Desarrollo agéntico" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`px-6 sm:px-10 text-center ${
                i > 0 ? "border-l border-white/10" : ""
              }`}
            >
              <div className="text-2xl sm:text-3xl font-bold text-antigravity drop-shadow-[0_0_20px_rgba(102,157,246,0.25)]">
                {stat.value}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <TerminalSnippet />
      </div>

      {/* Qué es Antigravity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto mb-16">
        {[
          {
            icon: Bot,
            title: "Agentes autónomos",
            text: "Delega tareas completas: el agente planifica, escribe código y verifica el resultado.",
          },
          {
            icon: Sparkles,
            title: "Gemini 3 integrado",
            text: "Aprovecha el modelo más reciente de Google directamente dentro del editor.",
          },
          {
            icon: FolderGit2,
            title: "Editor + Browser",
            text: "El agente prueba tu app en un navegador real y documenta cada paso con artifacts.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className={`${cardClass} group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-antigravity/40`}
          >
            <TopAccent />
            <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-antigravity-deep/30 bg-antigravity-deep/10 transition-colors duration-300 group-hover:border-antigravity/50 group-hover:bg-antigravity/15">
              <f.icon className="h-5 w-5 text-antigravity" />
            </span>
            <h3 className="font-semibold text-white/90 mb-1">{f.title}</h3>
            <p className="text-sm text-white/50">{f.text}</p>
          </div>
        ))}
      </div>

      {/* Waitlist Form */}
      <div className={`${cardClass} p-8 md:p-12 max-w-2xl mx-auto`}>
        <TopAccent />
        <div className="text-center mb-8">
          <Eyebrow>Próxima cohorte</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-3">
            Sé de los primeros en inscribirte
          </h2>
          <p className="text-white/50">
            Estamos preparando la primera cohorte del curso de Google
            Antigravity. Deja tu email y te avisamos apenas se abran
            inscripciones, con acceso prioritario y precio early bird.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-white/30" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-lg bg-white/[0.04] border border-white/10 pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-antigravity/40 focus:border-antigravity/40 text-white placeholder-white/30"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-antigravity-deep to-antigravity px-6 py-3.5 font-bold text-white shadow-lg shadow-antigravity-deep/25 transition-transform duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Unirme a la waitlist
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>

          {submitStatus.type === "success" && (
            <div className="flex items-center gap-2 p-4 rounded-lg border border-terminal-green/30 bg-terminal-green/10">
              <CheckCircle2 className="h-5 w-5 text-terminal-green shrink-0" />
              <p className="text-sm text-white/80">{submitStatus.message}</p>
            </div>
          )}

          {submitStatus.type === "error" && (
            <div className="flex items-center gap-2 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-sm text-white/80">{submitStatus.message}</p>
            </div>
          )}
        </form>
      </div>

      {/* Programa Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Eyebrow>Programa propuesto</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
            ¿Qué vas a dominar?
          </h3>
          <p className="text-white/50 max-w-2xl mx-auto">
            Un programa intensivo donde pasarás de cero con Google Antigravity
            a supervisar agentes autónomos que construyen proyectos completos.
          </p>
        </div>

        {program.map((block) => (
          <div key={block.block} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Eyebrow>{block.block}</Eyebrow>
              <span className="h-px flex-grow bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {block.classes.map((cls) => (
                <div key={cls.n} className={`${cardClass} p-6`}>
                  <TopAccent />
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-antigravity-deep">
                    Clase {cls.n}
                  </span>
                  <h4 className="font-bold text-white/90 mb-4">{cls.title}</h4>
                  <ul className="space-y-2 text-sm text-white/60">
                    {cls.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-antigravity mt-0.5">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Metodología Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="mb-10">
          <Eyebrow>Metodología</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-3">
            Nuestra propuesta de aprendizaje
          </h3>
          <p className="text-white/50 max-w-2xl">
            No es teoría. Es construir proyectos reales supervisado por
            instructores en vivo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methodology.map((m) => (
            <div key={m.n} className={`${cardClass} p-6`}>
              <TopAccent />
              <div className="text-4xl font-bold text-antigravity/30 mb-3">
                {m.n}
              </div>
              <h4 className="font-bold text-white/90 mb-2">{m.title}</h4>
              <p className="text-sm text-white/60">{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Requisitos Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="mb-8">
          <Eyebrow>Requisitos</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3">
            ¿Qué necesitas para empezar?
          </h3>
        </div>
        <div className={`${cardClass} p-8`}>
          <TopAccent />
          <p className="text-white/60 mb-6">
            Se recomienda tener conocimientos de programación en algún
            lenguaje (Python, JavaScript, Java, etc) con la finalidad de
            sacarle el máximo provecho al curso, pero{" "}
            <strong className="text-white/90">
              aun sin ellos puedes matricularte
            </strong>
            . No importa si nunca usaste herramientas de IA: arrancamos desde
            cero con Google Antigravity y al final vas a poder supervisar
            agentes que construyen proyectos completos{" "}
            <strong className="text-antigravity">de principio a fin</strong>.
          </p>
          <div className="border-t border-white/10 pt-5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-antigravity shrink-0 mt-0.5" />
            <p className="text-sm text-white/60">
              Cada alumno debe contar con una cuenta de Google y acceso a
              Google Antigravity. Este costo corre por cuenta del estudiante y
              no está incluido en la inscripción.
            </p>
          </div>
        </div>
      </div>

      {/* Instructor Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="mb-8">
          <Eyebrow>Instructor</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3">
            Quien te guía
          </h3>
        </div>
        <div className={`${cardClass} p-8`}>
          <TopAccent />
          <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
            <Image
              src={angeloImage}
              alt="Angelo Leva"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover border border-white/10 shrink-0"
            />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-antigravity-deep mb-1">
                Docente principal
              </div>
              <h4 className="text-2xl font-bold text-white/90">Angelo Leva</h4>
              <p className="text-antigravity text-sm mt-1">
                Senior Software Engineer & GDG Organizer · Founder, Coding Latam
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm text-white/60">
            <p>
              Ingeniero de software desde 2016, especializado en la
              intersección de IA y frontend engineering. Integra herramientas
              como Claude Code, Google Antigravity, Skills y MCP Servers en
              cada etapa del ciclo de desarrollo: desde generación de código y
              debugging hasta decisiones de arquitectura y automatización de
              workflows.
            </p>
            <p>
              Combina experiencia profunda en frontend (React, Next.js, Vite,
              Astro, TypeScript) con prácticas modernas de AI engineering.
              Diseña sistemas donde la integración de LLMs, agentes de código
              autónomos y prompt engineering son el core de cómo entrega
              software rápido, confiable y de alta calidad.
            </p>
            <p>
              A través de Coding Latam, entrena desarrolladores en toda
              Latinoamérica en desarrollo práctico asistido por IA.
              Organizador principal de GDG Tacna con eventos de +400
              developers.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Google Antigravity",
              "Claude Code",
              "MCP Servers",
              "Gemini 3",
              "SDD",
              "React",
              "Next.js",
              "TypeScript",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Outcomes Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className={`${cardClass} p-8 md:p-10`}>
          <TopAccent />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-40 w-2/3 -translate-x-1/2 rounded-full bg-antigravity/10 blur-[90px]"
          />
          <div className="relative text-center mb-8">
            <Eyebrow>Resultados</Eyebrow>
            <h4 className="text-xl md:text-2xl font-bold text-white/90 mt-3">
              Lo que vas a lograr
            </h4>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            {[
              { icon: Zap, text: "Orquestar agentes que escriben y verifican código por ti" },
              { icon: GraduationCap, text: "Certificación verificable en LinkedIn y portfolio" },
              { icon: TrendingUp, text: "Ventaja competitiva usando la última generación de IDEs agénticos" },
            ].map((o, i) => (
              <div
                key={o.text}
                className={`text-center md:px-6 ${
                  i > 0 ? "md:border-l md:border-white/10" : ""
                }`}
              >
                <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-antigravity-deep/30 bg-antigravity-deep/10">
                  <o.icon className="h-5 w-5 text-antigravity" />
                </span>
                <p className="text-sm text-white/60 max-w-[14rem] mx-auto">
                  {o.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inclusions Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Eyebrow>Inversión</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3">
            ¿Qué incluirá tu inscripción?
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inclusions.map((inc) => (
            <div
              key={inc.title}
              className={`${cardClass} p-6 flex items-start gap-4`}
            >
              <TopAccent />
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-antigravity-deep/30 bg-antigravity-deep/10 shrink-0">
                <inc.icon className="h-5 w-5 text-antigravity" />
              </span>
              <div>
                <h4 className="font-bold text-white/90 mb-1">{inc.title}</h4>
                <p className="text-sm text-white/60">{inc.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-20">
        <div className={`${cardClass} relative p-8 md:p-12 text-center`}>
          <TopAccent />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-48 w-3/4 -translate-x-1/2 rounded-full bg-antigravity/10 blur-[100px]"
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-antigravity-deep/40 bg-antigravity-deep/10 px-4 py-1.5 mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-antigravity opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-antigravity" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-antigravity-deep">
                Cupos limitados en la primera cohorte
              </span>
            </div>

            <h3 className="text-2xl md:text-4xl font-bold text-white/90 mb-4 leading-tight">
              No te quedes fuera de la{" "}
              <span className="text-antigravity">primera cohorte</span>
            </h3>
            <p className="text-white/55 max-w-xl mx-auto mb-8">
              Deja tu email y te avisamos apenas abramos inscripciones, con
              acceso prioritario y precio early bird para los primeros
              inscritos.
            </p>

            <a
              href="#email"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("email")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
                document.getElementById("email")?.focus();
              }}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-antigravity-deep to-antigravity px-10 py-5 text-xl font-bold text-white shadow-lg shadow-antigravity-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-antigravity/40 cursor-pointer"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
              <Mail className="h-6 w-6" />
              Unirme a la waitlist
              <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
