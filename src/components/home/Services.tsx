import {
  GraduationCap,
  Bot,
  Workflow,
  Handshake,
  CheckCircle2,
} from "lucide-react";
import {
  Eyebrow,
  cardClass,
  TopAccent,
} from "@/components/claude-brochure/primitives";
import Reveal from "./Reveal";

const services = [
  {
    icon: GraduationCap,
    title: "Capacitación en IA para equipos",
    text: "Talleres in-company, en vivo, sobre los archivos y procesos reales de tu área. Desde equipos sin perfil técnico hasta desarrolladores.",
    bullets: [
      "Claude, ChatGPT y herramientas de IA aplicadas al trabajo diario",
      "Claude Code y agentes para equipos de desarrollo",
      "Programas a medida por área: operaciones, ventas, finanzas, TI",
    ],
  },
  {
    icon: Bot,
    title: "Agentes y asistentes a medida",
    text: "Diseñamos e implementamos asistentes que leen tus documentos, responden a tus clientes o preparan tus reportes, conectados a tus sistemas.",
    bullets: [
      "Asistentes internos sobre tu base de conocimiento",
      "Agentes conectados a correo, CRM, ERP y hojas de cálculo",
      "Evaluación y control de calidad de las respuestas",
    ],
  },
  {
    icon: Workflow,
    title: "Automatización de procesos",
    text: "Identificamos las tareas repetitivas que más tiempo consumen y las convertimos en flujos automáticos con IA en el medio.",
    bullets: [
      "Diagnóstico de procesos y priorización por impacto",
      "Integraciones con tus herramientas actuales",
      "Piloto medible antes de escalar",
    ],
  },
  {
    icon: Handshake,
    title: "Socio tecnológico continuo",
    text: "Un equipo técnico senior que acompaña a tu empresa mes a mes: roadmap de IA, decisiones de arquitectura y mentoría a tu equipo.",
    bullets: [
      "Roadmap de adopción de IA para el negocio",
      "Revisión técnica de proyectos y proveedores",
      "Mentoría continua a tu equipo interno",
    ],
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
        <p className="text-white/50 max-w-2xl mx-auto text-lg">
          La mayoría de empresas ya probó la IA. Pocas la tienen funcionando en
          sus procesos. Trabajamos ese tramo: el que va del &quot;ya lo usamos
          un poco&quot; al &quot;así operamos ahora&quot;.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.title} className={`${cardClass} p-7`}>
            <TopAccent />
            <div className="flex items-start gap-4 mb-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-accent-deep/30 bg-accent-deep/10">
                <s.icon className="h-5 w-5 text-accent" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white/90">{s.title}</h3>
                <p className="text-sm text-white/60 mt-1.5">{s.text}</p>
              </div>
            </div>
            <ul className="space-y-2 border-t border-white/10 pt-4">
              {s.bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 text-sm text-white/65"
                >
                  <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
