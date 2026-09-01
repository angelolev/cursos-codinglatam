import {
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Twitch,
  Mail,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { WhatsAppIcon } from "@/components/claude-brochure/primitives";
import { CONTACT_EMAIL, CONTACT_WHATSAPP_URL } from "@/components/home/constants";

const columns = [
  {
    title: "Empresas",
    links: [
      { label: "Servicios", href: "/#servicios" },
      { label: "Cómo trabajamos", href: "/#proceso" },
      { label: "Programas para equipos", href: "/#programas" },
      { label: "Contacto", href: "/#contacto" },
    ],
  },
  {
    title: "Formación",
    links: [
      { label: "Certificación Claude Code", href: "/claude" },
      { label: "Claude para no programadores", href: "/claude-no-programadores" },
      { label: "Cursos", href: "/cursos" },
      { label: "Workshops", href: "/workshops" },
      { label: "Proyectos", href: "/proyectos" },
      { label: "Guías", href: "/guias" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Acerca de", href: "/about" },
      { label: "Términos de uso", href: "/terms" },
      { label: "Política de privacidad", href: "/privacy" },
    ],
  },
];

const social = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/65901297", icon: Linkedin },
  { label: "GitHub", href: "https://github.com/Coding-Latam", icon: Github },
  { label: "YouTube", href: "https://youtube.com/@codinglatam", icon: Youtube },
  { label: "Instagram", href: "https://instagram.com/codinglatam", icon: Instagram },
  { label: "Twitch", href: "https://www.twitch.tv/codinglatam", icon: Twitch },
  { label: "Discord", href: "https://discord.gg/McZHP247Kv", icon: MessageCircle },
];

const linkClass =
  "text-sm text-white/50 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="relative mt-16 md:mt-24 border-t border-white/10 bg-black/30">
      {/* Línea de acento dorada, como el TopAccent de las tarjetas */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Marca + contacto */}
          <div>
            <Link href="/" className="inline-block" aria-label="Coding Latam">
              <Logo />
            </Link>
            <p className="mt-5 max-w-xs text-sm text-white/50">
              Capacitación e implementación de IA para empresas y equipos en
              Latinoamérica.
            </p>

            <div className="mt-6 space-y-2.5">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-primary-400" />
                {CONTACT_EMAIL}
              </a>
              <a
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4 text-primary-400" />
                Escríbenos por WhatsApp
              </a>
            </div>

            <div className="mt-6 flex gap-2">
              {social.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/50 transition-colors hover:border-primary-400/50 hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Columnas de enlaces */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                <span className="text-primary-400/60">{"// "}</span>
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClass}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Barra inferior */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Coding Latam · INNODESIGN E.I.R.L. Todos
            los derechos reservados.
          </p>
          <p>Hecho en Perú para toda Latinoamérica.</p>
        </div>
      </div>
    </footer>
  );
}
