import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Clock,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import {
  Eyebrow,
  cardClass,
  TopAccent,
  WhatsAppIcon,
} from "@/components/claude-brochure/primitives";
import {
  CALENDAR_URL,
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_URL,
} from "./constants";
import Reveal from "./Reveal";
import { ctaPrimary, ctaSecondarySmall } from "@/components/ui/actions";

export default function ContactCTA() {
  return (
    <Reveal id="contacto" className="mb-24">
      <div
        className={`${cardClass} relative mx-auto max-w-4xl p-8 text-center md:p-14`}
      >
        <TopAccent />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-48 w-3/4 -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]"
        />
        <div className="relative">
          <Eyebrow>Empecemos</Eyebrow>
          <h2 className="mb-4 mt-3 text-balance text-2xl font-bold leading-tight text-white/90 md:text-4xl">
            Cuéntanos qué proceso quieres{" "}
            <span className="text-accent">potenciar con IA</span>
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-white/60">
            En una llamada de 30 minutos nuestro equipo revisa tu caso y te dice
            con honestidad si tiene sentido y por dónde empezar.
          </p>

          <div className="mb-5 flex justify-center">
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
          </div>

          <div className="mb-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaSecondarySmall}
            >
              <WhatsAppIcon className="h-4 w-4" />
              Escríbenos por WhatsApp
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                "Proyecto con IA para mi empresa",
              )}`}
              className={ctaSecondarySmall}
            >
              <Mail className="h-4 w-4" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
              <Clock className="h-3.5 w-3.5 text-accent" />
              30 minutos por Google Meet
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Sin compromiso
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
