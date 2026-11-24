"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Video,
  BadgeCheck,
  Users,
  MessageCircle,
  Code2,
  RefreshCw,
  AlertTriangle,
  CalendarDays,
  Clock,
  Rocket,
  SquareTerminal,
  PanelsTopLeft,
  AppWindow,
  Cloud,
} from "lucide-react";
import { WaitlistAvatar } from "@/types/waitlist";
import {
  Eyebrow,
  cardClass,
  TopAccent,
  TerminalSnippet,
  LinkedInIcon,
  PEFlag,
  COFlag,
  ECFlag,
  MXFlag,
  ARFlag,
  CLFlag,
  useScrollReveal,
} from "@/components/claude-brochure";
import angeloImage from "@/assets/angelo.jpeg";
import yapeImage from "@/assets/yape.svg";
import plinImage from "@/assets/plin.svg";
import yapeQR from "@/assets/yape-qr.jpeg";

// Misma estructura que /claude, con acento azul propio vía --accent /
// --accent-deep (las primitivas de claude-brochure leen esos tokens).
const ACCENT_VARS =
  "[--accent:#7c9cff] [--accent-deep:#5b7cfa]";
const GLOW = "rgba(124,156,255,0.35)";

const CONTACTO_WHATSAPP = "+51 964225808";
const CONTACTO_WHATSAPP_URL =
  "https://wa.me/51964225808?text=" +
  encodeURIComponent(
    "Hola, quiero inscribirme al curso Codex para programadores (inicia el 12 de enero)."
  );
// TODO: reemplazar por el link de Mercado Pago del curso de Codex. Mientras
// tanto el CTA lleva a WhatsApp para no cobrar con el link de otro curso.
const CHECKOUT_URL = CONTACTO_WHATSAPP_URL;

const FECHA_INICIO = "12 de enero";
const FECHA_FIN = "4 de febrero de 2027";
const FECHAS_SESIONES = "Enero 12, 14, 19, 21, 26 y 28 · Febrero 2 y 4";
const FRECUENCIA = "Martes y jueves · 4 semanas";
const HORARIO_CURSO = "8:00 – 10:00 PM (hora Perú)";

// Precios fijos en soles peruanos (PEN)
const REGULAR_PRICE_PEN = "S/ 499";
const EARLY_BIRD_PRICE_PEN = "S/ 399";
const DESCUENTO = "20% off";

const MOBILE_BAR_BENEFITS: { icon: typeof CheckCircle2; label: string }[] = [
  { icon: Video, label: "8 clases en vivo" },
  { icon: Code2, label: "100% práctico" },
  { icon: Video, label: "Grabaciones de por vida" },
  { icon: BadgeCheck, label: "Certificado" },
];

// 8:00 – 10:00 PM hora Perú en cada país. Enero–febrero: Chile está en
// horario de verano (UTC-3), igual que Argentina.
const HORARIOS_PAIS = [
  {
    flags: [PEFlag, COFlag, ECFlag],
    cities: "Lima, Bogotá, Quito",
    time: "8:00 – 10:00 PM",
  },
  { flags: [MXFlag], cities: "Ciudad de México", time: "7:00 – 9:00 PM" },
  {
    flags: [ARFlag, CLFlag],
    cities: "Buenos Aires, Santiago",
    time: "10:00 PM – 12:00 AM",
  },
];

const SIDEBAR_BENEFITS = [
  "8 clases en vivo, 16 horas 100% prácticas",
  "Proyecto final completo para tu portafolio",
  "Grabaciones de por vida",
  "Certificación verificable para LinkedIn",
  "Comunidad privada de alumnos y egresados",
];

// Renderiza `texto entre backticks` como código inline.
function InlineCode({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[0.85em] text-white/85"
          >
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

const CTA_CLASS =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-accent-deep to-accent px-10 py-5 text-xl font-bold text-white shadow-lg shadow-accent-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-accent/40 cursor-pointer";

function Shine() {
  return (
    <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
  );
}

function LiveBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-accent-deep/40 bg-accent-deep/10 px-4 py-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-deep">
        {children}
      </span>
    </div>
  );
}

function WhatsAppLink() {
  return (
    <a
      href={CONTACTO_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline decoration-accent-deep/50 underline-offset-4 hover:text-accent-deep"
    >
      {CONTACTO_WHATSAPP}
    </a>
  );
}

// Programa: 8 clases en 4 semanas, martes y jueves.
const PROGRAM = [
  {
    week: "Semana 1",
    title: "Fundamentos",
    classes: [
      {
        n: 1,
        day: "Martes",
        title: "Setup y primer flujo completo",
        items: [
          "Cómo trabaja Codex: loop agéntico, sandbox y aprobaciones",
          "Instalación en vivo: CLI, extensión para VS Code / Cursor y app",
          "Login con tu cuenta de ChatGPT vs API key",
          "Explorar un codebase nuevo y hacer tu primer fix",
          "Commits, ramas y pull requests con Codex desde el día uno",
        ],
      },
      {
        n: 2,
        day: "Jueves",
        title: "Contexto, instrucciones y configuración",
        items: [
          "`AGENTS.md` global, de repositorio y por carpeta",
          "`/init` para generar instrucciones a partir de tu proyecto",
          "Context window: `/status`, `/compact` y cuándo empezar de cero",
          "Sesiones: retomar trabajo con `codex resume`",
          "`config.toml` y profiles para cada tipo de proyecto",
        ],
      },
    ],
  },
  {
    week: "Semana 2",
    title: "Flujo profesional",
    classes: [
      {
        n: 3,
        day: "Martes",
        title: "Sandbox, aprobaciones y buenas prácticas",
        items: [
          "Modos de sandbox: read-only, workspace-write y full access",
          "Políticas de aprobación: cuándo Codex te pide permiso",
          "Modelos y nivel de razonamiento con `/model` según la tarea",
          "Prompts efectivos: contexto rico, imágenes y `@archivos`",
          "Debugging, refactor, tests y `/review` antes de commitear",
        ],
      },
      {
        n: 4,
        day: "Jueves",
        title: "MCP Servers: conecta Codex con tus herramientas",
        items: [
          "Qué es MCP y cuándo conviene (y cuándo basta una CLI)",
          "`codex mcp add`: servidores locales (stdio) y remotos (HTTP)",
          "Figma MCP: del diseño a componentes con contexto real",
          "Docs MCP: documentación actualizada de tus librerías",
          "Chrome DevTools MCP: testing E2E de tus flujos en el navegador",
        ],
      },
    ],
  },
  {
    week: "Semana 3",
    title: "Extiende y automatiza",
    classes: [
      {
        n: 5,
        day: "Martes",
        title: "Skills y rules",
        items: [
          "Agent Skills: `SKILL.md`, frontmatter y archivos de soporte",
          "Skills de usuario y de repositorio para tu equipo",
          "Invocar skills explícitamente o dejar que Codex las elija",
          "Rules: qué comandos puede correr Codex sin preguntar",
        ],
      },
      {
        n: 6,
        day: "Jueves",
        title: "Codex sin interfaz: `exec` y SDK",
        items: [
          "`codex exec`: Codex en scripts y tareas no interactivas",
          "Salida estructurada con JSON schema para encadenar pasos",
          "Codex SDK: integra el agente en tus propias herramientas",
          "Patrones seguros: sandbox, timeouts y límites de costo",
        ],
      },
    ],
  },
  {
    week: "Semana 4",
    title: "Escala con la nube",
    classes: [
      {
        n: 7,
        day: "Martes",
        title: "Trabajo en paralelo: app y Codex cloud",
        items: [
          "Codex cloud: tareas en entornos remotos mientras sigues codeando",
          "Configurar entornos: dependencias, setup scripts e internet",
          "Varias versiones de una tarea y elegir la mejor",
          "App de Codex: threads en paralelo con worktrees",
          "Del editor a la nube y de vuelta: aplicar diffs en local",
        ],
      },
      {
        n: 8,
        day: "Jueves",
        title: "Codex + GitHub",
        items: [
          "Conectar Codex a tus repositorios de GitHub",
          "`@codex review`: code review automático en cada PR",
          "Reglas de review y estándares del equipo en `AGENTS.md`",
          "Codex en GitHub Actions para tareas en CI",
          "Secrets, permisos y control de costos",
          "Cierre: presentación del proyecto final",
        ],
      },
    ],
  },
];

// Superficies donde corre Codex — todas entran en el curso.
const SURFACES = [
  {
    icon: SquareTerminal,
    title: "Codex CLI",
    text: "El agente en tu terminal, open source. Lee tu repo, edita archivos y corre comandos dentro de un sandbox.",
  },
  {
    icon: PanelsTopLeft,
    title: "Extensión para IDE",
    text: "Codex al lado de tu código en VS Code, Cursor y Windsurf, con el contexto del archivo que tienes abierto.",
  },
  {
    icon: AppWindow,
    title: "App de Codex",
    text: "Varios agentes trabajando en paralelo, cada uno en su worktree, con revisión de diffs en un solo lugar.",
  },
  {
    icon: Cloud,
    title: "Codex cloud",
    text: "Delegas tareas que corren en entornos remotos y vuelven como pull requests listos para revisar.",
  },
];

const DIFERENCIALES = [
  {
    n: "01",
    title: "Todo el ecosistema Codex",
    text: "No solo la CLI: terminal, editor, app, nube y GitHub. Aprendes cuándo conviene cada una y cómo combinarlas.",
  },
  {
    n: "02",
    title: "Temario siempre al día",
    text: "Construido sobre la documentación oficial y actualizado con cada release. Si Codex cambia, tu material también.",
  },
  {
    n: "03",
    title: "Instructor activo en producción",
    text: "Angelo usa agentes de código todos los días en proyectos reales, no solo en demos. Te enseña lo que funciona en el trabajo.",
  },
  {
    n: "04",
    title: "Habilidades que se transfieren",
    text: "AGENTS.md, MCP y Agent Skills son estándares abiertos: lo que construyes también sirve con otros agentes.",
  },
  {
    n: "05",
    title: "Proyecto real de portafolio",
    text: "Terminas con un proyecto con tests E2E, code review automático y CI en GitHub, listo para mostrar.",
  },
  {
    n: "06",
    title: "En español, pensado para LatAm",
    text: "Clases en vivo en horario de Perú, ejemplos con el stack que usas y una comunidad que habla tu idioma.",
  },
];

const METHODOLOGY = [
  {
    n: "01",
    title: "Learning by Doing",
    text: "Cada clase incluye ejercicios prácticos. Resuelves problemas concretos, no ves slides pasivamente.",
  },
  {
    n: "02",
    title: "Progresivo y guiado",
    text: "De la instalación a la automatización en CI. Cada semana construye sobre la anterior con complejidad creciente.",
  },
  {
    n: "03",
    title: "Proyecto real",
    text: "Construirás un proyecto completo que demuestra tus habilidades y que impresiona a empleadores.",
  },
];

const INCLUSIONS = [
  {
    icon: Video,
    title: "Grabaciones de por vida",
    text: "Acceso permanente a las grabaciones de todas las clases para repasar cuando quieras",
  },
  {
    icon: BadgeCheck,
    title: "Certificación verificable",
    text: "Badge para LinkedIn que valida tus habilidades con Codex",
  },
  {
    icon: Users,
    title: "Comunidad privada",
    text: "Acceso al grupo exclusivo de alumnos y egresados para networking y soporte",
  },
  {
    icon: MessageCircle,
    title: "Mentoría en vivo",
    text: "Resuelve dudas en tiempo real durante cada clase con el instructor",
  },
  {
    icon: Code2,
    title: "Proyectos prácticos",
    text: "Cada clase incluye ejercicios reales que suman a tu portafolio profesional",
  },
  {
    icon: RefreshCw,
    title: "Actualizaciones incluidas",
    text: "Acceso a futuras actualizaciones del contenido sin costo adicional",
  },
];

// Testimonios de alumnos de Coding Latam (mismas capturas que /claude).
const TESTIMONIALS: { image: string; href: string; height: number }[] = [
  {
    image: "/testimonios/testimonio-01.png",
    href: "https://www.linkedin.com/feed/update/urn:li:share:7465867780463001600/",
    height: 535,
  },
  {
    image: "/testimonios/testimonio-02.png",
    href: "https://www.linkedin.com/feed/update/urn:li:share:7447303531075764224/",
    height: 535,
  },
  {
    image: "/testimonios/testimonio-03.png",
    href: "https://www.linkedin.com/feed/update/urn:li:share:7445646280707604480/",
    height: 598,
  },
  {
    image: "/testimonios/testimonio-04.png",
    href: "https://www.linkedin.com/feed/update/urn:li:share:7446270449925124096/",
    height: 535,
  },
];

export default function CodexPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  useScrollReveal(contentRef);

  const [avatars, setAvatars] = useState<WaitlistAvatar[]>([]);
  const [avatarsLoading, setAvatarsLoading] = useState(true);
  const [certCount, setCertCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAvatars() {
      try {
        const response = await fetch("/api/users/random");
        const data = await response.json();
        if (data.users && data.users.length >= 3) {
          setAvatars(data.users.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load avatars:", error);
      } finally {
        setAvatarsLoading(false);
      }
    }
    fetchAvatars();
  }, []);

  useEffect(() => {
    async function fetchCertCount() {
      try {
        const response = await fetch("/api/certificates/count");
        const data = await response.json();
        if (typeof data.count === "number") {
          setCertCount(data.count);
        }
      } catch (error) {
        console.error("Failed to load certificate count:", error);
      }
    }
    fetchCertCount();
  }, []);

  return (
    <main
      className={`${ACCENT_VARS} pt-24 pb-52 sm:pb-28 xl:pb-16 mx-auto w-full max-w-7xl sm:px-6 px-4 lg:px-0 xl:grid xl:grid-cols-[1fr_360px] xl:gap-8 xl:items-start flex-grow min-w-0`}
    >
      <div ref={contentRef} className="xl:min-w-0">
        {/* Hero Section */}
        <div className="relative text-center mb-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-6rem] -z-10 h-[28rem] w-[42rem] max-w-[110vw] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[-6rem] -z-10 h-[26rem] opacity-[0.12] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          <div className="mb-8">
            <LiveBadge>Inscripciones abiertas · Inicia el {FECHA_INICIO}</LiveBadge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white/90 mb-6 leading-[1.1]">
            <span
              className="text-accent underline decoration-accent-deep/50 decoration-2 underline-offset-[10px]"
              style={{ filter: `drop-shadow(0 0 30px ${GLOW})` }}
            >
              Codex
            </span>
            <br />
            para programadores
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-6">
            Domina <strong className="text-accent">Codex</strong>, el agente de
            programación de OpenAI, y aprende a delegar, revisar y automatizar
            trabajo real desde la terminal, tu editor y la nube.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {[
              `Inicia el ${FECHA_INICIO}`,
              "Martes y jueves · 8–10 PM (Perú)",
              "Certificación incluida",
            ].map((p) => (
              <span
                key={p}
                className="rounded-full border border-accent/40 px-4 py-1.5 text-xs font-semibold text-accent"
              >
                {p}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-y-6 mb-12">
            {[
              { value: "8", label: "Clases en vivo" },
              { value: "4", label: "Semanas" },
              { value: "16h", label: "De clase" },
              { value: "100%", label: "Práctico" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`px-6 sm:px-8 text-center ${i % 2 === 1 ? "border-l border-white/10" : ""
                  } ${i === 2 ? "sm:border-l sm:border-white/10" : ""}`}
              >
                <div className="text-3xl sm:text-4xl font-bold text-accent">
                  {stat.value}
                </div>
                <div className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <TerminalSnippet
            title="codex — zsh"
            command="codex"
            prompt="Arregla el test que falla y abre el PR"
            result="PR abierto — @codex review sin observaciones"
          />
        </div>

        {/* Dónde trabaja Codex */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <Eyebrow>Un agente, cuatro superficies</Eyebrow>
            <h2 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Codex donde ya trabajas
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              El mismo agente y la misma configuración en la terminal, el
              editor, el escritorio y la nube. En el curso usas las cuatro.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SURFACES.map((s) => (
              <div
                key={s.title}
                className={`${cardClass} group p-6 flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40`}
              >
                <TopAccent />
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-accent-deep/30 bg-accent-deep/10 shrink-0">
                  <s.icon className="h-5 w-5 text-accent" />
                </span>
                <div>
                  <h3 className="font-bold text-white/90 mb-1">{s.title}</h3>
                  <p className="text-sm text-white/60">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] text-white/30">
            Codex y ChatGPT son marcas de OpenAI. Coding Latam es un programa
            independiente.
          </p>
        </div>

        {/* Testimonios */}
        <div className="relative mb-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-72 w-[80%] max-w-4xl rounded-full bg-accent/10 blur-[100px]"
          />
          <div className="relative max-w-4xl mx-auto text-center mb-12 px-4">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-16 left-0 select-none font-bold leading-none text-accent/[0.07] text-[10rem] sm:text-[13rem]"
            >
              &ldquo;
            </span>
            <Eyebrow>Testimonios</Eyebrow>
            <h3 className="relative text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Lo que dicen nuestros alumnos
            </h3>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0a66c2]/30 bg-[#0a66c2]/10 px-3.5 py-1.5">
              <LinkedInIcon className="h-3.5 w-3.5 text-[#0a66c2]" />
              <span className="text-xs font-medium text-white/60">
                Egresados de los cursos de agentes de Coding Latam
              </span>
            </span>
          </div>

          <div
            className="group relative overflow-hidden rounded-xl"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            }}
          >
            <div className="flex w-max gap-6 py-3 animate-testimonial-marquee group-hover:[animation-play-state:paused]">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => {
                const isClone = i >= TESTIMONIALS.length;
                const n = (i % TESTIMONIALS.length) + 1;
                return (
                  <figure
                    key={i}
                    aria-hidden={isClone}
                    className="group/card relative flex w-[86vw] max-w-[460px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
                  >
                    <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-accent/80 via-accent/20 to-transparent transition-opacity duration-300 group-hover/card:via-accent/60" />
                    <figcaption className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-2.5">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      </span>
                      <span className="ml-1 truncate text-xs text-white/40">
                        testimonio-0{n}.md
                      </span>
                      <LinkedInIcon className="ml-auto h-3.5 w-3.5 text-[#0a66c2]/70 transition-colors duration-300 group-hover/card:text-[#0a66c2]" />
                    </figcaption>
                    <a
                      href={t.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isClone ? -1 : undefined}
                      aria-label={`Ver testimonio de alumno en LinkedIn ${n}`}
                    >
                      <Image
                        src={t.image}
                        alt={`Testimonio de alumno en LinkedIn ${n}`}
                        width={460}
                        height={t.height}
                        className="block h-auto w-full bg-[#f3f2ef]"
                        loading="lazy"
                      />
                    </a>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>

        {/* ¿Por qué nosotros? */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <Eyebrow>¿Por qué nosotros?</Eyebrow>
            <h2 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Lo que hace diferente a este curso
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DIFERENCIALES.map((d) => (
              <div
                key={d.n}
                className={`${cardClass} group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40`}
              >
                <TopAccent />
                <div className="text-2xl font-bold text-accent/40 mb-3 transition-colors duration-300 group-hover:text-accent/70">
                  {d.n}
                </div>
                <h3 className="font-bold text-white/90 mb-1.5">{d.title}</h3>
                <p className="text-sm text-white/60">{d.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requisitos */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <Eyebrow>Requisitos</Eyebrow>
            <h2 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              ¿Qué necesitas para empezar?
            </h2>
          </div>
          <div className={`${cardClass} p-8`}>
            <TopAccent />
            <p className="text-white/60 mb-6">
              Solo necesitas{" "}
              <strong className="text-white/90">
                saber programar en algún lenguaje
              </strong>{" "}
              (Python, JavaScript, Java, etc.) y{" "}
              <strong className="text-white/90">manejar Git a nivel básico</strong>
              . No importa si nunca usaste herramientas de IA: arrancamos desde
              cero con Codex y al final vas a poder delegar tareas completas y
              revisarlas con criterio.
            </p>
            <div className="border-t border-white/10 pt-5 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-white/60">
                Cada alumno debe contar con su propio plan de ChatGPT que
                incluya Codex. Como mínimo el{" "}
                <strong className="text-white/90">plan Plus ($20 USD/mes)</strong>
                . Este costo corre por cuenta del estudiante y no está incluido
                en la inscripción.
              </p>
            </div>
          </div>
        </div>

        {/* Metodología */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <Eyebrow>Metodología</Eyebrow>
            <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Nuestra propuesta de aprendizaje
            </h3>
            <p className="text-white/50 max-w-2xl mx-auto">
              No es teoría. Es construir proyectos reales supervisado por
              instructores en vivo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {METHODOLOGY.map((m) => (
              <div key={m.n} className={`${cardClass} p-6`}>
                <TopAccent />
                <div className="text-4xl font-bold text-accent/30 mb-3">
                  {m.n}
                </div>
                <h4 className="font-bold text-white/90 mb-2">{m.title}</h4>
                <p className="text-sm text-white/60">{m.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inversión */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center mb-10">
            <Eyebrow>Inversión</Eyebrow>
            <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Invierte en tu carrera
            </h3>
            <p className="text-white/50 max-w-2xl mx-auto">
              Una inversión que se paga sola con el primer mes de mejor
              productividad.
            </p>
          </div>
          <div className={`${cardClass} p-7 sm:p-8`}>
            <TopAccent />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-center">
              <div>
                <span className="inline-flex rounded-full border border-terminal-green/40 bg-terminal-green/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-terminal-green">
                  Early Bird — {DESCUENTO}
                </span>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-5xl sm:text-6xl font-bold text-white">
                    {EARLY_BIRD_PRICE_PEN}
                  </span>
                  <span className="text-xl text-white/40 line-through">
                    {REGULAR_PRICE_PEN}
                  </span>
                </div>
                <p className="mt-2 text-xs text-white/40">
                  PEN · Precio de lanzamiento
                </p>
              </div>
              <dl className="text-sm border-t border-white/10">
                {[
                  ["Inicio", `Martes ${FECHA_INICIO}`],
                  ["Fin", `Jueves ${FECHA_FIN}`],
                  ["Formato", "8 clases en vivo"],
                  ["Horario", "Mar y Jue, 8–10 PM"],
                  ["Zona horaria", "Hora Perú (GMT-5)"],
                  ["Duración", "4 semanas"],
                  ["Grabaciones", "Acceso de por vida"],
                  ["Certificación", "Badge verificable"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5"
                  >
                    <dt className="text-[10px] uppercase tracking-[0.15em] text-white/40 shrink-0">
                      {k}
                    </dt>
                    <dd className="text-right text-xs sm:text-sm font-semibold text-white/80">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-accent-deep/40 bg-accent-deep/5 p-4">
              <CalendarDays className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-white/70">
                <strong className="text-white/90">Fechas de las clases:</strong>{" "}
                {FECHAS_SESIONES}.
              </p>
            </div>
          </div>
        </div>

        {/* Checkout CTA */}
        <div className={`${cardClass} p-8 md:p-12 max-w-4xl mx-auto text-center`}>
          <TopAccent />
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-4">
            Asegura tu lugar con descuento
          </h2>
          <p className="text-white/50 mb-1 text-lg">
            Inicia el martes {FECHA_INICIO} de 2027
          </p>
          <p className="text-white/50 mb-6 text-sm">
            Precio Early Bird de lanzamiento: {EARLY_BIRD_PRICE_PEN} en lugar
            de {REGULAR_PRICE_PEN}
          </p>
          <Link href={CHECKOUT_URL} className={CTA_CLASS}>
            <Shine />
            <CheckCircle2 className="h-6 w-6" />
            Pagar y Asegurar mi Lugar
            <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <p className="text-white/40 text-sm mt-4">
            Consultas al <WhatsAppLink />
          </p>
        </div>

        {/* Métodos de pago alternativos */}
        <div className={`${cardClass} p-8 md:p-12 max-w-4xl mx-auto mt-8`}>
          <TopAccent />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Eyebrow>Métodos de pago</Eyebrow>
              <h3 className="text-xl font-bold text-white/90 mt-2 mb-4">
                Paga al instante con <span className="text-accent">Yape</span>{" "}
                o <span className="text-accent">Plin</span>
              </h3>
              <div className="flex items-center gap-2 mb-4">
                {[
                  { src: yapeImage, alt: "Yape" },
                  { src: plinImage, alt: "Plin" },
                ].map((logo) => (
                  <span
                    key={logo.alt}
                    className="flex h-11 w-16 items-center justify-center rounded-lg bg-white/95 ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={48}
                      height={24}
                      className="h-7 w-auto object-contain"
                    />
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/60 mb-5">
                Escanea el código QR desde tu app de Yape o Plin. Titular:{" "}
                <b className="text-white/90">Innodesign</b>. Envía tu voucher
                al <b className="text-white/90">{CONTACTO_WHATSAPP}</b> para
                completar tu registro.
              </p>
              <div className="border-t border-white/10 pt-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
                  También aceptamos
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Transferencia bancaria", "PayPal"].map((m) => (
                    <span
                      key={m}
                      className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-white/70"
                    >
                      {m}
                    </span>
                  ))}
                </div>
                <dl className="text-sm border-t border-white/10">
                  {[
                    ["Titular", "INNODESIGN E.I.R.L."],
                    ["RUC", "20533158952"],
                    ["Banco", "Interbank · Cuenta corriente en soles"],
                    ["Cuenta", "340-3008047314"],
                    ["CCI", "003-340-003008047314-70"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5"
                    >
                      <dt className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                        {k}
                      </dt>
                      <dd className="text-right text-xs sm:text-sm font-semibold text-white/80">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="bg-white rounded-xl p-4 mb-4">
                  <Image
                    src={yapeQR}
                    alt="Yape QR"
                    width={280}
                    height={280}
                    className="w-full h-auto"
                  />
                </div>
                <p className="w-full text-center text-sm font-semibold uppercase tracking-[0.15em] text-accent-deep">
                  Paga con QR
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Programa */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Programa · 8 clases en 4 semanas</Eyebrow>
            <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              ¿Qué vas a dominar?
            </h3>
            <p className="text-white/50 max-w-2xl mx-auto">
              Temario actualizado a las últimas versiones de Codex. En 4
              semanas pasas de la instalación a delegar tareas en la nube,
              automatizar con el SDK y revisar PRs en GitHub.
            </p>
          </div>

          {PROGRAM.map((block) => (
            <div key={block.week} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Eyebrow>{block.week}</Eyebrow>
                <span className="text-sm font-bold text-white/80 shrink-0">
                  {block.title}
                </span>
                <span className="h-px flex-grow bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {block.classes.map((cls) => (
                  <div key={cls.n} className={`${cardClass} p-6`}>
                    <TopAccent />
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-deep">
                        Clase {cls.n}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">
                        {cls.day}
                      </span>
                    </div>
                    <h4 className="font-bold text-white/90 mb-4">
                      <InlineCode text={cls.title} />
                    </h4>
                    <ul className="space-y-2 text-sm text-white/60">
                      {cls.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">·</span>
                          <span>
                            <InlineCode text={item} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Proyecto final */}
          <div className={`${cardClass} border-accent-deep/50 bg-accent-deep/[0.08] p-7 flex flex-col sm:flex-row items-start gap-5`}>
            <TopAccent />
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-accent-deep/40 bg-accent-deep/15">
              <Rocket className="h-5 w-5 text-accent" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-deep">
                Proyecto final
              </span>
              <h4 className="font-bold text-white/90 mt-1.5 mb-2">
                Una app completa, de punta a punta con Codex
              </h4>
              <p className="text-sm text-white/60">
                Defines las reglas del proyecto en AGENTS.md, implementas en
                paralelo con la app y Codex cloud, validas los flujos
                end-to-end con Chrome DevTools MCP y cierras con PRs revisados
                por <code className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[0.85em] text-white/85">@codex</code>{" "}
                y un pipeline en GitHub Actions. Listo para tu portafolio.
              </p>
            </div>
          </div>
        </div>

        {/* Inclusiones */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>Inscripción</Eyebrow>
            <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3">
              ¿Qué incluye tu inscripción?
            </h3>
            <p className="text-white/50 max-w-2xl mx-auto mt-2">
              Todo lo de abajo entra en el precio, sin costos adicionales
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INCLUSIONS.map((inc) => (
              <div
                key={inc.title}
                className={`${cardClass} p-6 flex items-start gap-4`}
              >
                <TopAccent />
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-accent-deep/30 bg-accent-deep/10 shrink-0">
                  <inc.icon className="h-5 w-5 text-accent" />
                </span>
                <div>
                  <h4 className="font-bold text-white/90 mb-1">{inc.title}</h4>
                  <p className="text-sm text-white/60">{inc.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="mb-8">
            <Eyebrow>Instructor</Eyebrow>
            <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3">
              Quién te guía
            </h3>
          </div>
          <div className={`${cardClass} p-8`}>
            <TopAccent />
            <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
              <Image
                src={angeloImage}
                alt="Angelo Leva"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover border border-white/10 shrink-0"
              />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-deep mb-1">
                  Docente principal
                </div>
                <h4 className="text-2xl font-bold text-white/90">Angelo Leva</h4>
                <p className="text-accent text-sm mt-1">
                  AI-Powered Development Engineer · Founder, Coding Latam
                </p>
              </div>
            </div>
            <div className="space-y-4 text-sm text-white/60">
              <p>
                Ingeniero de software desde 2016, especializado en la
                intersección de IA y frontend engineering. Integra agentes de
                código como Codex, Claude Code y Gemini CLI, junto con MCP
                Servers, en cada etapa del ciclo de desarrollo: desde
                generación de código y debugging hasta decisiones de
                arquitectura y automatización de workflows.
              </p>
              <p>
                Combina experiencia profunda en frontend (React, Next.js, Vite,
                Astro, TypeScript) con prácticas modernas de AI engineering.
                Diseña sistemas donde los agentes de código autónomos y el
                prompt engineering son el core de cómo entrega software rápido,
                confiable y de alta calidad.
              </p>
              <p>
                A través de Coding Latam entrena desarrolladores en toda
                Latinoamérica en desarrollo práctico asistido por IA.
                Organizador principal de GDG Tacna con eventos de +400
                developers.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-deep mb-3">
                Stack diario
              </div>
              <ul className="space-y-2 text-sm text-white/60">
                {[
                  ["IA y Automatización:", "Codex, Claude Code, MCP Servers, Gemini CLI"],
                  ["Frontend y Web:", "React, Next.js, TypeScript, Vite, Astro, Tailwind"],
                  ["Herramientas:", "Git, Playwright, CI/CD, Node.js"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-start gap-2">
                    <span className="text-accent">→</span>
                    <span>
                      <strong className="text-white/90">{k}</strong> {v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Codex", "MCP Servers", "React", "Next.js", "TypeScript", "Claude Code"].map(
                (tag, i) => (
                  <span
                    key={tag}
                    className={`rounded-full border px-3 py-1 text-xs ${i < 2
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-white/10 text-white/60"
                      }`}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Comunidad */}
          <div className={`${cardClass} p-7 mt-6`}>
            <TopAccent />
            <Eyebrow>Comunidad</Eyebrow>
            <h4 className="text-xl font-bold text-white/90 mt-3">Coding Latam</h4>
            <p className="text-sm text-accent mt-1">codinglatam.dev</p>
            <p className="text-sm text-white/60 mt-3">
              Plataforma de educación en español para desarrolladores de
              Latinoamérica. Formación práctica, comunidad activa y contenido
              actualizado sobre las herramientas que el mercado exige hoy.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["YouTube", "TikTok", "LinkedIn", "GDG Tacna"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
                >
                  {tag}
                </span>
              ))}
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs text-accent">
                +400 devs
              </span>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className={`${cardClass} relative p-8 md:p-12 text-center`}>
            <TopAccent />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-48 w-3/4 -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]"
            />
            <div className="relative">
              <div className="mb-6">
                <LiveBadge>Inscripciones abiertas · Inicia el {FECHA_INICIO}</LiveBadge>
              </div>
              <h3 className="text-2xl md:text-4xl font-bold text-white/90 mb-4 leading-tight">
                Aprende lo que el mercado{" "}
                <span className="text-accent">exige hoy</span>
              </h3>
              <p className="text-white/55 max-w-xl mx-auto mb-8">
                4 semanas, 8 clases en vivo y un proyecto completo de punta a
                punta con Codex.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm text-white/70">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <CalendarDays className="h-4 w-4 text-accent" />
                  Del {FECHA_INICIO} al {FECHA_FIN.replace(" de 2027", "")} · {FRECUENCIA}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <Clock className="h-4 w-4 text-accent" />
                  {HORARIO_CURSO}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <BadgeCheck className="h-4 w-4 text-accent" />
                  Certificación verificable
                </span>
              </div>
              <Link href={CHECKOUT_URL} className={CTA_CLASS}>
                <Shine />
                <CheckCircle2 className="h-6 w-6" />
                Inscribirme — {EARLY_BIRD_PRICE_PEN}
                <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <p className="text-white/40 text-sm mt-4">
                Consultas al <WhatsAppLink />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar de inscripción — solo desktop grande */}
      <aside className="hidden xl:block xl:sticky xl:top-24">
        <div className={`${cardClass} p-6`}>
          <TopAccent />
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent-deep/40 bg-accent-deep/10 px-3 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-deep">
                Inicia el {FECHA_INICIO}
              </span>
            </div>
            <span className="shrink-0 rotate-3 rounded-md border border-terminal-green/40 bg-terminal-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-terminal-green">
              Early Bird
            </span>
          </div>

          <p className="text-sm font-bold text-white/85">Codex para programadores</p>

          <div className="mt-4 border-t border-dashed border-white/15 pt-4">
            <div className="flex items-baseline gap-2.5">
              <span className="text-4xl font-bold text-white">
                {EARLY_BIRD_PRICE_PEN}
              </span>
              <span className="text-lg text-white/40 line-through">
                {REGULAR_PRICE_PEN}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold text-accent">
                {DESCUENTO}
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                Precio de lanzamiento
              </span>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-2">
            Precio en soles peruanos (PEN), por persona.
          </p>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
              Martes y jueves — tu hora local
            </p>
            <ul className="space-y-3 text-xs text-white/70">
              {HORARIOS_PAIS.map((h) => (
                <li key={h.time} className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1">
                      {h.flags.map((Flag, i) => (
                        <Flag key={i} className="h-3.5 w-5 rounded-[2px]" />
                      ))}
                    </div>
                    <p className="mt-1">{h.cities}</p>
                  </div>
                  <span className="shrink-0 font-semibold text-white/90">
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex -space-x-3 mb-2.5">
              {avatarsLoading ? (
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-[#161616] bg-white/10 animate-pulse"
                  />
                ))
              ) : avatars.length >= 3 ? (
                avatars.map((avatar, i) => (
                  <Image
                    key={i}
                    src={avatar.image}
                    alt={avatar.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border-2 border-[#161616] object-cover"
                  />
                ))
              ) : (
                [
                  { name: "Maria", bg: "5b7cfa" },
                  { name: "Carlos", bg: "7c9cff" },
                  { name: "Ana", bg: "87a96b" },
                ].map((u) => (
                  <Image
                    key={u.name}
                    src={`https://ui-avatars.com/api/?name=${u.name}&background=${u.bg}&color=fff&size=36`}
                    alt="Usuario"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border-2 border-[#161616]"
                  />
                ))
              )}
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#161616] bg-accent">
                <span className="text-[10px] font-bold text-white">
                  +{certCount ?? 176}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-white/50">
              Más de {certCount ?? 176} desarrolladores ya se certificaron con
              Coding Latam. Sé parte de la cohorte que inicia el {FECHA_INICIO}.
            </p>
          </div>

          <Link
            href={CHECKOUT_URL}
            className="group relative mt-5 flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-accent-deep to-accent px-6 py-4 font-bold text-white shadow-lg shadow-accent-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-accent/40 cursor-pointer"
          >
            <Shine />
            <CheckCircle2 className="h-5 w-5" />
            Asegurar mi lugar
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <p className="text-center text-white/40 text-[11px] mt-3">
            Yape · Plin · Transferencia · PayPal
          </p>
          <p className="text-center text-white/40 text-[11px] mt-1">
            Consultas al <WhatsAppLink />
          </p>

          <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-xs text-white/70">
            {SIDEBAR_BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Barra de precio + CTA fija en mobile (fondo sólido, sin blur: ver
          nota en /claude sobre Safari iOS). */}
      <div
        id="mobile-price-bar"
        className="xl:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#161616] px-4 pb-3 pt-2.5"
      >
        <ul className="mb-2.5 flex flex-col gap-2 text-sm font-medium text-white/65 sm:flex-row sm:items-center sm:gap-3.5 sm:overflow-x-auto sm:whitespace-nowrap sm:text-[10px] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden">
          {MOBILE_BAR_BENEFITS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5 sm:shrink-0">
              <Icon className="h-4 w-4 shrink-0 text-accent sm:h-3 sm:w-3" />
              {label}
            </li>
          ))}
        </ul>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold uppercase tracking-[0.1em] text-white/50 sm:text-[10px] sm:tracking-[0.15em] sm:text-white/40">
              Inicia el {FECHA_INICIO}
            </p>
            <p className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                {EARLY_BIRD_PRICE_PEN}
              </span>
              <span className="text-base text-white/40 line-through sm:text-sm">
                {REGULAR_PRICE_PEN}
              </span>
            </p>
          </div>
          <Link
            href={CHECKOUT_URL}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-deep to-accent px-4 py-3 text-base font-bold text-white shadow-lg shadow-accent-deep/25 sm:text-sm"
          >
            Inscribirme
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
