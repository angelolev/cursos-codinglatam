"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Video,
  BadgeCheck,
  Users,
  ShieldCheck,
  Gift,
  AlertTriangle,
  CalendarDays,
  Clock,
  Rocket,
  ChevronDown,
  Download,
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
import { Countdown, CountdownBanner } from "./Countdown";

const FECHA_INICIO = "12 de enero";
const FECHA_FIN = "4 de febrero de 2027";
const FECHAS_SESIONES = "Enero 12, 14, 19, 21, 26 y 28 · Febrero 2 y 4";
const FRECUENCIA = "Martes y jueves · 4 semanas";
const HORARIO_CURSO = "8:00 – 10:00 PM (hora Perú)";
const CONTACTO_WHATSAPP = "+51 964225808";
const CONTACTO_WHATSAPP_URL =
  "https://wa.me/51964225808?text=" +
  encodeURIComponent(
    "Hola, quiero separar mi cupo en Claude de 0 a 100 (inicia el 12 de enero) con el precio Black Friday."
  );
// No hay link de Mercado Pago para este precio: la inscripción se cierra
// por WhatsApp (pago con Mercado Pago, Yape, Plin, transferencia o PayPal).
const CHECKOUT_URL = CONTACTO_WHATSAPP_URL;
// Dos versiones del brochure: A4 para computadora y vertical para celular.
// Hasta tablet (iPad en vertical, < 1024px) se ofrece la de celular.
const BROCHURE_URL = "/brochures/claude-de-0-a-100.pdf";
const BROCHURE_MOBILE_URL = "/brochures/claude-de-0-a-100-celular.pdf";

// Clases literales para que Tailwind las detecte: la versión celular se ve
// por debajo de `lg` y la de computadora desde `lg`.
const BROCHURE_VISIBILITY = {
  flex: { mobile: "flex lg:hidden", desktop: "hidden lg:flex" },
  "inline-flex": {
    mobile: "inline-flex lg:hidden",
    desktop: "hidden lg:inline-flex",
  },
} as const;

// Botón de descarga del brochure: muestra la versión adecuada según el
// ancho de pantalla.
function BrochureDownload({
  className,
  display = "inline-flex",
}: {
  className: string;
  display?: keyof typeof BROCHURE_VISIBILITY;
}) {
  const v = BROCHURE_VISIBILITY[display];
  return (
    <>
      <a
        href={BROCHURE_MOBILE_URL}
        download="Claude de 0 a 100 - Brochure (celular).pdf"
        className={`${v.mobile} ${className}`}
      >
        <Download className="h-4 w-4" />
        Descargar brochure (PDF)
      </a>
      <a
        href={BROCHURE_URL}
        download="Claude de 0 a 100 - Brochure.pdf"
        className={`${v.desktop} ${className}`}
      >
        <Download className="h-4 w-4" />
        Descargar brochure (PDF)
      </a>
    </>
  );
}

// Precios fijos en soles peruanos (PEN)
const REGULAR_PRICE_PEN = "S/ 399";
const EARLY_BIRD_PRICE_PEN = "S/ 249";
const DESCUENTO = "38% off";
const PROMO_LABEL = "Black Friday";
const PROMO_VIGENCIA = "Hasta el lunes 30 de noviembre · 20 cupos";
const CUOTAS = "2 × S/ 125";
const PACK_DUO = "2 por S/ 449";

// Mismo horario real (8:00 – 10:00 PM hora Perú) convertido a la hora
// local de cada país. Perú, Colombia y Ecuador son UTC-5 todo el año;
// México (zona Centro) es UTC-6 fijo desde 2022; Argentina es UTC-3 fijo y
// Chile está en horario de verano (UTC-3) de setiembre a abril. Si la
// cohorte cae fuera de ese rango, revisar la fila de Chile.
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

// Lista de beneficios del sidebar de inscripción.
const SIDEBAR_BENEFITS = [
  "8 clases en vivo + Clase 0 en diciembre",
  "5 entregables propios, sin escribir código",
  "Clases grabadas con acceso ilimitado",
  "Certificación al finalizar",
  "Grupo privado con el instructor",
  "Garantía de la primera sesión",
];

// Paleta Coding Latam (Figma): tarjetas en Eerie Black-900 con borde Onyx.
const brandCard = cardClass
  .replace("border-white/10", "border-[#3d3d3d]")
  .replace(
    "from-white/[0.055] to-white/[0.015]",
    "from-[#1e1e1e] to-[#1e1e1e]"
  );

export default function ClaudeCodePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  useScrollReveal(contentRef);

  const [avatars, setAvatars] = useState<WaitlistAvatar[]>([]);
  const [avatarsLoading, setAvatarsLoading] = useState(true);

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

  // Programa: 8 sesiones de 2 horas en 4 semanas, martes y jueves.
  // Cada clase suma una pieza al sistema de trabajo del alumno.
  const program = [
    {
      week: "Semana 1",
      title: "Primeros pasos con Claude",
      classes: [
        {
          n: 1,
          day: "Mar 12 ene",
          title: "Tu primer día con Claude",
          items: [
            "La fórmula para pedir bien: contexto, tarea, formato y ejemplo",
            "Iterar en el chat y usar Claude desde tu celular",
            "Qué datos no compartir y cómo verificar sus respuestas",
          ],
          outcome: "tu guía personal para pedirle cualquier cosa a Claude",
        },
        {
          n: 2,
          day: "Jue 14 ene",
          title: "Escribe en 10 minutos lo que te tomaba una hora",
          items: [
            "Correos difíciles, propuestas y cotizaciones",
            "Posts y mensajes para tus clientes",
            "Estilos: que escriba con tu tono y tu voz",
          ],
          outcome: "tu estilo configurado y tu primera propuesta lista",
        },
      ],
    },
    {
      week: "Semana 2",
      title: "Tus datos y tu negocio",
      classes: [
        {
          n: 3,
          day: "Mar 19 ene",
          title: "Tus Excel, PDFs e investigaciones, resueltos",
          items: [
            "Analizar un Excel y convertirlo en un dashboard",
            "Resumir y consultar documentos largos",
            "Investigar en la web: competencia, proveedores y precios",
          ],
          outcome: "un dashboard hecho con tus propios datos",
        },
        {
          n: 4,
          day: "Jue 21 ene",
          title: "Un asistente que conoce tu negocio y tu WhatsApp",
          items: [
            "Proyectos con tus documentos, precios y políticas",
            "Skills: plantillas y procesos que se reutilizan solos",
            "WhatsApp: respuestas a clientes con tu tono y análisis de chats (pedidos, pendientes y preguntas frecuentes)",
          ],
          outcome: "tu asistente de atención al cliente listo para usar",
        },
      ],
    },
    {
      week: "Semana 3",
      title: "Diseño y automatización",
      classes: [
        {
          n: 5,
          day: "Mar 26 ene",
          title: "Diseña sin ser diseñador",
          items: [
            "Claude Design: presentaciones y piezas visuales",
            "Aplicar tu marca: logo, colores y tipografía",
            "Ajustar el diseño conversando y exportarlo",
          ],
          outcome: "una presentación con tu marca, lista para usar",
        },
        {
          n: 6,
          day: "Jue 28 ene",
          title: "Claude conectado a tus herramientas y trabajando por ti",
          items: [
            "Conectores: Gmail, Google Calendar y Google Drive",
            "Cowork: encargar trabajos sobre tus archivos y carpetas",
            "Tareas programadas: un reporte semanal que se arma solo",
          ],
          outcome:
            "tu correo y agenda conectados y una tarea automática funcionando",
        },
      ],
    },
    {
      week: "Semana 4",
      title: "Tu web y tus videos",
      classes: [
        {
          n: 7,
          day: "Mar 2 feb",
          title: "Tu catálogo web con pedidos por WhatsApp",
          items: [
            "Claude Code para alguien que no programa",
            "Tu web con catálogo y una página para cada producto",
            "Pedidos que te llegan directo a tu WhatsApp y tu web publicada en internet",
          ],
          outcome: "tu catálogo en línea recibiendo pedidos",
        },
        {
          n: 8,
          day: "Jue 4 feb",
          title: "Edita videos con Claude: Reels, YouTube y más",
          items: [
            "Editar video con Claude y HyperFrames, sin programar",
            "Reels y videos verticales con subtítulos y textos animados",
            "Videos para YouTube con intro y cierre de marca",
            "Cierre del programa y certificación",
          ],
          outcome: "tus primeros videos editados, listos para publicar",
        },
      ],
    },
  ];

  // ¿Para quién es?
  const diferenciales = [
    {
      n: "01",
      title: "Profesionales y equipos",
      text: "Coordinadores, analistas, docentes, áreas comerciales y administrativas que quieren ahorrar horas en informes, correos y análisis.",
    },
    {
      n: "02",
      title: "Emprendedores",
      text: "Dueños de negocio que necesitan contenido, presentaciones y herramientas propias sin contratar a un diseñador o a un programador.",
    },
    {
      n: "03",
      title: "Si nunca usaste IA",
      text: "Empezamos desde cero. Si sabes explicar una idea por escrito, ya tienes lo necesario para seguir el programa.",
    },
    {
      n: "04",
      title: "Si ya usas ChatGPT o Claude",
      text: "Pasas del chat ocasional a un sistema completo: proyectos, skills, diseño, tareas automáticas y apps.",
    },
  ];

  // Lo que te llevas: 5 entregables propios.
  const entregables = [
    {
      n: "01",
      tag: "Proyectos y Skills",
      title: "Un asistente que conoce tu negocio",
      text: "Con tus documentos, precios y tono, listo para redactar tus correos y responder a tus clientes por WhatsApp.",
    },
    {
      n: "02",
      tag: "Claude Design",
      title: "Una presentación con tu marca",
      text: "Diseñada conversando, lista para usar en tu trabajo.",
    },
    {
      n: "03",
      tag: "Cowork",
      title: "Una tarea que Claude hace por ti",
      text: "Un encargo completo sobre tus archivos o un reporte programado que se repite solo.",
    },
    {
      n: "04",
      tag: "Claude Code",
      title: "Tu catálogo web con pedidos por WhatsApp",
      text: "Tu web con tus productos, publicada en internet: el cliente elige y te escribe por WhatsApp con su pedido listo.",
    },
    {
      n: "05",
      tag: "Video con Claude",
      title: "Tus videos editados con Claude",
      text: "Reels, videos para YouTube y más, con subtítulos, textos animados y tu marca.",
    },
  ];

  // Herramientas que se usan en el programa.
  const herramientas = [
    "Chat",
    "Proyectos",
    "Conectores",
    "Skills",
    "Estilos",
    "Claude Design",
    "Cowork",
    "Claude Code",
    "HyperFrames",
  ];

  // ¿Qué incluye tu inscripción?
  const inclusions = [
    {
      icon: Video,
      title: "Clases grabadas, acceso ilimitado",
      text: "Si un día no puedes conectarte, o quieres repasar, tienes cada clase disponible cuando quieras",
    },
    {
      icon: CalendarDays,
      title: "Clase 0 en diciembre",
      text: "Exclusiva Black Friday: configuramos Claude, instalamos todo lo necesario y resolvemos tus dudas en vivo",
    },
    {
      icon: BadgeCheck,
      title: "Certificación al finalizar",
      text: "Al terminar el programa recibes tu certificación de Coding Latam",
    },
    {
      icon: Users,
      title: "Grupo privado con el instructor",
      text: "Resuelve dudas entre clases con el instructor y tus compañeros",
    },
    {
      icon: ShieldCheck,
      title: "Garantía de la primera sesión",
      text: "Si en la primera clase no ves el valor, te devolvemos el 100%",
    },
    {
      icon: Gift,
      title: "Bono para todos los inscritos",
      text: "Grabación del taller \"Claude Code para no programadores\" (valorizado en S/ 99)",
    },
  ];

  // Testimonios de alumnos: capturas estáticas de posts de LinkedIn en
  // vez de <iframe> embed, porque LinkedIn muestra un modal de "abrir la
  // app" que tapa el post cuando el visitante no tiene sesión iniciada
  // (frecuente en mobile). Para actualizar: capturar el post público a
  // 460px de ancho y guardarlo en /public/testimonios.
  const testimonials: { image: string; href: string; height: number }[] = [
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

  return (
    <>
    {/* Franja roja con la cuenta regresiva, siempre visible bajo el navbar. */}
    <CountdownBanner
      href="#inversion"
      price={EARLY_BIRD_PRICE_PEN}
      promoLabel={PROMO_LABEL}
    />
    <main
      className="pt-24 pb-28 xl:pb-16 mx-auto w-full max-w-7xl sm:px-6 px-4 lg:px-0 xl:grid xl:grid-cols-[1fr_360px] xl:gap-8 xl:items-start flex-grow min-w-0 [--accent:#ecb033] [--accent-deep:#e4911c]"
    >
      {/* Fondo de layout de la marca (Eerie Black). */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 bg-[#171717]" />
      <div ref={contentRef} className="xl:min-w-0">
        {/* Hero Section */}
        <div className="relative text-center mb-16">
          {/* Ambient terracota glow + faint grid backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-6rem] -z-10 h-[28rem] w-[42rem] max-w-[100vw] -translate-x-1/2 rounded-full bg-primary-400/10 blur-[120px]"
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

          <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1.5 mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-400" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.08em] md:tracking-[0.2em] text-primary-500">
              {PROMO_LABEL} · <span className="hidden sm:inline">Inicia el </span>{FECHA_INICIO}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white/90 mb-6 leading-[1.1]">
            <span className="text-primary-400 underline decoration-primary-500/50 decoration-2 underline-offset-[10px] drop-shadow-[0_0_30px_rgba(236,176,51,0.35)]">
              Claude
            </span>
            <br />
            de 0 a 100
          </h1>

          <p className="text-lg md:text-xl text-[#b5b5b5] max-w-2xl mx-auto mb-6">
            De nunca haber usado IA a tener tu propio sistema de trabajo con{" "}
            <strong className="text-primary-400">Claude</strong>: correos,
            documentos, datos, atención por WhatsApp, diseño, tareas
            automáticas, tu propia web y edición de video,{" "}
            <strong className="text-white/85">sin saber programar</strong>.
          </p>

          {/* Cuenta regresiva de la promo */}
          <Countdown label={`${PROMO_LABEL} termina en`} className="mb-8" />

          {/* CTAs del hero */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <a
              href="#inversion"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-400 px-6 py-3 font-bold text-[#171717] shadow-lg shadow-primary-500/25 transition-colors hover:bg-primary-300"
            >
              Separar mi cupo — {EARLY_BIRD_PRICE_PEN}
              <ArrowRight className="h-4 w-4" />
            </a>
            <BrochureDownload className="items-center gap-2 rounded-lg border border-[#3d3d3d] bg-[#1e1e1e] px-6 py-3 font-semibold text-white/85 transition-colors hover:border-primary-400/60 hover:text-primary-400" />
          </div>

          {/* Chips de formato */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {[`Inicia el ${FECHA_INICIO}`, "Martes y jueves · 8–10 PM (Perú)", "100% en vivo y online"].map(
              (p) => (
                <span
                  key={p}
                  className="rounded-full border border-primary-400/40 px-4 py-1.5 text-xs font-semibold text-primary-400"
                >
                  {p}
                </span>
              )
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-y-6 mb-12">
            {[
              { value: "8", label: "Clases en vivo" },
              { value: "4", label: "Semanas" },
              { value: "16h", label: "De práctica" },
              { value: "5", label: "Entregables" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`px-6 sm:px-8 text-center ${i % 2 === 1 ? "border-l border-white/10" : ""
                  } ${i === 2 ? "sm:border-l sm:border-white/10" : ""}`}
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary-400 drop-shadow-[0_0_20px_rgba(236,176,51,0.25)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] md:tracking-[0.2em] text-white/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <TerminalSnippet
            title="claude — chat"
            command="tú"
            prompt="Analiza el Excel de ventas y arma un dashboard"
            result="Dashboard listo · 3 hallazgos clave detectados"
          />
        </div>

        {/* Claude Partner Network */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-400 to-primary-500 p-7 sm:p-10 max-w-4xl mx-auto mb-4">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-4 -top-10 select-none text-[10rem] font-bold leading-none text-white/15"
          >
            ✳
          </span>
          <p className="relative text-xs font-bold uppercase tracking-[0.08em] md:tracking-[0.2em] text-black/60">
            Parte del ecosistema Claude
          </p>
          <h2 className="relative mt-3 text-3xl md:text-4xl font-bold leading-tight text-[#171717]">
            Somos Claude Partner Network
          </h2>
          <p className="relative mt-4 max-w-2xl text-sm md:text-base text-black/75">
            Innodesign E.I.R.L., la empresa detrás de Coding Latam, fue
            aceptada en el Claude Partner Network de Anthropic. No solo usamos
            Claude: trabajamos dentro del ecosistema de Claude y llevamos
            esa experiencia a cada clase.
          </p>
          <div className="relative mt-6 inline-flex items-center gap-3 rounded-xl bg-[#171717] px-5 py-3">
            <span className="text-xl text-primary-400">✳</span>
            <div>
              <p className="font-bold text-white/90">Claude Partner Network</p>
              <p className="text-xs xl:text-[10px] uppercase tracking-[0.06em] md:tracking-[0.15em] text-[#b5b5b5]">
                Miembro · Innodesign E.I.R.L.
              </p>
            </div>
          </div>
        </div>
        <p className="max-w-4xl mx-auto mb-20 text-center text-xs xl:text-[11px] text-white/60">
          Claude y Claude Partner Network son marcas de Anthropic. Coding Latam
          es un programa independiente.
        </p>

        {/* Testimonios Section */}
        {testimonials.length > 0 && (
          <div className="relative mb-20">
            {/* Atmospheric terracota glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-72 w-[80%] max-w-4xl rounded-full bg-primary-400/10 blur-[100px]"
            />

            <div className="relative max-w-4xl mx-auto text-center mb-12 px-4">
              {/* Oversized quote watermark */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-16 left-0 select-none font-bold leading-none text-primary-400/[0.07] text-[10rem] sm:text-[13rem]"
              >
                &ldquo;
              </span>
              <Eyebrow>Testimonios</Eyebrow>
              <h3 className="relative text-[1.7rem] leading-tight md:text-3xl font-bold text-white/90 mt-3 mb-4">
                Lo que dicen nuestros alumnos
              </h3>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0a66c2]/30 bg-[#0a66c2]/10 px-3.5 py-1.5">
                <LinkedInIcon className="h-3.5 w-3.5 text-[#0a66c2]" />
                <span className="text-xs font-medium text-[#b5b5b5]">
                  Alumnos de nuestros cursos de Claude
                </span>
              </span>
            </div>

            {/* Video testimonial — opinión de alumnos en YouTube */}
            <div className="relative max-w-3xl mx-auto mb-12 px-4">
              <figure className="group/video relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-primary-400/40 hover:shadow-[0_16px_50px_-12px_rgba(236,176,51,0.4)]">
                {/* Accent line */}
                <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-primary-400/80 via-primary-400/20 to-transparent transition-opacity duration-300 group-hover/video:via-primary-400/60" />

                {/* Editor-tab chrome bar */}
                <figcaption className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  </span>
                  <span className="ml-1 truncate text-xs text-white/60">
                    opiniones-alumnos.mp4
                  </span>
                  <Video className="ml-auto h-3.5 w-3.5 text-primary-400/70 transition-colors duration-300 group-hover/video:text-primary-400" />
                </figcaption>

                {/* YouTube embed — responsive 16:9 */}
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src="https://www.youtube.com/embed/Y3AMU4OMpX0"
                    title="Opinión de alumnos de los cursos de Claude"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </figure>
            </div>

            {/* Full-bleed infinite marquee. Pausa en hover para leer/interactuar. */}
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
                {[...testimonials, ...testimonials].map((t, i) => {
                  const isClone = i >= testimonials.length;
                  const n = (i % testimonials.length) + 1;
                  return (
                    <figure
                      key={i}
                      aria-hidden={isClone}
                      className="group/card relative flex w-[86vw] max-w-[460px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/40 hover:shadow-[0_16px_50px_-12px_rgba(236,176,51,0.4)]"
                    >
                      {/* Accent line, brightens on hover */}
                      <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-primary-400/80 via-primary-400/20 to-transparent transition-opacity duration-300 group-hover/card:via-primary-400/60" />

                      {/* Editor-tab chrome bar */}
                      <figcaption className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-2.5">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-primary-400/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        </span>
                        <span className="ml-1 truncate text-xs text-white/60">
                          testimonio-0{n}.md
                        </span>
                        <LinkedInIcon className="ml-auto h-3.5 w-3.5 text-[#0a66c2]/70 transition-colors duration-300 group-hover/card:text-[#0a66c2]" />
                      </figcaption>

                      {/* Captura estática del post de LinkedIn */}
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
        )}

        {/* ¿Para quién es? */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <Eyebrow>Para quién es</Eyebrow>
            <h2 className="text-[1.7rem] leading-tight md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Para quien quiere que la IA trabaje para él, no al revés
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {diferenciales.map((d) => (
              <div
                key={d.n}
                className={`${brandCard} group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/40`}
              >
                <TopAccent />
                <div className="text-2xl font-bold text-primary-400/70 mb-3 transition-colors duration-300 group-hover:text-primary-400">
                  {d.n}
                </div>
                <h3 className="text-lg md:text-base font-bold text-white/90 mb-1.5">{d.title}</h3>
                <p className="text-base md:text-sm text-[#b5b5b5]">{d.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Lo que te llevas */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <Eyebrow>Lo que te llevas</Eyebrow>
            <h2 className="text-[1.7rem] leading-tight md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Terminas con 5 cosas funcionando
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {entregables.map((e) => (
              <div
                key={e.n}
                className={`${brandCard} group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/40`}
              >
                <TopAccent />
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] md:tracking-[0.2em] text-primary-500">
                  {e.n} · {e.tag}
                </div>
                <h3 className="text-lg md:text-base font-bold text-white/90 mb-1.5">{e.title}</h3>
                <p className="text-base md:text-sm text-[#b5b5b5]">{e.text}</p>
              </div>
            ))}
            <div className={`${brandCard} p-6 flex items-center`}>
              <TopAccent />
              <p className="text-base md:text-sm text-white/70">
                Todo hecho por ti, sobre tus propios casos y{" "}
                <strong className="text-primary-400">sin escribir código</strong>.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="mb-4 text-xs xl:text-[10px] font-semibold uppercase tracking-[0.08em] md:tracking-[0.2em] text-white/60">
              Herramientas que vas a usar
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {herramientas.map((h, i) => (
                <span
                  key={h}
                  className={`rounded-full border px-3.5 py-1.5 text-xs ${i === 0
                    ? "border-primary-400/40 bg-primary-400/10 text-primary-400"
                    : "border-white/10 text-white/70"
                    }`}
                >
                  {h}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-[#b5b5b5]">
              Todo gira alrededor de Claude, con una sola cuenta. HyperFrames
              se usa desde Claude Code para editar video.
            </p>
          </div>
        </div>

        {/* Temario: compacto. Título + "Sales con" a la vista, el detalle
            de cada clase plegado para no alargar el scroll. */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <Eyebrow>Temario · 8 sesiones de 2 horas</Eyebrow>
            <h2 className="text-[1.7rem] leading-tight md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Cada clase suma una pieza a tu sistema
            </h2>
            <p className="text-[#b5b5b5] max-w-2xl mx-auto">
              En vivo y grabadas. En 4 semanas pasas de tu primer chat con
              Claude a tener tu asistente, tus diseños, tareas automáticas, tu
              web y tus videos funcionando.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {program.flatMap((block) =>
              block.classes.map((cls) => (
                <div key={cls.n} className={`${brandCard} p-5`}>
                  <TopAccent />
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] md:tracking-[0.2em] text-primary-500">
                      Sesión {String(cls.n).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.06em] md:tracking-[0.15em] text-white/60">
                      {cls.day}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-base font-bold text-white/90">{cls.title}</h3>
                  <p className="mt-2 text-[15px] md:text-xs text-white/60">
                    Sales con ›{" "}
                    <span className="font-semibold text-primary-400">
                      {cls.outcome}
                    </span>
                  </p>
                  <details className="group mt-3 border-t border-white/10 pt-2.5">
                    <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[15px] md:text-xs font-semibold text-[#b5b5b5] transition-colors hover:text-primary-400 [&::-webkit-details-marker]:hidden">
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180" />
                      Ver temas de la clase
                    </summary>
                    <ul className="mt-3 space-y-2 text-base md:text-sm text-[#b5b5b5]">
                      {cls.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-primary-400 mt-0.5">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              ))
            )}
          </div>

          {/* Clase 0 */}
          <div className={`${brandCard} mt-4 border-primary-500/50 bg-primary-500/[0.08] p-6 flex flex-col sm:flex-row items-start gap-5`}>
            <TopAccent />
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary-500/40 bg-primary-500/15">
              <Rocket className="h-5 w-5 text-primary-400" />
            </span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.08em] md:tracking-[0.2em] text-primary-500">
                Antes de empezar
              </span>
              <h3 className="font-bold text-white/90 mt-1.5 mb-2">
                Clase 0 en diciembre
              </h3>
              <p className="text-base md:text-sm text-[#b5b5b5]">
                Configuramos Claude, instalamos todo lo que vas a usar y
                resolvemos tus dudas en una sesión de preguntas y respuestas.
                Todas las clases son de 8 a 10 p.m. (Perú) y quedan grabadas
                con acceso ilimitado.
              </p>
            </div>
          </div>
        </div>

        {/* Inclusions Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <Eyebrow>Inscripción</Eyebrow>
            <h2 className="text-[1.7rem] leading-tight md:text-3xl font-bold text-white/90 mt-3">
              ¿Qué incluye tu inscripción?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {inclusions.map((inc) => (
              <div key={inc.title} className={`${brandCard} p-5`}>
                <TopAccent />
                <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-primary-500/30 bg-primary-500/10">
                  <inc.icon className="h-4 w-4 text-primary-400" />
                </span>
                <h3 className="font-bold text-white/90 mb-1 text-base md:text-sm">{inc.title}</h3>
                <p className="text-[15px] md:text-xs text-[#b5b5b5]">{inc.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inversión: precio, detalles, CTA, requisitos y medios de pago en
            un solo bloque. */}
        <div id="inversion" className="max-w-4xl mx-auto scroll-mt-32">
          <div className="text-center mb-10">
            <Eyebrow>Inversión</Eyebrow>
            <h2 className="text-[1.7rem] leading-tight md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Asegura tu cupo
            </h2>
            <p className="text-[#b5b5b5] max-w-2xl mx-auto">
              Separa tu cupo hoy y empieza en enero.
            </p>
          </div>
          <div className={`${brandCard} p-7 sm:p-8`}>
            <TopAccent />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-center">
              <div>
                <span className="inline-flex rounded-full border border-primary-300/40 bg-primary-300/10 px-3.5 py-1 text-xs xl:text-[10px] font-bold uppercase tracking-[0.06em] md:tracking-[0.15em] text-primary-300">
                  {PROMO_LABEL} — {DESCUENTO}
                </span>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-5xl sm:text-6xl font-bold text-white drop-shadow-[0_0_24px_rgba(236,176,51,0.3)]">
                    {EARLY_BIRD_PRICE_PEN}
                  </span>
                  <span className="text-xl text-white/60 line-through">
                    {REGULAR_PRICE_PEN}
                  </span>
                </div>
                <p className="mt-2 text-xs text-white/60">
                  PEN · Precio {PROMO_LABEL}
                </p>
                <p className="mt-4 inline-flex rounded-lg border border-dashed border-primary-400/40 px-3 py-2 text-[15px] md:text-xs text-white/70">
                  {PROMO_VIGENCIA}
                </p>
              </div>
              <dl className="text-sm border-t border-white/10">
                {[
                  ["Inicio", `Martes ${FECHA_INICIO} de 2027`],
                  ["Fin", `Jueves ${FECHA_FIN}`],
                  ["Formato", "8 clases en vivo + Clase 0"],
                  ["Horario", "Mar y Jue, 8–10 PM (Perú)"],
                  ["Cupos", "Grupo de 20 personas"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5"
                  >
                    <dt className="text-xs xl:text-[10px] uppercase tracking-[0.06em] md:tracking-[0.15em] text-white/60 shrink-0">
                      {k}
                    </dt>
                    <dd className="text-right text-xs sm:text-sm font-semibold text-white/80">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-primary-500/40 bg-primary-500/5 p-4">
              <CalendarDays className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
              <p className="text-base md:text-sm text-white/70">
                <strong className="text-white/90">Fechas de las clases:</strong>{" "}
                {FECHAS_SESIONES}. La Clase 0 es en diciembre.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Pago en 2 cuotas",
                  value: CUOTAS,
                  text: "Separa tu cupo con la primera cuota y paga la segunda antes del inicio.",
                },
                {
                  label: "Pack dúo",
                  value: PACK_DUO,
                  text: "Inscríbete con un colega, tu socio o tu pareja: S/ 224.50 cada uno.",
                },
              ].map((o) => (
                <div
                  key={o.label}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-xs xl:text-[10px] font-semibold uppercase tracking-[0.06em] md:tracking-[0.15em] text-primary-500">
                    {o.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white/90">
                    {o.value}
                  </p>
                  <p className="mt-1 text-[15px] md:text-xs text-[#b5b5b5]">{o.text}</p>
                </div>
              ))}
            </div>

            <Countdown
              label="Este precio termina en"
              className="mt-8 text-center"
            />

            {/* CTA */}
            <div className="mt-8 flex flex-col items-center gap-3 text-center">
              <Link
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary-400 px-10 py-5 text-xl font-bold text-[#171717] shadow-lg shadow-primary-500/25 hover:bg-primary-300 transition-transform duration-200 hover:scale-[1.02] hover:shadow-primary-400/40 cursor-pointer"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
                <CheckCircle2 className="h-6 w-6" />
                Separar mi cupo por WhatsApp
                <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <p className="text-white/60 text-sm">
                Mercado Pago · Yape · Plin · Transferencia · PayPal
              </p>
              <BrochureDownload className="items-center gap-2 text-sm font-semibold text-primary-400 underline decoration-primary-500/50 underline-offset-4 hover:text-primary-300" />
            </div>

            {/* Requisitos */}
            <div className="mt-8 border-t border-white/10 pt-5 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
              <p className="text-base md:text-sm text-[#b5b5b5]">
                <strong className="text-white/90">Qué necesitas:</strong> una
                computadora con macOS o Windows, buena conexión y una{" "}
                <strong className="text-white/90">
                  cuenta Claude Pro (US$20 al mes)
                </strong>
                , a cargo del alumno y no incluida en la inscripción. No
                necesitas saber programar ni experiencia previa con IA.
              </p>
            </div>

            {/* Otras formas de pago, plegadas */}
            <details className="group mt-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-white/80 hover:text-primary-400 [&::-webkit-details-marker]:hidden">
                <span>
                  Otras formas de pago: Yape, Plin o transferencia bancaria
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 p-5 sm:p-6">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    {[
                      { src: yapeImage, alt: "Yape" },
                      { src: plinImage, alt: "Plin" },
                    ].map((logo) => (
                      <span
                        key={logo.alt}
                        className="flex h-11 w-16 items-center justify-center rounded-lg bg-white/95 ring-1 ring-black/5"
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
                  <p className="text-base md:text-sm text-[#b5b5b5] mb-5">
                    Escanea el código QR desde tu app de Yape o Plin. Titular:{" "}
                    <b className="text-white/90">Innodesign</b>. Envía tu
                    voucher al{" "}
                    <b className="text-white/90">{CONTACTO_WHATSAPP}</b> para
                    completar tu registro.
                  </p>
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
                        <dt className="text-xs xl:text-[10px] uppercase tracking-[0.06em] md:tracking-[0.15em] text-white/60">
                          {k}
                        </dt>
                        <dd className="text-right text-xs sm:text-sm font-semibold text-white/80">
                          {v}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="flex justify-center items-center">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="bg-white rounded-xl p-3 mb-3">
                      <Image
                        src={yapeQR}
                        alt="Yape QR"
                        width={220}
                        height={220}
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="w-full text-center text-sm font-semibold uppercase tracking-[0.06em] md:tracking-[0.15em] text-primary-500">
                      Paga con QR
                    </p>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Instructor Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="mb-8">
            <Eyebrow>Instructor</Eyebrow>
            <h3 className="text-[1.7rem] leading-tight md:text-3xl font-bold text-white/90 mt-3">
              Quién te guía
            </h3>
          </div>
          <div className={`${brandCard} p-8`}>
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
                <div className="text-xs font-semibold uppercase tracking-[0.08em] md:tracking-[0.2em] text-primary-500 mb-1">
                  Docente principal
                </div>
                <h4 className="text-2xl font-bold text-white/90">Angelo Leva</h4>
                <p className="text-primary-400 text-sm mt-1">
                  Claude Certified Associate · Senior Software Engineer en
                  Tranzact
                </p>
              </div>
            </div>
            <div className="space-y-4 text-base md:text-sm text-[#b5b5b5]">
              <p className="text-base text-white/80">
                Ayuda a equipos y empresas a adoptar la IA de la forma
                correcta: con capacitación práctica que convierte herramientas
                como Claude en productividad real, no en experimentos.
              </p>
              <p>
                Es Claude Certified Associate, certificado por Anthropic. Con
                Coding Latam ha formado a más de 300 personas en Latinoamérica
                y ha dictado programas in-company para organizaciones como
                Enotria y Coinrefri. Además, lidera GDG Tacna, donde impulsa el
                crecimiento de la comunidad de desarrolladores del sur del Perú.
              </p>
              <p>
                Su diferencial es que usa estas herramientas en producción todos
                los días. Ingeniero de software desde 2016, en Tranzact fue
                pionero en integrar IA al flujo de desarrollo como Senior
                Software Engineer y AI-Powered Development Engineer: construyó
                servidores MCP propios, entre ellos uno para pruebas
                automatizadas de accesibilidad, y diseñó flujos de Figma a
                código.{" "}
                <strong className="text-white/90">
                  Enseña lo que él mismo usa para entregar software.
                </strong>
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: "+300", label: "personas formadas en IA" },
                {
                  value: "+20",
                  label: "empresas con graduados, como Crehana, Culqi y Softtek",
                },
                {
                  value: "Partner",
                  label: "Coding Latam es miembro del Claude Partner Network",
                },
              ].map((s) => (
                <div key={s.value} className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary-400 shrink-0">
                    {s.value}
                  </span>
                  <span className="text-[15px] md:text-xs text-[#b5b5b5]">{s.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Claude Certified Associate",
                "Claude Partner Network",
                "Claude Code",
                "MCP Servers",
                "GDG Tacna",
              ].map((tag, i) => (
                <span
                  key={tag}
                  className={`rounded-full border px-3 py-1 text-xs ${i < 2
                    ? "border-primary-400/40 bg-primary-400/10 text-primary-400"
                    : "border-white/10 text-[#b5b5b5]"
                    }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className={`${brandCard} relative p-8 md:p-12 text-center`}>
            <TopAccent />
            {/* glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-48 w-3/4 -translate-x-1/2 rounded-full bg-primary-400/10 blur-[100px]"
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1.5 mb-6">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-400" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.08em] md:tracking-[0.2em] text-primary-500">
                  {PROMO_LABEL} · Inicia el {FECHA_INICIO}
                </span>
              </div>

              <h3 className="text-2xl md:text-4xl font-bold text-white/90 mb-4 leading-tight">
                Haz que la IA{" "}
                <span className="text-primary-400">trabaje para ti</span>
              </h3>
              <p className="text-[#b5b5b5] max-w-xl mx-auto mb-8">
                4 semanas, 8 clases en vivo y 5 entregables propios con Claude,
                sin escribir código.
              </p>

              {/* Chips de logística */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-base md:text-sm text-white/70">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <CalendarDays className="h-4 w-4 text-primary-400" />
                  Del {FECHA_INICIO} al {FECHA_FIN.replace(" de 2027", "")} · {FRECUENCIA}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <Clock className="h-4 w-4 text-primary-400" />
                  {HORARIO_CURSO}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <BadgeCheck className="h-4 w-4 text-primary-400" />
                  Certificación al finalizar
                </span>
              </div>

              <Link
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary-400 px-10 py-5 text-xl font-bold text-[#171717] shadow-lg shadow-primary-500/25 hover:bg-primary-300 transition-transform duration-200 hover:scale-[1.02] hover:shadow-primary-400/40 cursor-pointer"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
                <CheckCircle2 className="h-6 w-6" />
                Separar mi cupo — {EARLY_BIRD_PRICE_PEN}
                <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <p className="text-white/60 text-sm mt-4">
                {PROMO_VIGENCIA} · Consultas al{" "}
                <a
                  href={CONTACTO_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 underline decoration-primary-500/50 underline-offset-4 hover:text-primary-500"
                >
                  {CONTACTO_WHATSAPP}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar de inscripción — solo desktop grande, sigue el scroll */}
      <aside className="hidden xl:block xl:sticky xl:top-32">
        <div className={`${brandCard} p-6`}>
          <TopAccent />

          <div className="mb-4 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-primary-500/40 bg-primary-500/10 px-3 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-400" />
            </span>
            <span className="text-xs xl:text-[10px] font-semibold uppercase tracking-[0.06em] md:tracking-[0.15em] text-primary-500">
              Inicia el {FECHA_INICIO}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-white/85">
              Claude de 0 a 100
            </p>
            <span className="shrink-0 whitespace-nowrap rounded-md border border-primary-300/40 bg-primary-300/10 px-2 py-0.5 text-xs xl:text-[10px] font-bold uppercase tracking-[0.06em] md:tracking-[0.15em] text-primary-300">
              {PROMO_LABEL}
            </span>
          </div>

          <div className="mt-4 border-t border-dashed border-white/15 pt-4">
            <div className="flex items-baseline gap-2.5">
              <span className="text-4xl font-bold text-white drop-shadow-[0_0_24px_rgba(236,176,51,0.3)]">
                {EARLY_BIRD_PRICE_PEN}
              </span>
              <span className="text-lg text-white/60 line-through">
                {REGULAR_PRICE_PEN}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-full border border-primary-400/30 bg-primary-400/10 px-2.5 py-0.5 text-xs xl:text-[11px] font-bold text-primary-400">
                {DESCUENTO}
              </span>
              <span className="text-xs xl:text-[10px] uppercase tracking-[0.06em] md:tracking-[0.15em] text-white/60">
                Precio {PROMO_LABEL}
              </span>
            </div>
          </div>
          <p className="text-white/60 text-xs mt-2">
            Precio en soles peruanos (PEN), por persona.
          </p>
          <p className="mt-2 text-xs font-semibold text-primary-400">
            {PROMO_VIGENCIA}
          </p>
          <p className="mt-1 text-xs text-[#b5b5b5]">
            {CUOTAS} · Pack dúo: {PACK_DUO}
          </p>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="mb-2.5 text-xs xl:text-[10px] font-semibold uppercase tracking-[0.06em] md:tracking-[0.15em] text-white/60">
              Martes y jueves — tu hora local
            </p>
            <ul className="space-y-3 text-[15px] md:text-xs text-white/70">
              {HORARIOS_PAIS.map((h) => (
                <li
                  key={h.time}
                  className="flex items-center justify-between gap-3"
                >
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
                    className="h-9 w-9 rounded-full border-2 border-[#1e1e1e] bg-white/10 animate-pulse"
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
                    className="h-9 w-9 rounded-full border-2 border-[#1e1e1e] object-cover"
                  />
                ))
              ) : (
                [
                  { name: "Maria", bg: "ecb033" },
                  { name: "Carlos", bg: "e4911c" },
                  { name: "Ana", bg: "ca6e15" },
                ].map((u) => (
                  <Image
                    key={u.name}
                    src={`https://ui-avatars.com/api/?name=${u.name}&background=${u.bg}&color=fff&size=36`}
                    alt="Usuario"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border-2 border-[#1e1e1e]"
                  />
                ))
              )}
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1e1e1e] bg-primary-400">
                <span className="text-xs xl:text-[10px] font-bold text-[#171717]">
                  +300
                </span>
              </div>
            </div>
            <p className="text-[15px] md:text-xs leading-relaxed text-[#b5b5b5]">
              Más de 300 personas ya se formaron en IA con Coding Latam. Sé
              parte de la cohorte que inicia el {FECHA_INICIO}.
            </p>
          </div>

          <Link
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-5 flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary-400 px-6 py-4 font-bold text-[#171717] shadow-lg shadow-primary-500/25 hover:bg-primary-300 transition-transform duration-200 hover:scale-[1.02] hover:shadow-primary-400/40 cursor-pointer"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
            <CheckCircle2 className="h-5 w-5" />
            Separar mi cupo
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          {/* El sidebar solo se ve en desktop (xl): versión A4. */}
          <a
            href={BROCHURE_URL}
            download="Claude de 0 a 100 - Brochure.pdf"
            className="mt-2.5 flex items-center justify-center gap-2 rounded-lg border border-[#3d3d3d] px-6 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-primary-400/60 hover:text-primary-400"
          >
            <Download className="h-4 w-4" />
            Descargar brochure (PDF)
          </a>
          <p className="text-center text-white/60 text-xs xl:text-[11px] mt-3">
            Mercado Pago · Yape · Plin · Transferencia · PayPal
          </p>
          <p className="text-center text-white/60 text-xs xl:text-[11px] mt-1">
            Consultas al{" "}
            <a
              href={CONTACTO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 underline decoration-primary-500/50 underline-offset-4 hover:text-primary-500"
            >
              {CONTACTO_WHATSAPP}
            </a>
          </p>

          <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-[15px] md:text-xs text-white/70">
            {SIDEBAR_BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary-400 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Barra de precio + CTA fija en mobile: el sidebar con el precio
          está oculto (xl:hidden en el aside de arriba). Fondo sólido (sin
          backdrop-blur): combinado con el navbar fijo, el blur en un
          segundo elemento "fixed" hacía que Safari en iOS renderizara mal
          el navbar al hacer scroll. */}
      <div
        id="mobile-price-bar"
        className="xl:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#3d3d3d] bg-[#171717] px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
      >
        {/* Una sola fila: precio a la izquierda, CTA a la derecha. */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-primary-400">
              {PROMO_LABEL} · {DESCUENTO}
            </p>
            <p className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="text-2xl font-bold leading-tight text-white">
                {EARLY_BIRD_PRICE_PEN}
              </span>
              <span className="text-xs text-white/60 line-through">
                {REGULAR_PRICE_PEN}
              </span>
            </p>
          </div>
          <Link
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary-400 px-4 py-2.5 text-sm font-bold text-[#171717] shadow-lg shadow-primary-500/25 hover:bg-primary-300"
          >
            Separar cupo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}
