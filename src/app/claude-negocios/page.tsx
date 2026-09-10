"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WaitlistAvatar } from "@/types/waitlist";
import {
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Video,
  X,
  CalendarDays,
  Building2,
  Laptop,
  Sparkles,
  ShieldCheck,
  MessageSquareText,
  FileSearch,
  PenLine,
  Search,
  Bot,
  Link2,
  LayoutGrid,
  Lock,
} from "lucide-react";
import {
  Eyebrow,
  cardClass,
  TopAccent,
  TerminalSnippet,
  PEFlag,
  COFlag,
  ECFlag,
  MXFlag,
  ARFlag,
  CLFlag,
  LinkedInIcon,
  useScrollReveal,
} from "@/components/claude-brochure";
import { useCurrency } from "@/contexts/CurrencyContext";
import angeloImage from "@/assets/angelo.jpeg";
import yapeImage from "@/assets/yape.svg";
import plinImage from "@/assets/plin.svg";
import yapeQR from "@/assets/yape-qr.jpeg";

const FECHA_INICIO = "6 de octubre";
const FECHA_FIN = "5 de noviembre de 2026";
const HORARIO_CURSO = "8:00 – 10:00 PM (hora Perú)";
const FRECUENCIA = "Martes y jueves · 4 semanas";
const FECHAS_SESIONES =
  "Octubre 6, 8, 20, 22, 27 y 29 · Noviembre 3 y 5";
const CONTACTO_WHATSAPP = "+51 964225808";
const CONTACTO_WHATSAPP_URL =
  "https://wa.me/51964225808?text=" +
  encodeURIComponent(
    "Hola, quiero inscribirme al curso Claude para Negocios (6 oct - 5 nov 2026)."
  );
const CONTACTO_EMAIL = "angelo@codinglatam.dev";

// Mismo horario real convertido a la hora local de cada país (verificado
// para las fechas del curso, 6 oct - 5 nov 2026, con receso la semana del
// 13-15 de octubre). Perú, Colombia y
// Ecuador no tienen horario de verano (UTC-5 todo el año). México (zona
// Centro) tampoco desde 2022 (UTC-6 fijo). Argentina es UTC-3 fijo, y
// Chile entra en horario de verano (UTC-3) el 6 de setiembre de 2026, así
// que durante el curso coincide con Argentina. Si cambia el horario de
// verano de Chile o Argentina, hay que revisar estos horarios.
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

// Checkout del producto en Hotmart. Si en el panel creas una oferta
// específica, añade "?off=CODIGO_OFERTA" al link.
const CHECKOUT_URL = "https://pay.hotmart.com/T107518538H?checkoutMode=10";

// El precio real que cobra Hotmart está fijado en soles (S/ 299). Este
// valor en USD es la base de conversión para mostrar un estimado en la
// moneda local del visitante fuera de Perú; el monto final y la moneda
// de cobro los confirma el checkout de Hotmart.
const PRECIO_USD = 89;

// formatPrice() usa Intl.NumberFormat y cae a "298,99 PEN" con el locale
// genérico es-ES; con el locale del propio país imprime el símbolo nativo
// ("S/ 298.99", "MX$298.99", etc.).
const CURRENCY_LOCALE: Record<string, string> = {
  USD: "en-US",
  MXN: "es-MX",
  BRL: "pt-BR",
  ARS: "es-AR",
  CLP: "es-CL",
  COP: "es-CO",
  PEN: "es-PE",
  UYU: "es-UY",
  BOB: "es-BO",
  PYG: "es-PY",
};

export default function ClaudeNegociosPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  useScrollReveal(contentRef);
  const {
    currentCurrency,
    exchangeRates,
    isLoading: currencyLoading,
  } = useCurrency();
  // Redondeo a número entero en vez del ".99" psicológico que aplica
  // convertAndFormatPrice() del contexto compartido (usado en Pricing).
  const formatLocalPrice = (usdPrice: number) => {
    const rate = exchangeRates[currentCurrency.code] || 1;
    const rounded = Math.round(usdPrice * rate);
    const locale = CURRENCY_LOCALE[currentCurrency.code] || "es-PE";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currentCurrency.code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(rounded);
    } catch {
      return `${currentCurrency.symbol}${rounded}`;
    }
  };

  // Prueba social del sidebar: avatares reales y conteo de certificados
  // emitidos en toda la plataforma (no exclusivo de este curso — esta es
  // su primera cohorte, así que no podemos afirmar que ya la tomaron).
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

  // Para quién es / no es
  const esPara = [
    "Trabajas con documentos, correos, reportes o clientes todos los días",
    "Tienes un negocio propio y haces de todo un poco",
    "Usas Claude o ChatGPT a ratos, pero sientes que le sacas el 10 %",
    "Quieres dejar de improvisar prompts y armar procesos que se repiten solos",
    "Lideras un equipo y necesitas decidir cómo adoptar IA sin exponer datos",
  ];

  const noEsPara = [
    "Buscas programar o automatizar con código: eso es la cohorte de Claude Code",
    "Quieres solo una lista de prompts para copiar y pegar",
    "Esperas que la IA trabaje sin que tú revises nada",
  ];

  const requisitos = [
    "Una computadora con internet",
    "Cuenta de Claude (la gratuita basta)",
    "Un caso real de tu trabajo para usar como proyecto",
    "Cero experiencia técnica",
  ];

  // Cómo son las clases
  const estructuraClase = [
    {
      tiempo: "20 min",
      title: "Concepto",
      text: "La idea de la sesión explicada con ejemplos de negocio, no de laboratorio.",
    },
    {
      tiempo: "60 min",
      title: "Práctica guiada",
      text: "Trabajas sobre tu propio caso mientras el instructor acompaña en vivo.",
    },
    {
      tiempo: "20 min",
      title: "Reto individual",
      text: "Un ejercicio corto para comprobar que puedes hacerlo sin ayuda.",
    },
    {
      tiempo: "20 min",
      title: "Preguntas",
      text: "Espacio abierto para dudas, casos particulares y trabas del día a día.",
    },
  ];

  // Temario semanas 1-4
  const temario = [
    {
      week: "Semana 1",
      classes: [
        {
          icon: Sparkles,
          n: 1,
          title: "Deja de preguntarle a la IA y empieza a delegarle",
          items: [
            "Qué es un modelo de lenguaje y por qué a veces inventa",
            "Recorrido de la interfaz: chats, adjuntos, estilos, modo de voz",
            "Anatomía de una instrucción útil: contexto, rol, formato, ejemplos",
            "Iterar en lugar de repreguntar desde cero",
            "Pensamiento extendido: cuándo activarlo",
            "Preferencias de usuario: configurar a Claude una sola vez",
          ],
          entregable: "Tu primer prompt reutilizable",
        },
        {
          icon: FileSearch,
          n: 2,
          title: "Lee 200 páginas en 10 minutos",
          items: [
            "Subir PDFs, Word, Excel, imágenes y capturas",
            "Extraer y comparar: contratos, actas, cotizaciones, estados de cuenta",
            "Análisis de una hoja de cálculo sin saber fórmulas",
            "Generar archivos listos para enviar: Word, Excel, PowerPoint, PDF",
            "Artifacts: documentos y visualizaciones editables dentro del chat",
          ],
          entregable: "Un informe ejecutivo a partir de un documento propio",
        },
      ],
    },
    {
      week: "Semana 2",
      classes: [
        {
          icon: PenLine,
          n: 3,
          title: "Escribe con tu propia voz, en la décima parte del tiempo",
          items: [
            "Correos difíciles: cobranzas, quejas, negociaciones, decir que no",
            "Propuestas comerciales e informes para clientes",
            "Contenido para redes, guiones y newsletters",
            "Capturar la voz de tu marca y convertirla en plantilla",
            "Estilos personalizados, traducción y adaptación de registro",
          ],
          entregable: "Tu plantilla de voz de marca",
        },
        {
          icon: Search,
          n: 4,
          title: "Investiga en minutos y detecta cuando la IA te miente",
          items: [
            "Búsqueda web: cómo pedir información actual y verificable",
            "Análisis de competencia, proveedores y mercado",
            "Cómo detectar cuando Claude se equivoca o inventa una fuente",
            "Contrastar, pedir citas y verificar",
            "Sesgos, límites y qué nunca delegar",
          ],
          entregable: "Mini-informe de mercado de tu rubro",
        },
      ],
    },
    {
      week: "Semana 3",
      classes: [
        {
          icon: Bot,
          n: 5,
          title: "Construye tu primer agente sin escribir código",
          items: [
            "Qué es y qué no es un agente: expectativas realistas",
            "El problema de repetir el mismo prompt cada semana",
            "Memoria: qué recuerda Claude de ti y cómo editarla",
            "Skills: empaquetar una tarea repetida en algo que Claude ejecuta solo",
            "Construir tu primera Skill, sin escribir código",
            "Organizar tu base de conocimiento de trabajo",
          ],
          entregable: "Una Skill funcionando",
        },
        {
          icon: Link2,
          n: 6,
          title: "Conecta tu agente a Gmail, Drive y Calendar",
          items: [
            "Qué son los conectores y qué significa dar acceso",
            "Conectar Gmail, Google Drive y Calendar",
            "Triaje de bandeja de entrada y redacción de respuestas",
            "Buscar y cruzar información de tus propios archivos",
            "Automatizar un flujo real de punta a punta",
          ],
          entregable: "Un flujo automatizado de tu día a día",
        },
      ],
    },
    {
      week: "Semana 4",
      classes: [
        {
          icon: LayoutGrid,
          n: 7,
          title: "El agente que tu área necesita",
          items: [
            "Ventas y marketing: prospección, propuestas, contenido, seguimiento",
            "Finanzas y operaciones: conciliaciones, reportes, control de costos",
            "RR. HH.: descripciones de puesto, filtrado de CVs, inducción",
            "Atención al cliente: respuestas, base de conocimiento, reclamos",
            "Administrativo y legal: contratos, actas, trámites, licitaciones",
            "Negocios pequeños: catálogo, precios, redes, atención por WhatsApp",
          ],
          entregable: "Avance de tu proyecto final sobre un caso real",
        },
        {
          icon: Lock,
          n: 8,
          title: "Usa IA sin filtrar los datos de tu empresa",
          items: [
            "Qué datos nunca subir: DNI, datos de clientes, información confidencial",
            "Configuración de privacidad, entrenamiento de modelos y chats incógnito",
            "Política interna mínima para un equipo",
            "Cómo medir el retorno: qué tarea, cuánto tiempo, cuánto ahorró",
            "Cuándo el plan gratis deja de alcanzar y qué plan corresponde",
          ],
          entregable: "Presentación del proyecto final y certificación",
        },
      ],
    },
  ];

  // Qué incluye la inscripción
  const incluye = [
    {
      icon: Video,
      title: "8 sesiones en vivo",
      text: "Clases con cámara y preguntas abiertas, no videos pregrabados. 16 horas de instrucción directa.",
    },
    {
      icon: Video,
      title: "Grabaciones de todas las clases",
      text: "Si faltas o quieres repasar, la grabación queda disponible sin fecha de vencimiento.",
    },
    {
      icon: FileSearch,
      title: "Materiales y plantillas descargables",
      text: "Prompts, checklists y plantillas listas para adaptar a tu trabajo desde el primer día.",
    },
    {
      icon: CheckCircle2,
      title: "Revisión de tu proyecto final",
      text: "Feedback individual sobre el caso real que trabajes durante el curso, no una corrección genérica.",
    },
    {
      icon: MessageSquareText,
      title: "Canal de preguntas durante el curso",
      text: "Resuelve dudas entre clase y clase, con respuesta del instructor durante las cuatro semanas.",
    },
    {
      icon: BadgeCheck,
      title: "Certificado verificable",
      text: "Con código de verificación propio, listo para tu perfil de LinkedIn y tu hoja de vida.",
    },
    {
      icon: FileSearch,
      title: "Factura o boleta",
      text: "A tu nombre o al de tu empresa, para que puedas cargarlo como gasto de capacitación.",
    },
    {
      icon: ShieldCheck,
      title: "Sin suscripción obligatoria",
      text: "Todos los ejercicios corren con la cuenta gratuita de Claude. No necesitas pagar nada más.",
    },
  ];

  // Qué te llevas al terminar
  const teLlevas = [
    "Delega tu trabajoa la IA",
    "Tareas repetitivas convertidas en Skills",
    "Flujos y tareas automatizadas",
    "Criterio para saber cuándo la IA se está equivocando",
    "Certificado al terminar el curso",
  ];

  // Testimonios reales de la cohorte de Claude Code (mismo instructor,
  // misma metodología en vivo). "Claude para Negocios" es su primera
  // cohorte y todavía no tiene egresados propios, así que estos se
  // presentan de forma explícita como testimonios de esa otra cohorte,
  // no como si fueran de este curso. Mismos urns que usa /claude — al
  // agregar egresados propios de este curso, reemplazar por esos.
  const testimonials: string[] = [
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7465867780463001600?collapsed=1",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7447303531075764224?collapsed=1",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7445646280707604480?collapsed=1",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7446270449925124096?collapsed=1",
  ];

  const toEmbedSrc = (ref: string) =>
    ref.startsWith("http")
      ? ref
      : `https://www.linkedin.com/embed/feed/update/${ref}`;

  return (
    <main
      className="pt-24 pb-16 mx-auto w-full max-w-7xl sm:px-6 px-4 lg:px-0 xl:grid xl:grid-cols-[1fr_360px] xl:gap-8 xl:items-start flex-grow min-w-0"
    >
      <div ref={contentRef} className="xl:min-w-0">
        {/* Hero */}
        <div className="relative text-center mb-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-6rem] -z-10 h-[28rem] w-[42rem] max-w-[110vw] -translate-x-1/2 rounded-full bg-claude/10 blur-[120px]"
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

          <div className="inline-flex items-center gap-2 rounded-full border border-claude-deep/40 bg-claude-deep/10 px-4 py-1.5 mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-claude opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-claude" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-claude-deep">
              Inscripciones abiertas — {FECHA_INICIO} de 2026
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white/90 mb-6 leading-[1.1]">
            Claude
            <br />
            <span className="text-claude underline decoration-claude-deep/50 decoration-2 underline-offset-[10px] drop-shadow-[0_0_30px_rgba(217,119,87,0.35)]">
              para Negocios
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-6">
            Aprende a <strong className="text-claude">delegarle tu trabajo diario a la IA</strong>{" "}
            y a construir tus propios agentes conectados a tus herramientas. Sin
            código, sin terminal, sin conocimientos técnicos previos.
          </p>

          {/* Anti-requisitos */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {["Sin código", "Sin terminal", "Sin experiencia técnica previa"].map(
              (p) => (
                <span
                  key={p}
                  className="rounded-full border border-claude/40 px-4 py-1.5 text-xs font-semibold text-claude"
                >
                  {p}
                </span>
              )
            )}
          </div>

          {/* Stats row */}
          <div className="flex justify-center mb-12">
            {[
              { value: "8", label: "Sesiones en vivo" },
              { value: "16", label: "Horas totales" },
              { value: "4", label: "Semanas" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`px-6 sm:px-10 text-center ${i > 0 ? "border-l border-white/10" : ""
                  }`}
              >
                <div className="text-3xl sm:text-4xl font-bold text-claude drop-shadow-[0_0_20px_rgba(217,119,87,0.25)]">
                  {stat.value}
                </div>
                <div className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <TerminalSnippet
            title="Claude — Chat"
            command="delegar"
            prompt="Lee estas 40 páginas de contrato y dime qué cláusulas revisar"
            result="Informe ejecutivo generado — 3 riesgos detectados"
          />
        </div>

        {/* Cuenta gratuita */}
        <div className={`${cardClass} border-claude-deep/40 bg-claude-deep/[0.06] p-6 sm:p-7 max-w-3xl mx-auto mb-16`}>
          <TopAccent />
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-claude shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white/90 mb-1.5">
                Se puede seguir completo con la cuenta gratuita
              </h3>
              <p className="text-sm text-white/60">
                Todo el curso está diseñado para funcionar con el plan gratuito
                de Claude. No necesitas pagar una suscripción para aprender ni
                para hacer los ejercicios.
              </p>
            </div>
          </div>
        </div>

        {/* Para quién es / no es */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <Eyebrow>Para quién es</Eyebrow>
            <h2 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Y para quién no
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`${cardClass} p-6`}>
              <TopAccent />
              <Eyebrow>Es para ti si</Eyebrow>
              <ul className="space-y-3 mt-4">
                {esPara.map((e) => (
                  <li key={e} className="flex items-start gap-2.5 text-sm text-white/70">
                    <CheckCircle2 className="h-4 w-4 text-claude shrink-0 mt-0.5" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${cardClass} p-6`}>
              <TopAccent />
              <Eyebrow>No es para ti si</Eyebrow>
              <ul className="space-y-3 mt-4 mb-6">
                {noEsPara.map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-sm text-white/60">
                    <X className="h-4 w-4 text-claude shrink-0 mt-0.5" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-white/10 pt-4">
                <Eyebrow>Requisitos</Eyebrow>
                <ul className="space-y-2 mt-3">
                  {requisitos.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-sm text-white/60">
                      <span className="text-claude mt-0.5">·</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Cómo son las clases */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-10">
            <Eyebrow>Cómo son las clases</Eyebrow>
            <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Dos horas en vivo, cámara y preguntas abiertas
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {estructuraClase.map((c) => (
              <div key={c.title} className={`${cardClass} p-5`}>
                <TopAccent />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-claude-deep">
                  {c.tiempo}
                </span>
                <h4 className="font-bold text-white/90 mt-2 mb-1.5">{c.title}</h4>
                <p className="text-sm text-white/60">{c.text}</p>
              </div>
            ))}
          </div>
          <div className={`${cardClass} p-6`}>
            <TopAccent />
            <p className="text-sm text-white/60">
              <strong className="text-white/90">Nada de teoría corrida.</strong>{" "}
              Todas las sesiones quedan grabadas, así que si una noche no puedes
              asistir, no pierdes el hilo del curso ni el material de esa clase.
            </p>
          </div>
        </div>

        {/* Fechas y pago */}
        <div className={`${cardClass} p-7 max-w-4xl mx-auto mb-8`}>
          <TopAccent />
          <Eyebrow>Fechas y pago</Eyebrow>
          <h3 className="text-xl font-bold text-white/90 mt-3 mb-5">
            Detalles del programa
          </h3>
          <dl className="text-sm border-t border-white/10">
            {[
              ["Duración", `${FECHA_INICIO} – ${FECHA_FIN}`],
              ["Sesiones", FECHAS_SESIONES],
              ["Días", "Martes y jueves"],
              ["Horario", HORARIO_CURSO],
              ["Modalidad", "Online en vivo"],
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
          <p className="text-xs text-white/40 mt-3">
            Sin clase la semana del 13 y 15 de octubre. Las sesiones se retoman
            el 20 de octubre sin afectar el temario ni el total de 8 sesiones.
          </p>
          <div className="rounded-xl border border-claude-deep/40 bg-claude-deep/5 p-4 mt-5">
            <p className="text-sm text-white/70">
              <strong className="text-white/90">Puedes pagar en 2 partes.</strong>{" "}
              50 % al inscribirte y el 50 % restante, como máximo, al terminar
              la primera sesión. Sin costo adicional y sin perder el precio
              con el que reservaste.
            </p>
          </div>
        </div>

        {/* CTA de inscripción */}
        <div className={`${cardClass} p-8 md:p-12 max-w-4xl mx-auto text-center`}>
          <TopAccent />
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-4">
            Asegura tu cupo
          </h2>
          <p className="text-white/50 mb-6 text-lg">
            Inicia el {FECHA_INICIO} de 2026
          </p>

          <Link
            href={CHECKOUT_URL}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-claude-deep to-claude px-10 py-5 text-xl font-bold text-white shadow-lg shadow-claude-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-claude/40 cursor-pointer"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
            <CheckCircle2 className="h-6 w-6" />
            Inscribirme ahora
            <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <p className="text-white/40 text-sm mt-4">
            Pago seguro procesado por Hotmart · Tarjeta, cuotas y métodos locales
          </p>
          <p className="text-white/40 text-sm mt-1">
            Consultas al{" "}
            <a
              href={CONTACTO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-claude underline decoration-claude-deep/50 underline-offset-4 hover:text-claude-deep"
            >
              {CONTACTO_WHATSAPP}
            </a>
          </p>
        </div>

        {/* Medios de pago alternativos — solo para Perú (Yape/Plin/transferencia
          en soles no aplican fuera del país). Mientras se detecta la moneda
          se asume Perú para no hacerlo aparecer de golpe para la mayoría del
          público, que sí es de Perú. */}
        {(currencyLoading || currentCurrency.code === "PEN") && (
          <div className={`${cardClass} p-8 md:p-12 max-w-4xl mx-auto mt-8`}>
            <TopAccent />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Eyebrow>¿Prefieres transferencia?</Eyebrow>
                <h3 className="text-xl font-bold text-white/90 mt-2 mb-4">
                  Transferencia bancaria
                </h3>
                <p className="text-sm text-white/50 mb-4">
                  El pago con tarjeta o en cuotas se hace por Hotmart con el
                  botón de arriba. Si prefieres Yape, Plin o transferencia
                  directa, usa estos datos y envía tu voucher por WhatsApp.
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
                      <dt className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                        {k}
                      </dt>
                      <dd className="text-right font-semibold text-white/80">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="rounded-xl border border-claude-deep/40 bg-claude-deep/5 p-4 mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <PEFlag />
                    <h4 className="text-lg font-bold text-white/90">
                      ¿Prefieres Yape o Plin?
                    </h4>
                  </div>
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
                  <p className="text-white/60 text-sm">
                    Envía tu comprobante al{" "}
                    <b className="text-white/90">{CONTACTO_WHATSAPP}</b> para
                    completar tu registro.
                  </p>
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
                  <p className="w-full text-center text-sm font-semibold uppercase tracking-[0.15em] text-claude-deep">
                    Paga con QR
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Temario */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Eyebrow>Temario · 8 sesiones en 4 semanas</Eyebrow>
            <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              ¿Qué vas a dominar?
            </h3>
            <p className="text-white/50 max-w-2xl mx-auto">
              De delegar y leer documentos a construir tus propios agentes
              conectados a tus herramientas de trabajo.
            </p>
          </div>

          {temario.map((block) => (
            <div key={block.week} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Eyebrow>{block.week}</Eyebrow>
                <span className="h-px flex-grow bg-white/10" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {block.classes.map((cls) => (
                  <div key={cls.n} className={`${cardClass} p-6 flex flex-col`}>
                    <TopAccent />
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-claude-deep/30 bg-claude-deep/10">
                        <cls.icon className="h-4 w-4 text-claude" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-claude-deep">
                        Sesión {cls.n}
                      </span>
                    </div>
                    <h4 className="font-bold text-white/90 mb-4">{cls.title}</h4>
                    <ul className="space-y-2 text-sm text-white/60">
                      {cls.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-claude mt-0.5">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-auto pt-5 flex items-start gap-2 text-sm font-medium text-terminal-green">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{cls.entregable}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className={`${cardClass} p-6`}>
            <TopAccent />
            <p className="text-sm text-white/60">
              <strong className="text-white/90">Nota sobre planes.</strong>{" "}
              Projects, Cowork y Research son funciones de pago. En el curso se
              muestran en vivo desde la cuenta del instructor para que sepas qué
              existe, pero ningún ejercicio evaluado las requiere.
            </p>
          </div>
        </div>

        {/* Qué incluye la inscripción */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>Inversión</Eyebrow>
            <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3">
              ¿Qué incluye tu inscripción?
            </h3>
            <p className="text-white/50 max-w-2xl mx-auto mt-2">
              Todo lo de abajo entra en el precio, sin costos adicionales
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incluye.map((inc) => (
              <div
                key={inc.title}
                className={`${cardClass} p-6 flex items-start gap-4`}
              >
                <TopAccent />
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-claude-deep/30 bg-claude-deep/10 shrink-0">
                  <inc.icon className="h-5 w-5 text-claude" />
                </span>
                <div>
                  <h4 className="font-bold text-white/90 mb-1">{inc.title}</h4>
                  <p className="text-sm text-white/60">{inc.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qué te llevas al terminar */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Eyebrow>Resultados</Eyebrow>
            <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
              Qué te llevas al terminar
            </h3>
            <p className="text-white/50 max-w-2xl mx-auto">
              Cada sesión cierra con algo que ya puedes usar en tu trabajo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teLlevas.map((e) => (
              <div key={e} className={`${cardClass} p-5 flex items-start gap-3.5`}>
                <TopAccent />
                <CheckCircle2 className="h-5 w-5 text-claude shrink-0 mt-0.5" />
                <p className="text-sm text-white/70">{e}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="mb-8">
            <Eyebrow>Instructor</Eyebrow>
            <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3">
              Quien te guía
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
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-claude-deep mb-1">
                  Docente principal
                </div>
                <h4 className="text-2xl font-bold text-white/90">Angelo Leva</h4>
                <p className="text-claude text-sm mt-1">
                  Senior Software Engineer &amp; GDG Organizer · Founder, Coding
                  Latam
                </p>
              </div>
            </div>
            <div className="space-y-4 text-sm text-white/60">
              <p>
                Ingeniero de software con más de 10 años de experiencia y
                organizador de GDG Tacna. Fundador de Coding Latam, donde ha
                formado a cientos de profesionales de la región en herramientas
                de IA.
              </p>
              <p>
                Dicta capacitaciones corporativas de Claude para empresas y
                universidades en Perú, enseñando a equipos sin experiencia
                técnica a delegar trabajo real en agentes de IA.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Claude",
                "Agentes de IA",
                "Automatización sin código",
                "Skills",
                "Conectores",
                "Productividad",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonios */}
        {testimonials.length > 0 && (
          <div className="relative mt-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-72 w-[80%] max-w-4xl rounded-full bg-claude/10 blur-[100px]"
            />

            <div className="relative max-w-4xl mx-auto text-center mb-12 px-4">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-16 left-0 select-none font-bold leading-none text-claude/[0.07] text-[10rem] sm:text-[13rem]"
              >
                &ldquo;
              </span>
              <Eyebrow>Testimonios</Eyebrow>
              <h3 className="relative text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
                La misma metodología, alumnos reales
              </h3>
              <p className="relative text-white/50 max-w-2xl mx-auto mb-4">
                Estos testimonios son de la cohorte de{" "}
                <strong className="text-white/80">Claude Code</strong>, el
                curso de programación de Angelo — mismo instructor, misma
                metodología en vivo y el mismo nivel de acompañamiento que
                vas a tener en Claude para Negocios.
              </p>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0a66c2]/30 bg-[#0a66c2]/10 px-3.5 py-1.5">
                <LinkedInIcon className="h-3.5 w-3.5 text-[#0a66c2]" />
                <span className="text-xs font-medium text-white/60">
                  Alumnos de Coding Latam
                </span>
              </span>
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
                {[...testimonials, ...testimonials].map((ref, i) => {
                  const isClone = i >= testimonials.length;
                  const n = (i % testimonials.length) + 1;
                  return (
                    <figure
                      key={i}
                      aria-hidden={isClone}
                      className="group/card relative flex w-[86vw] max-w-[460px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-claude/40 hover:shadow-[0_16px_50px_-12px_rgba(217,119,87,0.4)]"
                    >
                      <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-claude/80 via-claude/20 to-transparent transition-opacity duration-300 group-hover/card:via-claude/60" />

                      <figcaption className="flex items-center gap-2 border-b border-white/10 bg-black/40 px-4 py-2.5">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-claude/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                        </span>
                        <span className="ml-1 truncate text-xs text-white/40">
                          testimonio-0{n}.md
                        </span>
                        <LinkedInIcon className="ml-auto h-3.5 w-3.5 text-[#0a66c2]/70 transition-colors duration-300 group-hover/card:text-[#0a66c2]" />
                      </figcaption>

                      <iframe
                        src={toEmbedSrc(ref)}
                        title={`Testimonio de alumno en LinkedIn ${n}`}
                        className="block h-[520px] w-full bg-[#f3f2ef]"
                        frameBorder="0"
                        allowFullScreen
                        loading="lazy"
                        tabIndex={isClone ? -1 : undefined}
                      />
                    </figure>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Empresas */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className={`${cardClass} p-7 flex items-start gap-4`}>
            <TopAccent />
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-terminal-green/30 bg-terminal-green/10">
              <Building2 className="h-5 w-5 text-terminal-green" />
            </span>
            <div>
              <h4 className="font-bold text-white/90 mb-1">
                ¿Capacitación para tu equipo?
              </h4>
              <p className="text-sm text-white/60">
                Este programa también se dicta in-company, adaptado a los
                procesos de tu organización. Escríbenos a{" "}
                <a
                  href={`mailto:${CONTACTO_EMAIL}`}
                  className="text-claude underline decoration-claude-deep/50 underline-offset-4 hover:text-claude-deep"
                >
                  {CONTACTO_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className={`${cardClass} relative p-8 md:p-12 text-center`}>
            <TopAccent />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-48 w-3/4 -translate-x-1/2 rounded-full bg-claude/10 blur-[100px]"
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-claude-deep/40 bg-claude-deep/10 px-4 py-1.5 mb-6">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-claude opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-claude" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-claude-deep">
                  Inscripciones abiertas
                </span>
              </div>

              <h3 className="text-2xl md:text-4xl font-bold text-white/90 mb-4 leading-tight">
                Delega tu trabajo diario a la{" "}
                <span className="text-claude">IA, sin código</span>
              </h3>
              <p className="text-white/55 max-w-xl mx-auto mb-8">
                4 semanas, 8 sesiones en vivo, un proyecto real sobre tu propio
                trabajo.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm text-white/70">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <CalendarDays className="h-4 w-4 text-claude" />
                  {FRECUENCIA} · {HORARIO_CURSO}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <Laptop className="h-4 w-4 text-claude" />
                  Sin código · sin terminal
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                  <BadgeCheck className="h-4 w-4 text-claude" />
                  Certificado verificable
                </span>
              </div>

              <Link
                href={CHECKOUT_URL}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-claude-deep to-claude px-10 py-5 text-xl font-bold text-white shadow-lg shadow-claude-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-claude/40 cursor-pointer"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
                <CheckCircle2 className="h-6 w-6" />
                Inscribirme —{" "}
                {currencyLoading ? "···" : formatLocalPrice(PRECIO_USD)}
                <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <p className="text-white/40 text-sm mt-4">
                Inicia el {FECHA_INICIO} · Consultas al{" "}
                <a
                  href={CONTACTO_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-claude underline decoration-claude-deep/50 underline-offset-4 hover:text-claude-deep"
                >
                  {CONTACTO_WHATSAPP}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar de inscripción — solo desktop grande, sigue el scroll */}
      <aside className="hidden xl:block xl:sticky xl:top-24">
        <div className={`${cardClass} p-6`}>
          <TopAccent />

          <div className="inline-flex items-center gap-1.5 rounded-full border border-claude-deep/40 bg-claude-deep/10 px-3 py-1 mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-claude opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-claude" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-claude-deep">
              Próximo inicio · {FECHA_INICIO} 2026
            </span>
          </div>

          <p className="text-sm font-bold text-white/85">
            Claude para Negocios
          </p>

          <div className="mt-4 border-t border-dashed border-white/15 pt-4">
            <span className="text-4xl font-bold text-white drop-shadow-[0_0_24px_rgba(217,119,87,0.3)]">
              {currencyLoading ? (
                <span className="animate-pulse">···</span>
              ) : (
                formatLocalPrice(PRECIO_USD)
              )}
            </span>
            <p className="text-xs font-semibold text-white/50 mt-1">
              Pago único. Sin mensualidades.
            </p>
          </div>
          <p className="text-white/40 text-xs mt-2">
            {!currencyLoading && currentCurrency.code !== "PEN" ? (
              <>
                {currentCurrency.flag} Estimado en {currentCurrency.name}
              </>
            ) : (
              "Precio en soles peruanos (PEN), por persona."
            )}
          </p>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
              Martes y jueves — tu hora local
            </p>
            <ul className="space-y-3 text-xs text-white/70">
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
                  {
                    name: "Maria",
                    bg: "c15f3c",
                  },
                  {
                    name: "Carlos",
                    bg: "d97757",
                  },
                  {
                    name: "Ana",
                    bg: "87a96b",
                  },
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
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#161616] bg-claude">
                <span className="text-[10px] font-bold text-white">
                  +{certCount ?? "…"}
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-white/50">
              {typeof certCount === "number" ? (
                <>Más de {certCount} personas</>
              ) : (
                "Cientos de personas"
              )}{" "}
              ya se certificaron con Coding Latam. Sé parte del próximo
              inicio.
            </p>
          </div>

          <Link
            href={CHECKOUT_URL}
            className="group relative mt-5 flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-claude-deep to-claude px-6 py-4 font-bold text-white shadow-lg shadow-claude-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-claude/40 cursor-pointer"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
            <CheckCircle2 className="h-5 w-5" />
            Inscribirme ahora
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <p className="text-center text-white/40 text-[11px] mt-3">
            Pago seguro por Hotmart · Tarjeta, cuotas y métodos locales
          </p>
          <p className="text-center text-white/40 text-[11px] mt-1">
            Consultas al{" "}
            <a
              href={CONTACTO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-claude underline decoration-claude-deep/50 underline-offset-4 hover:text-claude-deep"
            >
              {CONTACTO_WHATSAPP}
            </a>
          </p>

          <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-xs text-white/70">
            {teLlevas.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-claude shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  );
}
