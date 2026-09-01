"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  BadgeCheck,
  Video,
  Sparkles,
  Mail,
  Table2,
  Palette,
  Wand2,
  Globe,
  AlertTriangle,
  Clock,
  Coffee,
  Building2,
  X,
  MonitorSmartphone,
  Wifi,
} from "lucide-react";
import {
  Eyebrow,
  cardClass,
  TopAccent,
  TerminalSnippet,
  PEFlag,
  useScrollReveal,
} from "@/components/claude-brochure";
import angeloImage from "@/assets/angelo.jpeg";
import yapeImage from "@/assets/yape.svg";
import plinImage from "@/assets/plin.svg";
import yapeQR from "@/assets/yape-qr.jpeg";

const FECHA_TALLER = "Sábado 5 de setiembre";
const HORARIO_TALLER = "9:00 AM – 11:00 AM (hora Perú)";
const CHECKOUT_URL = "https://mpago.la/1AtG6Sd";
const CONTACTO_WHATSAPP = "+51 964225808";
const CONTACTO_EMAIL = "angelo@codinglatam.dev";

const PRECIO_PEN = "S/ 99";

export default function ClaudeNoProgramadoresPage() {
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef);

  // El caso: una inmobiliaria con una hoja de ventas por agente, de punta a punta.
  const caso = [
    {
      icon: Table2,
      n: 1,
      tag: "Cowork",
      title: "Un dashboard interactivo desde una hoja de cálculo",
      text: "Tu asistente lee el Excel y construye un tablero web con las ventas por agente. Tú solo lo describes.",
    },
    {
      icon: Palette,
      n: 2,
      tag: "Conectores · Canva",
      title: "Una pieza gráfica para el cliente",
      text: "Conectas Canva a tu asistente y generas opciones de diseño desde un prompt. Eliges la que más te gusta.",
    },
    {
      icon: Mail,
      n: 3,
      tag: "Conectores · Gmail",
      title: "Se lo mandas a tu equipo",
      text: "Conectas tu correo y distribuyes el tablero y la pieza gráfica sin salir del asistente.",
    },
    {
      icon: Wand2,
      n: 4,
      tag: "Skills",
      title: "Que se repita solo el próximo mes",
      text: "Creas tu primera Skill: le enseñas a tu asistente tu forma de trabajar para no volver a explicársela.",
    },
    {
      icon: Globe,
      n: 5,
      tag: "Claude Code · demostración",
      title: "Y ves cómo se publica con dominio propio",
      text: "La diferencia entre un artefacto, un archivo tuyo y una web real en internet.",
    },
  ];

  // Esto NO es
  const noEs = [
    "No es un curso de programación.",
    "No vas a escribir código.",
    "No vas a tocar la terminal — todo pasa en la app de escritorio.",
    "No necesitas saber qué es una función, una base de datos ni un framework.",
  ];

  // Minuto a minuto de la sesión (2 horas)
  const agenda = [
    {
      time: "00:00",
      dur: "8 min",
      title: "El resultado, primero",
      text: "Ves el dashboard, la pieza gráfica y el correo ya terminados. Empezamos mostrando a dónde vamos a llegar.",
    },
    {
      time: "00:08",
      dur: "12 min",
      title: "Instala tu asistente — sin terminal",
      text: "Claude Desktop paso a paso. Las tres pestañas: Chat, Cowork y Code — qué hace cada una y cuál usar en cada momento.",
    },
    {
      time: "00:20",
      dur: "10 min",
      title: "Modo plan: cómo pedir las cosas bien",
      text: "Calentamiento sobre una carpeta de archivos. Aprendes a revisar y aprobar antes de que tu asistente ejecute nada.",
    },
    {
      time: "00:30",
      dur: "25 min",
      title: "Del Excel al dashboard",
      text: "El bloque central. Cowork lee la hoja de ventas de la inmobiliaria y construye un tablero interactivo por agente.",
    },
    { time: "00:55", dur: "5 min", title: "Descanso", text: "", break: true },
    {
      time: "01:00",
      dur: "20 min",
      title: "Conectores: tu asistente usa Canva",
      text: "Conectas Canva y generas la pieza gráfica del negocio desde un prompt, con varias opciones para elegir.",
    },
    {
      time: "01:20",
      dur: "12 min",
      title: "Distribuir con Gmail",
      text: "Conectas tu correo y le mandas a tu equipo el tablero y la pieza, sin copiar ni pegar nada.",
    },
    {
      time: "01:32",
      dur: "18 min",
      title: "Skills: enséñale tu forma de trabajar",
      text: "Creas tu primera Skill para que el reporte se repita solo cada mes. Este es el entregable que más vas a usar después del taller.",
    },
    {
      time: "01:50",
      dur: "6 min",
      title: "Artefacto, archivo y web propia",
      text: "Demostración: qué diferencia hay entre los tres y cómo se ve un proyecto publicado con dominio personalizado.",
    },
    {
      time: "01:56",
      dur: "4 min",
      title: "Cierre y siguiente paso",
      text: "",
    },
  ];

  // Lo que te llevas construido
  const entregables = [
    "Claude Desktop instalado y configurado desde cero, sin terminal.",
    "Un dashboard interactivo generado a partir de una hoja de cálculo.",
    "Una pieza gráfica creada con Canva desde tu asistente.",
    "Gmail, Drive y Calendar conectados y funcionando.",
    "Tu primera Skill propia, creada en vivo y lista para reutilizar.",
    "Criterio de uso: cuándo abrir Chat, cuándo Cowork y cuándo Code.",
    "Prompts que funcionan — el modo plan como hábito, no como truco.",
    "Grabación de la sesión, con acceso de por vida.",
    "Certificado de participación.",
  ];

  // Metodología
  const metodologia = [
    {
      n: "01",
      title: "Un solo caso, de punta a punta",
      text: "No ves ocho demos sueltas. Ves un caso real recorrido completo, desde el archivo crudo hasta el correo enviado.",
    },
    {
      n: "02",
      title: "Cero jerga técnica",
      text: "Si sabes explicar una idea por escrito, ya sabes usar esto. No hay vocabulario nuevo que memorizar.",
    },
    {
      n: "03",
      title: "Aplicable a tu trabajo",
      text: "Practicamos con un archivo que te damos y sales sabiendo repetir el mismo flujo con los tuyos.",
    },
  ];

  // Requisitos obligatorios
  const requisitos = [
    {
      icon: Sparkles,
      title: "Plan Claude Pro — desde US$ 20 al mes",
      text: "Contrátalo con al menos 24 horas de anticipación. No está incluido en la inscripción y corre por cuenta del estudiante. Cowork, Claude Code y Claude Design solo están disponibles en planes de pago: con la cuenta gratuita no podrás hacer el ejercicio.",
    },
    {
      icon: MonitorSmartphone,
      title: "Computadora con macOS o Windows",
      text: "La app de escritorio de Claude no está disponible para Linux. Desde tablet o celular tampoco es posible seguir el taller.",
    },
    {
      icon: Palette,
      title: "Cuenta de Canva",
      text: "El plan gratuito alcanza para el ejercicio. Algunas funciones de marca y de exportación requieren Canva Pro.",
    },
    {
      icon: Wifi,
      title: "Cuenta de Gmail y buena conexión",
      text: "La usaremos para el bloque de conectores. Si es una cuenta corporativa, verifica antes con tu área de TI que puedas autorizar aplicaciones externas.",
    },
  ];

  // Recomendaciones para el día del taller
  const recomendaciones = [
    "No uses Claude intensivamente en las horas previas: necesitas tu cuota de uso disponible para las dos horas de práctica.",
    "Te enviamos por correo el archivo Excel con el que vamos a trabajar. Son datos ficticios: no traigas información real de clientes de tu empresa.",
    "Conéctate 10 minutos antes con la app ya descargada y la sesión de Claude iniciada.",
  ];

  // Qué incluye la inscripción
  const incluye = [
    "Cuatro entregables construidos por ti — dashboard, pieza gráfica, herramientas conectadas y tu primera Skill.",
    "Acompañamiento en vivo durante toda la sesión, sobre tu propia pantalla.",
    "Archivo de trabajo y grabación de la sesión, con acceso de por vida.",
    "Certificado de participación.",
  ];

  return (
    <main
      ref={mainRef}
      className="pt-24 pb-16 mx-auto w-full max-w-4xl sm:px-6 px-4 lg:px-0 flex-grow min-w-0"
    >
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
            Inscripciones abiertas — Taller en vivo
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white/90 mb-6 leading-[1.1]">
          Claude Code
          <br />
          <span className="text-claude underline decoration-claude-deep/50 decoration-2 underline-offset-[10px] drop-shadow-[0_0_30px_rgba(217,119,87,0.35)]">
            para no programadores
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-6">
          <strong className="text-claude">
            Tu propio asistente ejecutivo con IA
          </strong>
          , corriendo en tu computadora. Suena a herramienta de programador. No
          lo es: lee tus archivos, arma tus reportes y escribe tus correos — tú
          solo se lo pides.
        </p>

        {/* Anti-requisitos */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {["Sin terminal", "Sin código", "Sin experiencia previa"].map((p) => (
            <span
              key={p}
              className="rounded-full border border-claude/40 px-4 py-1.5 text-xs font-semibold text-claude"
            >
              {p}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex justify-center mb-12">
          {[
            { value: "2", label: "Horas en vivo" },
            { value: "1", label: "Sesión" },
            { value: "4", label: "Entregables" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`px-6 sm:px-10 text-center ${
                i > 0 ? "border-l border-white/10" : ""
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
          title="Claude — Cowork"
          command="cowork"
          prompt="Toma este Excel de ventas y arma un dashboard por agente"
          result="dashboard.html generado — abriendo vista previa"
        />
      </div>

      {/* El caso */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="text-center mb-10">
          <Eyebrow>El caso práctico</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
            Lo que antes le pedías a un programador, ahora lo haces tú
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            No vemos funciones sueltas. Trabajamos un solo caso real de principio
            a fin: una inmobiliaria con una hoja de ventas por agente. Todo lo
            que aprendes, lo aprendes haciéndolo sobre ese caso.
          </p>
        </div>

        <div className="space-y-4">
          {caso.map((c) => (
            <div key={c.n} className={`${cardClass} p-6 flex items-start gap-5`}>
              <TopAccent />
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-claude-deep/30 bg-claude-deep/10">
                <c.icon className="h-5 w-5 text-claude" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-claude-deep">
                    {c.tag}
                  </span>
                  <span className="text-2xl font-bold text-white/[0.08] leading-none">
                    0{c.n}
                  </span>
                </div>
                <h3 className="font-bold text-white/90 mb-1.5">{c.title}</h3>
                <p className="text-sm text-white/60">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Esto NO es */}
        <div className={`${cardClass} p-8 mt-8`}>
          <TopAccent />
          <Eyebrow>Aclaremos</Eyebrow>
          <h3 className="text-xl font-bold text-white/90 mt-3 mb-5">
            Esto NO es
          </h3>
          <ul className="space-y-3">
            {noEs.map((n) => (
              <li key={n} className="flex items-start gap-3 text-white/60">
                <X className="h-4 w-4 text-claude shrink-0 mt-1" />
                <span className="text-sm">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Inversión + pago */}
      <div className="grid items-stretch gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-8">
        {/* Precio */}
        <div className={`${cardClass} p-7 h-full`}>
          <TopAccent />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <Eyebrow>Inversión</Eyebrow>
                <p className="mt-2 text-sm font-bold text-white/85">
                  Claude Code para no programadores
                </p>
              </div>
              <span className="shrink-0 rotate-3 rounded-md border border-terminal-green/40 bg-terminal-green/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-terminal-green">
                Cupos limitados
              </span>
            </div>

            <div className="border-t border-dashed border-white/15 pt-4">
              <div className="flex items-end justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-claude-deep">
                  Acceso individual
                </span>
                <span className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_0_24px_rgba(217,119,87,0.3)]">
                    {PRECIO_PEN}
                  </span>
                  <span className="text-sm text-white/50">soles</span>
                </span>
              </div>
            </div>

            <div className="mt-4 border-t border-dashed border-white/15 pt-4 space-y-2 text-xs text-white/40">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[0.12em]">Formato</span>
                <span className="text-white/70">1 sesión en vivo · 2 horas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-[0.12em]">Modalidad</span>
                <span className="text-white/70">Online en vivo</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="uppercase tracking-[0.12em]">Requisito</span>
                <span className="text-white/70 text-right">
                  Plan Claude Pro (desde US$ 20/mes)
                </span>
              </div>
            </div>

            <p className="text-center text-white/40 text-xs mt-4">
              PEN · Precio por persona · No incluye el plan de Claude.
            </p>
          </div>
        </div>

        {/* Qué incluye */}
        <div className={`${cardClass} p-7 h-full`}>
          <TopAccent />
          <Eyebrow>Incluye</Eyebrow>
          <h3 className="text-xl font-bold text-white/90 mt-3 mb-5">
            Lo que cubre tu inscripción
          </h3>
          <ul className="space-y-3 text-sm text-white/60">
            {incluye.map((i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-claude shrink-0 mt-0.5" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA de checkout */}
      <div className={`${cardClass} p-8 md:p-12 max-w-2xl mx-auto text-center`}>
        <TopAccent />
        <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-4">
          Asegura tu lugar
        </h2>
        <p className="text-white/50 mb-6 text-lg">
          Una sola sesión y sales del taller con tu asistente funcionando
        </p>

        <Link
          href={CHECKOUT_URL}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-claude-deep to-claude px-10 py-5 text-xl font-bold text-white shadow-lg shadow-claude-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-claude/40 cursor-pointer"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
          <CheckCircle2 className="h-6 w-6" />
          Inscribirme al taller
          <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        <p className="text-white/40 text-sm mt-4">
          {FECHA_TALLER} · {HORARIO_TALLER}
        </p>
      </div>

      {/* Medios de pago */}
      <div className={`${cardClass} p-8 md:p-12 max-w-2xl mx-auto mt-8`}>
        <TopAccent />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Eyebrow>Medios de pago</Eyebrow>
            <h3 className="text-xl font-bold text-white/90 mt-2 mb-4">
              Transferencia bancaria
            </h3>
            <p className="text-white/50 text-sm mb-4">
              El pago se realiza al titular del programa, antes del inicio del
              taller.
            </p>
            <dl className="text-sm border-t border-white/10">
              {[
                ["Banco", "Interbank · Cuenta corriente"],
                ["Titular", "INNODESIGN E.I.R.L."],
                ["Cuenta", "340-3008047314"],
                ["CCI", "003-340-003008047314-70"],
                ["Moneda", "Soles (PEN)"],
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
                Escanea el QR y envía tu voucher al{" "}
                <b className="text-white/90">{CONTACTO_WHATSAPP}</b> para
                completar tu registro. El titular es{" "}
                <b className="text-white/90">INNODESIGN E.I.R.L.</b>, la razón
                social de Coding Latam.
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

      {/* Programa — minuto a minuto */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Eyebrow>Programa · 1 sesión en vivo · 2 horas</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
            Minuto a minuto
          </h3>
          <p className="text-white/50 max-w-2xl mx-auto">
            Una sesión intensiva donde pasas de no saber qué es Claude Code a
            tener tu propio asistente instalado, conectado y trabajando.
          </p>
        </div>

        <div className={`${cardClass} p-6 sm:p-8`}>
          <TopAccent />
          <ol className="divide-y divide-white/10">
            {agenda.map((a) => (
              <li
                key={a.time}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6"
              >
                <div className="shrink-0 sm:w-28">
                  <div
                    className={`font-semibold ${
                      a.break ? "text-white/30" : "text-claude"
                    }`}
                  >
                    {a.time}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                    {a.dur}
                  </div>
                </div>
                <div className="min-w-0">
                  <h4
                    className={`font-semibold ${
                      a.break
                        ? "flex items-center gap-2 text-white/40"
                        : "text-white/90"
                    }`}
                  >
                    {a.break && <Coffee className="h-4 w-4" />}
                    {a.title}
                  </h4>
                  {a.text && (
                    <p className="mt-1 text-sm text-white/55">{a.text}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Lo que te llevas construido */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Eyebrow>Lo que te llevas construido</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
            Sales del taller usándolo
          </h3>
          <p className="text-white/50 max-w-2xl mx-auto">
            Tu propio asistente ejecutivo instalado, conectado a tus herramientas
            y con trabajo real ya hecho — listo para el lunes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entregables.map((e) => (
            <div
              key={e}
              className={`${cardClass} p-5 flex items-start gap-3.5`}
            >
              <TopAccent />
              <CheckCircle2 className="h-5 w-5 text-claude shrink-0 mt-0.5" />
              <p className="text-sm text-white/70">{e}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metodología */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="mb-10">
          <Eyebrow>Metodología</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-3">
            Nuestra propuesta de aprendizaje
          </h3>
          <p className="text-white/50 max-w-2xl">
            Un caso real recorrido completo, sin jerga técnica, con un flujo que
            puedes repetir con tus propios archivos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metodologia.map((m) => (
            <div key={m.n} className={`${cardClass} p-6`}>
              <TopAccent />
              <div className="text-4xl font-bold text-claude/30 mb-3">
                {m.n}
              </div>
              <h4 className="font-bold text-white/90 mb-2">{m.title}</h4>
              <p className="text-sm text-white/60">{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Requisitos */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="mb-8">
          <Eyebrow>Requisitos</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-3">
            Léelo antes de inscribirte
          </h3>
          <p className="text-white/50 max-w-2xl">
            No necesitas experiencia en programación ni en IA. Sí necesitas tener
            estas cuatro cosas listas, porque sin ellas no vas a poder seguir la
            parte práctica.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requisitos.map((r) => (
            <div key={r.title} className={`${cardClass} p-6`}>
              <TopAccent />
              <div className="flex items-start gap-3 mb-2">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-claude-deep/30 bg-claude-deep/10">
                  <r.icon className="h-4 w-4 text-claude" />
                </span>
                <h4 className="font-bold text-white/90 pt-1.5">{r.title}</h4>
              </div>
              <p className="text-sm text-white/60">{r.text}</p>
            </div>
          ))}
        </div>

        {/* Recomendaciones para el día */}
        <div className={`${cardClass} p-7 mt-6`}>
          <TopAccent />
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-claude" />
            <Eyebrow>Recomendaciones para el día del taller</Eyebrow>
          </div>
          <ul className="space-y-3 text-sm text-white/60">
            {recomendaciones.map((r) => (
              <li key={r} className="flex items-start gap-2">
                <span className="text-claude mt-0.5">·</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-white/10 mt-5 pt-4">
            <p className="text-sm text-white/60">
              <strong className="text-white/90">
                Costos que no están incluidos:
              </strong>{" "}
              el plan de Claude (desde US$ 20/mes), obligatorio, a cargo del
              estudiante.
            </p>
          </div>
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
              Ingeniero de software desde 2016, especializado en la intersección
              de IA y automatización de procesos. Enseña a profesionales sin
              experiencia técnica a usar Claude Code como un agente de
              productividad, no como una herramienta de programación.
            </p>
            <p>
              A través de Coding Latam entrena a profesionales en toda
              Latinoamérica en automatización asistida por IA. Organizador
              principal de GDG Tacna, ganador del GDG Cup 2026 en Latinoamérica.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Claude Code",
              "Cowork",
              "Automatización con IA",
              "Gmail · Drive · Calendar",
              "Canva",
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

      {/* Empresas */}
      <div className="mt-8 max-w-4xl mx-auto">
        <div className={`${cardClass} p-7 flex items-start gap-4`}>
          <TopAccent />
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-terminal-green/30 bg-terminal-green/10">
            <Building2 className="h-5 w-5 text-terminal-green" />
          </span>
          <div>
            <h4 className="font-bold text-white/90 mb-1">
              ¿Y para todo tu equipo?
            </h4>
            <p className="text-sm text-white/60">
              Dictamos este mismo taller de forma cerrada para empresas,
              adaptando el caso práctico a los archivos y procesos reales de tu
              área. Escríbenos a{" "}
              <a
                href={`mailto:${CONTACTO_EMAIL}`}
                className="text-claude underline decoration-claude-deep/50 underline-offset-4 hover:text-claude-deep"
              >
                {CONTACTO_EMAIL}
              </a>{" "}
              y armamos una propuesta.
            </p>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="mt-20">
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
                Cupos limitados
              </span>
            </div>

            <h3 className="text-2xl md:text-4xl font-bold text-white/90 mb-4 leading-tight">
              Un solo día, una sola sesión,{" "}
              <span className="text-claude">resultado inmediato</span>
            </h3>
            <p className="text-white/55 max-w-xl mx-auto mb-8">
              Sales del taller con tu propio asistente funcionando: instalado,
              conectado a tus herramientas y con trabajo real ya hecho.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <Clock className="h-4 w-4 text-claude" />
                {HORARIO_TALLER}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <Video className="h-4 w-4 text-claude" />
                Online en vivo · grabación de por vida
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <BadgeCheck className="h-4 w-4 text-claude" />
                Certificado de participación
              </span>
            </div>

            <Link
              href={CHECKOUT_URL}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-claude-deep to-claude px-10 py-5 text-xl font-bold text-white shadow-lg shadow-claude-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-claude/40 cursor-pointer"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
              <CheckCircle2 className="h-6 w-6" />
              Inscribirme al taller — {PRECIO_PEN}
              <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <p className="text-white/40 text-sm mt-4">
              {FECHA_TALLER} · Consultas al {CONTACTO_WHATSAPP}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
