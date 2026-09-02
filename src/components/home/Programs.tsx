import Link from "next/link";
import { ArrowRight, Terminal, Briefcase, Play } from "lucide-react";
import {
  Eyebrow,
  cardClass,
  TopAccent,
} from "@/components/claude-brochure/primitives";
import Reveal from "./Reveal";

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
      <div className="text-center mb-12">
        <Eyebrow>Programas abiertos</Eyebrow>
        <h2 className="text-3xl md:text-4xl font-bold text-white/90 mt-3 mb-4">
          Formación lista para tu equipo
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto text-lg">
          Todos nuestros programas abiertos se dictan también en modalidad
          cerrada para empresas, adaptando el caso práctico a tus procesos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {programs.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className={`${cardClass} group p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_16px_50px_-12px_rgba(236,176,51,0.4)]`}
          >
            <TopAccent />
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-accent-deep/30 bg-accent-deep/10">
                <p.icon className="h-5 w-5 text-accent" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-deep">
                {p.tag}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white/90 mb-2">{p.title}</h3>
            <p className="text-sm text-white/60 flex-grow">{p.text}</p>
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
