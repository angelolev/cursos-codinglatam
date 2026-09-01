import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, Clock, ShieldCheck } from "lucide-react";
import {
  Eyebrow,
  cardClass,
  TopAccent,
  WhatsAppIcon,
} from "@/components/claude-brochure/primitives";
import angeloImage from "@/assets/angelo.jpeg";
import { CONTACT_EMAIL, CONTACT_WHATSAPP_URL } from "./constants";
import Reveal from "./Reveal";

const tags = [
  "Claude y Claude Code",
  "Agentes",
  "Automatización",
  "Next.js · TypeScript",
  "Capacitación in-company",
];

export default function ContactCTA() {
  return (
    <Reveal id="contacto" className="mb-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 items-stretch">
        {/* Quién está detrás */}
        <div className={`${cardClass} p-8`}>
          <TopAccent />
          <Eyebrow>Quién te acompaña</Eyebrow>
          <div className="flex items-center gap-5 mt-5 mb-5">
            <Image
              src={angeloImage}
              alt="Angelo Leva"
              width={72}
              height={72}
              className="w-[72px] h-[72px] rounded-full object-cover border border-white/10 shrink-0"
            />
            <div>
              <h3 className="text-xl font-bold text-white/90">Angelo Leva</h3>
              <p className="text-accent text-sm mt-0.5">
                Senior Software Engineer · Founder, Coding Latam
              </p>
            </div>
          </div>
          <p className="text-sm text-white/60">
            Ingeniero de software desde 2016, especializado en IA aplicada y
            automatización de procesos. Ha formado a equipos de más de veinte
            empresas en Latinoamérica y organiza la comunidad GDG Tacna. Cada
            proyecto lo lidera él, con un equipo senior detrás.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`${cardClass} relative p-8 md:p-12 text-center flex flex-col justify-center`}
        >
          <TopAccent />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-48 w-3/4 -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]"
          />
          <div className="relative">
            <Eyebrow>Empecemos</Eyebrow>
            <h2 className="text-2xl md:text-4xl font-bold text-white/90 mt-3 mb-4 leading-tight">
              Cuéntanos qué proceso quieres{" "}
              <span className="text-accent">potenciar con IA</span>
            </h2>
            <p className="text-white/55 max-w-md mx-auto mb-8">
              En una llamada de 30 minutos revisamos tu caso y te decimos con
              honestidad si tiene sentido y por dónde empezar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Link
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-accent-deep to-accent px-8 py-4 text-base font-bold text-zinc-950 shadow-lg shadow-accent-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-accent/40"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
                <WhatsAppIcon className="h-5 w-5" />
                Agendar una llamada
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  "Proyecto con IA para mi empresa",
                )}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white/80 transition-colors hover:border-accent/50 hover:text-white"
              >
                <Mail className="h-4 w-4 text-accent" />
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
                <Clock className="h-3.5 w-3.5 text-accent" />
                Respuesta en menos de 24 horas
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                Sin compromiso
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
