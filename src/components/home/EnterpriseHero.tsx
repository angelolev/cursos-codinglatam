import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Bot,
  GraduationCap,
  Handshake,
} from "lucide-react";
import {
  TerminalSnippet,
  WhatsAppIcon,
} from "@/components/claude-brochure/primitives";
import { CONTACT_WHATSAPP_URL } from "./constants";

const pillars = [
  {
    icon: GraduationCap,
    title: "Capacitación",
    text: "Talleres in-company sobre casos reales de tu equipo.",
  },
  {
    icon: Bot,
    title: "Implementación",
    text: "Agentes y automatizaciones integrados a tus procesos.",
  },
  {
    icon: Handshake,
    title: "Acompañamiento",
    text: "Un socio técnico que se queda hasta que el equipo lo domina.",
  },
];

const stats = [
  { value: "+20", label: "Empresas" },
  { value: "+1,000", label: "Profesionales formados" },
  { value: "2016", label: "Construyendo software" },
];

export default function EnterpriseHero() {
  return (
    <div className="relative mb-24">
      {/* Atmósfera: glow dorado + grilla técnica */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-8rem] -z-10 h-[30rem] w-[46rem] max-w-[110vw] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-6rem] -z-10 h-[28rem] opacity-[0.12] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-deep/40 bg-accent-deep/10 px-4 py-1.5 mb-8">
            <Building2 className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-deep">
              IA aplicada para empresas y equipos
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white/90 mb-6 leading-[1.08]">
            La IA ya está en tu empresa.{" "}
            <span className="text-accent underline decoration-accent-deep/50 decoration-2 underline-offset-[10px] drop-shadow-[0_0_30px_rgba(236,176,51,0.35)]">
              Falta que trabaje para ella.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-xl mb-10">
            Tu equipo ya usa chats de IA por su cuenta. Nosotros tomamos los
            procesos que hoy le cuestan horas, los resolvemos con agentes y
            automatizaciones, y formamos al equipo para que los opere. Con
            resultados medidos antes de escalar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
            <Link
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-accent-deep to-accent px-7 py-4 text-base font-bold text-zinc-950 shadow-lg shadow-accent-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-accent/40"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
              <WhatsAppIcon className="h-5 w-5" />
              Hablemos de tu proyecto
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-7 py-4 text-base font-semibold text-white/80 transition-colors hover:border-accent/50 hover:text-white"
            >
              Ver cómo trabajamos
            </Link>
          </div>

          {/* Stats */}
          <div className="flex">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`pr-6 sm:pr-10 ${
                  i > 0 ? "pl-6 sm:pl-10 border-l border-white/10" : ""
                }`}
              >
                <div className="text-2xl sm:text-3xl font-bold text-accent drop-shadow-[0_0_20px_rgba(236,176,51,0.25)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <TerminalSnippet
            title="claude — equipo de operaciones"
            command="claude"
            prompt="Lee los tickets de soporte de esta semana y prepara el reporte para gerencia"
            result="reporte-semanal.pdf generado — 3 temas críticos detectados"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent-deep/30 bg-accent-deep/10">
                  <p.icon className="h-4 w-4 text-accent" />
                </span>
                <div>
                  <div className="text-sm font-bold text-white/90">
                    {p.title}
                  </div>
                  <p className="text-xs text-white/55 mt-0.5">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
