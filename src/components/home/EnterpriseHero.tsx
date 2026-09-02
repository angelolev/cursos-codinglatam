import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import {
  Eyebrow,
  TerminalSnippet,
  WhatsAppIcon,
} from "@/components/claude-brochure/primitives";
import { CALENDAR_URL, CONTACT_WHATSAPP_URL } from "./constants";
import { ctaPrimary, ctaSecondary, focusRing } from "@/components/ui/actions";

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

      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <Eyebrow>IA aplicada para empresas y equipos</Eyebrow>

          <h1 className="mb-6 mt-5 text-balance text-4xl font-bold leading-[1.1] text-white/90 md:text-5xl">
            La IA ya está en tu empresa.{" "}
            <span className="text-accent">Falta que trabaje para ella.</span>
          </h1>

          <p className="mb-10 max-w-xl text-lg text-white/60 md:text-xl">
            Tu equipo ya usa chats de IA por su cuenta. Nosotros tomamos los
            procesos que hoy le cuestan horas, los resolvemos con agentes y
            automatizaciones, y formamos al equipo para que los opere. Con
            resultados medidos antes de escalar.
          </p>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaPrimary}
            >
              <CalendarDays className="h-5 w-5" />
              Agendar una llamada
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="#servicios" className={ctaSecondary}>
              Ver cómo trabajamos
            </Link>
          </div>

          <p className="text-sm text-white/55">
            30 minutos, sin compromiso. ¿Prefieres escribir?{" "}
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-sm font-semibold text-white/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/50 ${focusRing}`}
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              Escríbenos por WhatsApp
            </a>
          </p>
        </div>

        <TerminalSnippet
          className="lg:max-w-none"
          title="claude — equipo de operaciones"
          command="claude"
          prompt="Lee los tickets de soporte de esta semana y prepara el reporte para gerencia"
          result="reporte-semanal.pdf generado — 3 temas críticos detectados"
        />
      </div>
    </div>
  );
}
