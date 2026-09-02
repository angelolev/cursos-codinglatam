import { GraduationCap, Bot, Workflow, Handshake } from "lucide-react";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const services = [
  {
    icon: GraduationCap,
    title: "Capacitación en IA",
    text: "Talleres in-company sobre los procesos reales de tu equipo, técnico o no.",
    tags: ["Claude", "ChatGPT", "Claude Code", "Por área"],
  },
  {
    icon: Bot,
    title: "Agentes a medida",
    text: "Asistentes que leen tus documentos, atienden clientes y preparan reportes.",
    tags: ["Base de conocimiento", "CRM · ERP", "Correo"],
  },
  {
    icon: Workflow,
    title: "Automatización",
    text: "Convertimos las tareas repetitivas que más tiempo consumen en flujos con IA.",
    tags: ["Diagnóstico", "Integraciones", "Piloto medible"],
  },
  {
    icon: Handshake,
    title: "Socio tecnológico",
    text: "Un equipo senior que acompaña a tu empresa mes a mes.",
    tags: ["Roadmap de IA", "Revisión técnica", "Mentoría"],
  },
];

export default function Services() {
  return (
    <Reveal id="servicios" className="mb-24">
      <SectionHeader
        eyebrow="Servicios"
        title="De la capacitación a la implementación"
      >
        Muchas empresas ya probaron la IA. Pocas la tienen funcionando en sus
        procesos. Trabajamos ese tramo.
      </SectionHeader>

      {/* Columnas separadas por hairline, sin caja: la oferta es una lista
          paralela, no cuatro destinos. Las cards se reservan a Programas. */}
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <div
            key={s.title}
            className={i > 0 ? "lg:border-l lg:border-white/10 lg:pl-8" : ""}
          >
            <s.icon className="h-6 w-6 text-accent" />
            <h3 className="mt-5 text-lg font-bold leading-snug text-white/90">
              {s.title}
            </h3>
            <p className="mt-2 text-sm text-white/60">{s.text}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {s.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-white/60"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
