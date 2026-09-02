import Link from "next/link";
import { ArrowRight, Terminal, Briefcase, Play } from "lucide-react";
import { cardClass, TopAccent } from "@/components/claude-brochure/primitives";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import { focusRing } from "@/components/ui/actions";

const programs = [
  {
    icon: Terminal,
    tag: "Equipos técnicos",
    title: "Certificación en Claude Code",
    text: "Programa intensivo para desarrolladores: agentes, flujos de trabajo con IA y buenas prácticas para llevar código a producción.",
    href: "/claude",
    cta: "Ver programa",
  },
  {
    icon: Briefcase,
    tag: "Equipos no técnicos",
    title: "Claude Code para no programadores",
    text: "Taller práctico para profesionales de negocio: tu propio asistente con IA leyendo archivos, armando reportes y enviando correos.",
    href: "/claude-no-programadores",
    cta: "Ver taller",
  },
  {
    icon: Play,
    tag: "A tu ritmo",
    title: "Catálogo de cursos",
    text: "Cursos grabados y proyectos reales para que cada persona del equipo avance a su ritmo, con certificado al terminar.",
    href: "/aprende",
    cta: "Explorar cursos",
  },
];

export default function Programs() {
  return (
    <Reveal id="programas" className="mb-24">
      <SectionHeader
        eyebrow="Programas abiertos"
        title="Formación lista para tu equipo"
      >
        Todos nuestros programas abiertos se dictan también en modalidad cerrada
        para empresas, adaptando el caso práctico a tus procesos.
      </SectionHeader>

      {/* Única sección con cards: son destinos navegables, y el halo ámbar del
          hover es la señal de que se puede entrar. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {programs.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className={`${cardClass} ${focusRing} group flex flex-col p-7 transition duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_20px_50px_-15px_rgba(238,192,72,0.35)]`}
          >
            <TopAccent />
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-accent-deep/30 bg-accent-deep/10">
                <p.icon className="h-5 w-5 text-accent" />
              </span>
              <span className="text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-deep">
                {p.tag}
              </span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-white/90 md:min-h-[3.5rem]">
              {p.title}
            </h3>
            <p className="flex-grow text-sm text-white/60">{p.text}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
              {p.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
