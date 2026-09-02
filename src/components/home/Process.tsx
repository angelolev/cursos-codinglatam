import {
  Eyebrow,
  cardClass,
  TopAccent,
} from "@/components/claude-brochure/primitives";
import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Diagnóstico",
    text: "Una sesión con tu equipo para entender procesos, herramientas y dónde se pierde más tiempo. Salimos con oportunidades priorizadas por impacto.",
    dur: "1 semana",
  },
  {
    n: "02",
    title: "Piloto",
    text: "Elegimos un caso concreto y lo llevamos a funcionar de punta a punta con datos reales. Medimos antes y después.",
    dur: "2 a 4 semanas",
  },
  {
    n: "03",
    title: "Capacitación",
    text: "Formamos al equipo sobre ese mismo caso para que lo opere, lo adapte y lo replique en otros procesos.",
    dur: "Sesiones en vivo",
  },
  {
    n: "04",
    title: "Escala",
    text: "Extendemos lo que funcionó a otras áreas y acompañamos como socio técnico mientras el equipo gana autonomía.",
    dur: "Continuo",
  },
];

export default function Process() {
  return (
    <Reveal id="proceso" className="mb-24">
      <div className="mb-12">
        <Eyebrow>Cómo trabajamos</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-bold text-white/90 mt-3 mb-4">
          Un caso real primero, la teoría después
        </h2>
        <p className="text-white/50 max-w-2xl text-lg">
          No empezamos por una charla sobre el futuro de la IA. Empezamos por un
          proceso tuyo que hoy duele, lo resolvemos y sobre eso formamos al
          equipo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s) => (
          <div key={s.n} className={`${cardClass} p-6`}>
            <TopAccent />
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-4xl font-bold text-accent/30">{s.n}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                {s.dur}
              </span>
            </div>
            <h3 className="font-bold text-white/90 mb-2">{s.title}</h3>
            <p className="text-sm text-white/60">{s.text}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
