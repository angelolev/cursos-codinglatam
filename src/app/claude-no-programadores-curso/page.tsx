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
  Globe2,
  Palette,
  Wand2,
  Globe,
  AlertTriangle,
  CalendarDays,
  Building2,
  X,
  MonitorSmartphone,
  Wifi,
  Repeat,
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

const FECHA_INICIO = "Martes 22 de setiembre";
const HORARIO_CURSO = "8:00 PM – 9:30 PM (hora Perú)";
const FRECUENCIA = "Martes y jueves · 2 semanas";
const CHECKOUT_URL = "https://mpago.la/1GSBX4V";
const CONTACTO_WHATSAPP = "+51 964225808";
const CONTACTO_EMAIL = "angelo@codinglatam.dev";

const PRECIO_PEN = "S/ 179";

export default function ClaudeNoProgramadoresCursoPage() {
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef);

  // El caso práctico: una inmobiliaria que solo tiene una hoja de ventas.
  const caso = [
    {
      icon: Globe2,
      n: 1,
      tag: "Cowork",
      title: "Una página web con la información de tu negocio",
      text: "Tu asistente lee la hoja de cálculo y construye una página web con tus datos. Tú solo la describes, sin programar.",
    },
    {
      icon: Palette,
      n: 2,
      tag: "Herramientas externas",
      title: "Una pieza gráfica para el cliente",
      text: "Conectas Canva a tu asistente y generas opciones de diseño desde un prompt. Eliges la que más te gusta.",
    },
    {
      icon: Mail,
      n: 3,
      tag: "Automatización",
      title: "Se lo mandas a tu equipo",
      text: "Conectas tu correo y distribuyes la página web y la pieza gráfica sin salir del asistente.",
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

  // Programa: 4 sesiones de 90 min, martes y jueves durante dos semanas
  const programa = [
    {
      week: "Semana 1 · 22 y 24 de setiembre",
      sessions: [
        {
          n: 1,
          day: "Martes 22 · 90 min",
          title: "Instala tu asistente — sin terminal",
          items: [
            "Claude Desktop paso a paso, desde cero.",
            "Las tres pestañas: Chat, Cowork y Code — qué hace cada una.",
            "Tu primera tarea real: organizar una carpeta con lenguaje natural.",
            "Resolvemos en vivo los problemas de instalación de cada uno.",
            "Cómo revisar y aprobar antes de que tu asistente ejecute nada.",
          ],
          outcome: "Terminas con tu asistente instalado y funcionando.",
        },
        {
          n: 2,
          day: "Jueves 24 · 90 min",
          title: "Crea una página web sin saber programar",
          items: [
            "Partimos de una hoja de cálculo con información real de tu negocio.",
            "Tu asistente lee el archivo y propone cómo mostrar tus datos.",
            "Construcción de la página web, paso a paso y sin escribir código.",
            "Cómo pedir correcciones cuando algo no sale como querías.",
            "Tiempo de trabajo guiado: cada uno avanza con su propio archivo.",
          ],
          outcome:
            "Terminas con una página web hecha por ti, con tus propios datos.",
        },
      ],
    },
    {
      week: "Semana 2 · 29 de setiembre y 1 de octubre",
      sessions: [
        {
          n: 3,
          day: "Martes 29 · 90 min",
          title: "Conecta tu agente con herramientas externas",
          items: [
            "Qué es un conector y qué puede hacer tu asistente con él.",
            "Lo aplicamos con Canva: piezas gráficas de tu negocio desde un prompt.",
            "Tu correo, tu calendario y tus documentos, conectados y autorizados.",
            "Automatizas el envío de la página web y la pieza gráfica a tu equipo.",
            "Resolvemos las autorizaciones y permisos de cada cuenta en vivo.",
          ],
          outcome:
            "Terminas con tus herramientas conectadas y el trabajo enviado.",
        },
        {
          n: 4,
          day: "Jueves 1 oct · 90 min",
          title: "Skills y publicación",
          items: [
            "Skills: enséñale a tu asistente tu forma de trabajar.",
            "Creas tu primera Skill para que el reporte se repita cada mes.",
            "Artefacto, archivo y web propia: publicas tu página web en internet.",
            "Publicamos tu proyecto y revisamos el de quien quiera mostrarlo.",
            "Cierre, dudas abiertas y hacia dónde seguir.",
          ],
          outcome: "Terminas con tu Skill propia y tu proyecto publicado.",
        },
      ],
    },
  ];

  // Entre sesiones
  const entreSesiones = [
    "Recibes un reto corto para repetir lo visto con tus propios archivos, con revisión del instructor.",
    "La grabación de cada sesión queda con acceso de por vida: si faltas a una, no pierdes el hilo del caso.",
  ];

  // Lo que te llevas construido
  const entregables = [
    "Claude Desktop instalado y configurado desde cero, sin terminal.",
    "Una página web hecha por ti, con los datos de tu negocio y sin programar.",
    "Una pieza gráfica creada con Canva desde tu asistente.",
    "Gmail, Drive y Calendar conectados y funcionando.",
    "Tu primera Skill propia, creada en vivo y lista para reutilizar.",
    "Criterio de uso: cuándo abrir Chat, cuándo Cowork y cuándo Code.",
    "Control de lo que hace: revisar y aprobar antes de que ejecute nada.",
    "Retos entre sesiones para practicar con tus propios archivos.",
    "Grabación de las 4 sesiones, con acceso de por vida.",
    "Certificado de participación.",
  ];

  // Metodología
  const metodologia = [
    {
      n: "01",
      title: "Un caso que avanza contigo",
      text: "Cada sesión avanza un tramo del mismo caso real, desde el archivo crudo hasta el proyecto publicado.",
    },
    {
      n: "02",
      title: "Cero jerga técnica",
      text: "Si sabes explicar una idea por escrito, ya sabes usar esto. No hay vocabulario nuevo que memorizar.",
    },
    {
      n: "03",
      title: "Práctica entre sesiones",
      text: "Entre martes y jueves tienes un reto corto con tus propios archivos. Eso es lo que fija lo aprendido.",
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

  // Recomendaciones
  const recomendaciones = [
    "No uses Claude intensivamente en las horas previas: necesitas tu cuota de uso disponible para cada sesión.",
    "Te enviamos por correo una hoja de cálculo de ejemplo. Si prefieres trabajar con datos de tu propio negocio, tráelos — pero evita datos personales de clientes (nombres, teléfonos, documentos), porque el proyecto puede terminar publicado.",
    "Conéctate 10 minutos antes con la app ya descargada y la sesión de Claude iniciada.",
    "Si faltas a una sesión, la grabación queda con acceso de por vida: no pierdes el hilo del caso.",
  ];

  // Qué incluye la inscripción
  const incluye = [
    "Cuatro entregables construidos por ti — tu página web, la pieza gráfica, tus herramientas conectadas y tu primera Skill.",
    "4 sesiones en vivo de 90 minutos, martes y jueves durante dos semanas.",
    "Grabación de cada sesión, con acceso de por vida.",
    "Retos entre sesiones con revisión del instructor.",
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
            Inscripciones abiertas — Curso en vivo
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
            { value: "4", label: "Sesiones en vivo" },
            { value: "6", label: "Horas totales" },
            { value: "2", label: "Semanas" },
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
          prompt="Toma este Excel de ventas y arma una página web con los totales"
          result="index.html generado — abriendo vista previa"
        />
      </div>

      {/* El caso práctico */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="text-center mb-10">
          <Eyebrow>El caso práctico</Eyebrow>
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
            Lo que antes le pedías a un programador, ahora lo haces tú
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Seguimos a una inmobiliaria que solo tiene una hoja de ventas. En
            cuatro sesiones sale con su página web publicada, su pieza de diseño
            lista y el correo enviado a su equipo. Tú haces lo mismo, en
            paralelo, con tu propio negocio.
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

      {/* Inversión + incluye */}
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
                  4 sesiones en vivo
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
              {[
                ["Formato", "4 sesiones en vivo · 90 min c/u"],
                ["Frecuencia", FRECUENCIA],
                ["Total en vivo", "6 horas"],
                ["Modalidad", "Online en vivo"],
                ["Requisito", "Plan Claude Pro (desde US$ 20/mes)"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <span className="uppercase tracking-[0.12em]">{k}</span>
                  <span className="text-white/70 text-right">{v}</span>
                </div>
              ))}
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
          Dos semanas, cuatro sesiones, un caso real de punta a punta
        </p>

        <Link
          href={CHECKOUT_URL}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-claude-deep to-claude px-10 py-5 text-xl font-bold text-white shadow-lg shadow-claude-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-claude/40 cursor-pointer"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
          <CheckCircle2 className="h-6 w-6" />
          Inscribirme al curso
          <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        <p className="text-white/40 text-sm mt-4">
          Inicia el {FECHA_INICIO} · {HORARIO_CURSO}
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
              El pago se realiza al titular del programa, antes del inicio de la
              primera sesión.
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

      {/* Programa */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Eyebrow>Programa · 4 sesiones en vivo · 90 minutos cada una</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
            ¿Qué vamos a construir?
          </h3>
          <p className="text-white/50 max-w-2xl mx-auto">
            Martes y jueves durante dos semanas. Cada sesión termina con algo
            construido, y entre una y otra recibes un reto corto para practicar.
          </p>
        </div>

        {programa.map((block) => (
          <div key={block.week} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Eyebrow>{block.week}</Eyebrow>
              <span className="h-px flex-grow bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {block.sessions.map((s) => (
                <div key={s.n} className={`${cardClass} p-6 flex flex-col`}>
                  <TopAccent />
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-claude-deep">
                      Sesión {s.n}
                    </span>
                    <span className="text-xs font-medium text-white/40">
                      {s.day}
                    </span>
                  </div>
                  <h4 className="font-bold text-white/90 mb-4">{s.title}</h4>
                  <ul className="space-y-2 text-sm text-white/60">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-claude mt-0.5">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-5 flex items-start gap-2 text-sm font-medium text-terminal-green">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{s.outcome}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Entre sesiones */}
        <div className={`${cardClass} p-7`}>
          <TopAccent />
          <div className="flex items-center gap-2 mb-4">
            <Repeat className="h-4 w-4 text-claude" />
            <Eyebrow>Entre sesiones</Eyebrow>
          </div>
          <ul className="space-y-3 text-sm text-white/60">
            {entreSesiones.map((e) => (
              <li key={e} className="flex items-start gap-2">
                <span className="text-claude mt-0.5">·</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lo que te llevas construido */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Eyebrow>Lo que te llevas construido</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
            Sales del curso usándolo
          </h3>
          <p className="text-white/50 max-w-2xl mx-auto">
            Tu propio asistente ejecutivo instalado, conectado a tus herramientas
            y con trabajo real ya hecho — listo para el lunes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entregables.map((e) => (
            <div key={e} className={`${cardClass} p-5 flex items-start gap-3.5`}>
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
            Un caso real que avanza contigo, sin jerga técnica y con práctica
            entre sesiones sobre tus propios archivos.
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
            estas cuatro cosas listas, porque sin ellas no vas a poder seguir las
            sesiones prácticas.
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

        {/* Recomendaciones */}
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
              Dictamos este mismo curso de forma cerrada para empresas, adaptando
              el caso práctico a los archivos y procesos reales de tu área.
              Escríbenos a{" "}
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
              Dos semanas, cuatro sesiones,{" "}
              <span className="text-claude">un caso real de punta a punta</span>
            </h3>
            <p className="text-white/55 max-w-xl mx-auto mb-8">
              Sales del curso con tu propio asistente trabajando para ti:
              instalado, conectado a tus herramientas y con tu proyecto
              publicado.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <CalendarDays className="h-4 w-4 text-claude" />
                {FRECUENCIA} · {HORARIO_CURSO}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <Video className="h-4 w-4 text-claude" />
                Grabaciones con acceso de por vida
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
              Inscribirme al curso — {PRECIO_PEN}
              <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <p className="text-white/40 text-sm mt-4">
              Inicia el {FECHA_INICIO} · Consultas al {CONTACTO_WHATSAPP}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
