import { GraduationCap, Bot, Workflow, Handshake } from "lucide-react";
import {
  Eyebrow,
  cardClass,
  TopAccent,
} from "@/components/claude-brochure/primitives";
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
      <div className="text-center mb-12">
        <Eyebrow>Servicios</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-bold text-white/90 mt-3 mb-4">
          De la capacitación a la implementación
        </h2>
        <p className="text-white/50 max-w-xl mx-auto text-lg">
          Muchas empresas ya probaron la IA. Pocas la tienen funcionando en sus
          procesos. Trabajamos ese tramo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((s) => (
          <div key={s.title} className={`${cardClass} p-6 flex flex-col`}>
            <TopAccent />
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-accent-deep/30 bg-accent-deep/10 mb-5">
              <s.icon className="h-5 w-5 text-accent" />
            </span>
            <h3 className="text-lg font-bold text-white/90 leading-snug">
              {s.title}
            </h3>
            <p className="text-sm text-white/60 mt-2 flex-grow">{s.text}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {s.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/55"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
