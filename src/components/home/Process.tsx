import SectionHeader from "./SectionHeader";
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
      <SectionHeader
        eyebrow="Cómo trabajamos"
        title="Un caso real primero, la teoría después"
      >
        No empezamos por una charla sobre el futuro de la IA. Empezamos por un
        proceso tuyo que hoy duele, lo resolvemos y sobre eso formamos al equipo.
      </SectionHeader>

      <ol className="relative grid gap-y-10 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
        {/* Riel que une los cuatro pasos: vertical en móvil, horizontal desde
            lg. Se apaga hacia el final porque la etapa de escala es continua. */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-accent/50 via-white/15 to-transparent lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-px lg:w-auto lg:bg-gradient-to-r"
        />

        {steps.map((s) => (
          <li key={s.n} className="relative pl-8 lg:pl-0 lg:pr-8">
            <span
              aria-hidden
              className="absolute left-0 top-px flex h-3.5 w-3.5 items-center justify-center rounded-full border border-accent/60 bg-[#161616] lg:static lg:mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>

            <p className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
              <span className="text-accent-deep tabular-nums">{s.n}</span>
              <span className="text-white/25">·</span>
              <span className="text-white/50">{s.dur}</span>
            </p>
            <h3 className="mt-3 text-lg font-bold text-white/90">{s.title}</h3>
            <p className="mt-2 text-sm text-white/60">{s.text}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
