"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  ArrowRight,
  Zap,
  GraduationCap,
  TrendingUp,
  Video,
  BadgeCheck,
  Users,
  MessageCircle,
  Code2,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Clock,
} from "lucide-react";
import { WaitlistAvatar } from "@/types/waitlist";
import { useCurrency } from "@/contexts/CurrencyContext";
import CurrencySelector from "@/components/CurrencySelector";
import angeloImage from "@/assets/angelo.jpeg";
import paypalImage from "@/assets/paypal.svg";
import visaImage from "@/assets/visa.svg";
import cardImage from "@/assets/card.svg";
import americanExpressImage from "@/assets/amex.svg";
import yapeImage from "@/assets/yape.svg";
import plinImage from "@/assets/plin.svg";
import yapeQR from "@/assets/yape-qr.png";

// Grupo oficial de WhatsApp de la Cohorte 3 — canal de información (temario, horarios, avisos)
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/Js2oMPiEjEsHWbP8u6ugwK";

// WhatsApp brand glyph
const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.42 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// LinkedIn brand glyph
const LinkedInIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Peru Flag Component
const PEFlag = () => {
  return (
    <svg
      className="w-5 h-5 inline-block"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="0" width="512" height="512" fill="#fff" />
      <rect y="0" width="170.67" height="512" fill="#D80027" />
      <rect x="341.33" width="170.67" height="512" fill="#D80027" />
    </svg>
  );
};

// --- Brochure UI primitives (Claude Code look & feel) ---

// Uppercase letter-spaced eyebrow label with a code-comment motif (// PROGRAMA)
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-claude-deep">
    <span className="text-claude/40">{"// "}</span>
    {children}
  </span>
);

// Dark card: layered gradient surface, hairline border, inner top highlight + soft depth shadow
const cardClass =
  "relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.015] backdrop-blur-sm overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_-28px_rgba(0,0,0,0.7)]";

const TopAccent = () => (
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-claude/80 via-claude/20 to-transparent" />
);

// Terminal window — chrome bar + prompt, echoing the testimonial editor tabs
const TerminalSnippet = () => (
  <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-white/10 bg-black/50 text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
    <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-claude/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </span>
      <span className="ml-1 text-xs text-white/40">claude — zsh</span>
    </div>
    <div className="px-5 py-4 text-sm leading-relaxed">
      <div className="text-terminal-green">
        <span className="text-claude">$</span> claude
      </div>
      <div className="mt-1 text-white/55">
        &quot;Crea una app fullstack&quot;
        <span className="animate-caret ml-1 inline-block h-4 w-2 translate-y-0.5 bg-claude" />
      </div>
      <div className="mt-2 text-white/30">
        <span className="text-terminal-green">✓</span> Planificando arquitectura…
      </div>
    </div>
  </div>
);

// Scroll-reveal: anima los hijos directos de <main> al entrar al viewport.
// El estado oculto se setea en JS para que sin JS todo sea visible.
function useScrollReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const items = Array.from(root.children) as HTMLElement[];
    items.forEach((el, i) => {
      el.classList.add("reveal-init");
      el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("reveal-in");
            el.classList.remove("reveal-init");
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

export default function WaitlistPage() {
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef);

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [avatars, setAvatars] = useState<WaitlistAvatar[]>([]);
  const [avatarsLoading, setAvatarsLoading] = useState(true);

  // Currency hook for dynamic price conversion
  const {
    convertAndFormatPrice,
    currentCurrency,
    isLoading: currencyLoading,
  } = useCurrency();

  // Precios en USD (moneda base del sistema). Equivalentes a S/129 y S/99
  // con la tasa PEN ≈ 3.43 (el sistema aplica precios psicológicos .99 al convertir).
  const REGULAR_PRICE_USD = 37.25; // ~S/129
  const EARLY_BIRD_PRICE_USD = 28.5; // ~S/99

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

    // Client validation
    if (!email.trim()) {
      setSubmitStatus({
        type: "error",
        message: "Por favor ingresa tu email",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitStatus({
        type: "error",
        message: "Por favor ingresa un email válido",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar email");
      }

      setSubmitStatus({
        type: "success",
        message:
          "¡Listo! Recibirás información del programa y futuras versiones por email.",
      });
      setEmail("");

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Algo salió mal",
      });

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchAvatars() {
      try {
        const response = await fetch("/api/users/random");
        const data = await response.json();

        if (data.users && data.users.length >= 3) {
          setAvatars(data.users.slice(0, 3)); // Tomar primeros 3
        }
      } catch (error) {
        console.error("Failed to load avatars:", error);
        // Mantener avatars vacío -> fallback a estáticos
      } finally {
        setAvatarsLoading(false);
      }
    }

    fetchAvatars();
  }, []);

  // Programa completo: 8 clases en vivo repartidas en 2 sábados (9:00 AM - 12:00 PM)
  const program = [
    {
      block: "Sábado 1",
      schedule: "9:00 AM – 12:00 PM",
      classes: [
        {
          n: 1,
          time: "9:00 – 9:45",
          title: "Introducción y Configuración",
          items: [
            "Qué es Claude Code y por qué es diferente a ChatGPT/Copilot",
            "Planes y costos",
            "Instalación en vivo",
            "Autenticación OAuth vs API Key",
            "Primer uso práctico",
          ],
        },
        {
          n: 2,
          time: "9:45 – 10:30",
          title: "Sesiones, Comandos y Navegación",
          items: [
            "Anatomía de una sesión",
            "Comandos: /help, /model, /cost, /clear, /compact",
            "Contexto y tokens",
            "Permisos y auto-aceptar",
            "Init, resume, rewind, export",
          ],
        },
        {
          n: 3,
          time: "10:30 – 11:15",
          title: "CLAUDE.md y Conceptos Clave",
          items: [
            "Context window, modelos y tokens",
            "CLAUDE.md a nivel proyecto vs global",
            "Qué incluir: stack, convenciones, restricciones",
            "Cómo Claude mejora con contexto",
          ],
        },
        {
          n: 4,
          time: "11:15 – 12:00",
          title: "MCP Servers",
          items: [
            "Qué es MCP (Model Context Protocol)",
            "Cuándo usar un MCP y cuándo no",
            "MCP servers populares: filesystem, GitHub, Figma",
            "Configuración práctica",
          ],
        },
      ],
    },
    {
      block: "Sábado 2",
      schedule: "9:00 AM – 12:00 PM",
      classes: [
        {
          n: 5,
          time: "9:00 – 9:45",
          title: "Agentes, Skills, Commands y Hooks",
          items: [
            "Sub-agentes y agentes autónomos",
            "Skills y Plugins",
            "Custom slash commands: /review, /test, /deploy",
            "Hooks pre/post",
            "YAML frontmatter",
          ],
        },
        {
          n: 6,
          time: "9:45 – 10:30",
          title: "Modelos, Plan Mode y Prompt Engineering",
          items: [
            "Sonnet vs Opus: cuándo usar cada uno",
            "Modo plan y extended thinking",
            "Técnica RICE con ejemplo real",
            "Prompt engineering para código profesional",
          ],
        },
        {
          n: 7,
          time: "10:30 – 11:15",
          title: "Git + Testing E2E con Playwright",
          items: [
            "Commits semánticos y PRs automáticos",
            "Code review automatizado",
            "Playwright: instalación, selectores, acciones",
            "Flujo e-commerce completo como ejemplo",
          ],
        },
        {
          n: 8,
          time: "11:15 – 12:00",
          title: "GitHub Integration y Proyecto Final",
          items: [
            "Taggear a Claude en issues para trabajo autónomo",
            "Claude como reviewer de PRs",
            "Flujo completo: issue → PR → review",
            "GitHub Actions + Claude Code",
          ],
        },
      ],
    },
  ];

  // Metodología de aprendizaje
  const methodology = [
    {
      n: "01",
      title: "Learning by Doing",
      text: "Cada clase incluye ejercicios prácticos. Resuelves problemas concretos, no ves slides pasivamente.",
    },
    {
      n: "02",
      title: "Progresivo y guiado",
      text: "Desde los fundamentos hasta producción. Cada sábado construye sobre el anterior con complejidad creciente.",
    },
    {
      n: "03",
      title: "Proyecto real",
      text: "Construirás un proyecto completo que demuestra tus habilidades y que impresiona a empleadores.",
    },
  ];

  // ¿Qué incluye tu inscripción?
  const inclusions = [
    {
      icon: Video,
      title: "Grabaciones de por vida",
      text: "Acceso permanente a las grabaciones de todas las clases para repasar cuando quieras",
    },
    {
      icon: BadgeCheck,
      title: "Certificación verificable",
      text: "Badge para LinkedIn que valida tus habilidades con Claude Code",
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
      text: "Cada clase incluye ejercicios reales que suman a tu portfolio profesional",
    },
    {
      icon: RefreshCw,
      title: "Actualizaciones incluidas",
      text: "Acceso a futuras actualizaciones del contenido sin costo adicional",
    },
  ];

  // Testimonios de alumnos como posts incrustados de LinkedIn.
  // En cada publicación pública: menú ⋯ → "Insertar esta publicación" (Embed this post).
  // Pega aquí el urn (urn:li:share:... o urn:li:ugcPost:...) o el src completo del iframe.
  const testimonials: string[] = [
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7465867780463001600?collapsed=1",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7447303531075764224?collapsed=1",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7445646280707604480?collapsed=1",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7446270449925124096?collapsed=1",
  ];

  // Normaliza un urn o URL al src del embed de LinkedIn.
  const toEmbedSrc = (ref: string) =>
    ref.startsWith("http")
      ? ref
      : `https://www.linkedin.com/embed/feed/update/${ref}`;

  return (
    <main
      ref={mainRef}
      className="pt-24 pb-16 mx-auto w-full max-w-4xl sm:px-6 px-4 lg:px-0 flex-grow min-w-0"
    >
      {/* Hero Section */}
      <div className="relative text-center mb-16">
        {/* Ambient terracota glow + faint grid backdrop */}
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
            Inscripciones abiertas — Julio 2026
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white/90 mb-6 leading-[1.1]">
          Claude Code
          <br />
          <span className="text-claude underline decoration-claude-deep/50 decoration-2 underline-offset-[10px] drop-shadow-[0_0_30px_rgba(217,119,87,0.35)]">
            desde cero
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12">
          <strong className="text-claude">Solo 2 sábados</strong> para pasar de
          cero a dominar Claude Code, el AI coding assistant más potente del
          mercado. 6 horas 100% prácticas, sin relleno, donde sales construyendo
          proyectos completos con agentes autónomos de IA.
        </p>

        {/* Stats row */}
        <div className="flex justify-center mb-12">
          {[
            { value: "6", label: "Horas en vivo" },
            { value: "2", label: "Sábados" },
            { value: "100%", label: "Práctico" },
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

        <TerminalSnippet />
      </div>

      {/* Social Proof Section */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="flex -space-x-4 mb-4">
          {avatarsLoading ? (
            // Loading skeleton
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full bg-white/10 animate-pulse border-2 border-[#161616]"
                />
              ))}
            </>
          ) : avatars.length >= 3 ? (
            // Avatares reales con tooltip
            <>
              {avatars.map((avatar, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={avatar.image}
                    alt={avatar.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-[#161616] object-cover"
                  />
                  {/* Tooltip CSS-only */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/10">
                    {avatar.name}
                  </div>
                </div>
              ))}
            </>
          ) : (
            // Fallback: avatares estáticos
            <>
              <Image
                src="https://ui-avatars.com/api/?name=Maria+Garcia&background=c15f3c&color=fff&size=48"
                alt="Usuario"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border-2 border-[#161616]"
              />
              <Image
                src="https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=d97757&color=fff&size=48"
                alt="Usuario"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border-2 border-[#161616]"
              />
              <Image
                src="https://ui-avatars.com/api/?name=Ana+Martinez&background=87a96b&color=fff&size=48"
                alt="Usuario"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full border-2 border-[#161616]"
              />
            </>
          )}

          {/* Badge +176 */}
          <div className="w-12 h-12 rounded-full bg-claude border-2 border-[#161616] flex items-center justify-center">
            <span className="text-xs font-bold text-white">+176</span>
          </div>
        </div>
        <p className="text-white/50 text-sm">
          Más de 176 desarrolladores ya llevaron el curso de Claude Code. Sé
          parte de la Cohorte 3.
        </p>
      </div>

      {/* WhatsApp + Inversión — fila de 2 columnas */}
      <div className="grid items-stretch gap-6 md:grid-cols-2 max-w-4xl mx-auto mb-12">
        {/* WhatsApp Group CTA */}
        <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-[#25D366]/30 bg-[#25D366]/[0.06] p-6 sm:p-8 text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#25D366]/80 via-[#25D366]/20 to-transparent" />
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/15">
            <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
          </div>
          <h3 className="mb-2 text-xl font-bold text-white/90">
            Grupo oficial de la Cohorte 3
          </h3>
          <p className="mx-auto mb-6 max-w-md text-sm text-white/60">
            Toda la información del programa —
            <strong className="text-white/80">
              temario, horarios, materiales y avisos
            </strong>
            — se comparte por el grupo de WhatsApp. Es tu canal directo con el
            instructor y tus compañeros.
          </p>
          <Link
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-[#25D366] px-8 py-4 font-bold text-white shadow-lg shadow-[#25D366]/25 transition-all duration-200 hover:bg-[#1ebe5d] hover:scale-[1.02]"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
            <WhatsAppIcon className="h-5 w-5" />
            Unirse al grupo de WhatsApp
          </Link>
        </div>

        {/* Pricing Section — recibo de terminal */}
        <div className={`${cardClass} p-7 h-full`}>
          <TopAccent />
          <div className="relative z-10">
            {/* Header: concepto + sello early bird */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <Eyebrow>Inversión</Eyebrow>
                <p className="mt-2 text-sm font-bold text-white/85">
                  Certificación Claude Code Dev
                </p>
              </div>
              <span className="shrink-0 rotate-3 rounded-md border border-terminal-green/40 bg-terminal-green/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-terminal-green">
                Early Bird
              </span>
            </div>

            {/* Selector de moneda */}
            <div className="flex justify-center mb-5">
              <CurrencySelector />
            </div>

            {/* Renglones del recibo */}
            <div className="border-t border-dashed border-white/15 pt-4 space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-[0.12em] text-white/40">
                  Precio regular
                </span>
                {currencyLoading ? (
                  <div className="h-6 w-20 bg-white/10 animate-pulse rounded" />
                ) : (
                  <span className="text-lg text-white/40 line-through">
                    {convertAndFormatPrice(REGULAR_PRICE_USD)}
                  </span>
                )}
              </div>

              <div className="flex items-end justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-claude-deep">
                  Precio Early Bird
                </span>
                {currencyLoading ? (
                  <div className="h-12 w-32 bg-white/10 animate-pulse rounded" />
                ) : (
                  <span className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_0_24px_rgba(217,119,87,0.3)]">
                      {convertAndFormatPrice(EARLY_BIRD_PRICE_USD)}
                    </span>
                    <span className="text-sm text-white/50">
                      {currentCurrency.code}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Ahorro + cupos */}
            <div className="mt-4 flex items-center justify-between border-t border-dashed border-white/15 pt-4">
              <span className="inline-flex items-center rounded-full border border-claude/30 bg-claude/10 px-3 py-1 text-xs font-bold text-claude">
                Ahorras{" "}
                {currencyLoading
                  ? "..."
                  : convertAndFormatPrice(
                    REGULAR_PRICE_USD - EARLY_BIRD_PRICE_USD
                  )}
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                Solo primeros 10
              </span>
            </div>

            {/* Nota de pago */}
            <p className="text-center text-white/40 text-xs mt-4">
              Los pagos se procesan en USD. Precio mostrado en{" "}
              {currentCurrency.name} es referencial.
            </p>
          </div>
        </div>
      </div>

      {/* Direct Checkout CTA */}
      <div className={`${cardClass} p-8 md:p-12 max-w-2xl mx-auto text-center`}>
        <TopAccent />
        <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-4">
          Asegura tu lugar con descuento
        </h2>
        <p className="text-white/50 mb-6 text-lg">
          Únete a la tercera cohorte que dominará Claude Code profesionalmente
        </p>

        <Link
          href="https://cursoscodinglatam.lemonsqueezy.com/checkout/buy/5e5924f2-44e3-43f5-b244-d68446726556"
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-claude-deep to-claude px-10 py-5 text-xl font-bold text-white shadow-lg shadow-claude-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-claude/40 cursor-pointer"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
          <CheckCircle2 className="h-6 w-6" />
          Pagar y Asegurar mi Lugar
          <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
        <p className="text-white/40 text-sm mt-4">
          Pago seguro procesado por Lemon Squeezy
        </p>
      </div>

      {/* Payment Methods Section */}
      <div className={`${cardClass} p-8 md:p-12 max-w-2xl mx-auto mt-8`}>
        <TopAccent />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Eyebrow>Métodos de pago</Eyebrow>
            <h3 className="text-xl font-bold text-white/90 mt-2 mb-4">
              Paga con
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { src: visaImage, alt: "Visa" },
                { src: cardImage, alt: "Mastercard" },
                { src: paypalImage, alt: "PayPal" },
                { src: americanExpressImage, alt: "American Express" },
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
                    className="h-6 w-auto object-contain"
                  />
                </span>
              ))}
            </div>
            <div className="rounded-xl border border-claude-deep/40 bg-claude-deep/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <PEFlag />
                <h4 className="text-lg font-bold text-white/90">
                  Opciones para Perú
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
                Envía tu voucher al{" "}
                <b className="text-white/90">+51 964225808</b> para completar tu
                registro
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

      {/* Form Card - Hidden for now */}
      {/* <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Recibe información del programa
          </h2>
          <p className="text-gray-600">
            Regístrate para recibir información del programa y futuras
            versiones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-lg bg-white border border-gray-300 shadow-sm pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent text-gray-900 placeholder-gray-400"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-100 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-gray-700 border-t-transparent rounded-full" />
                Enviando...
              </>
            ) : (
              <>
                Recibir Información
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {submitStatus.type === "success" && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm">{submitStatus.message}</p>
            </div>
          )}

          {submitStatus.type === "error" && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{submitStatus.message}</p>
            </div>
          )}
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          🔒 Te enviaremos información del programa por correo. Sin spam.
        </p>
      </div> */}

      {/* Benefits Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {[
          {
            icon: Zap,
            n: "01",
            title: "Productividad 3-5x",
            text: "Tareas que tomaban días ahora toman horas con IA",
          },
          {
            icon: GraduationCap,
            n: "02",
            title: "Certificación",
            text: "Badge verificable en LinkedIn y portfolio",
          },
          {
            icon: TrendingUp,
            n: "03",
            title: "Mayor Salario",
            text: "Justifica pedir 20-30% más con skills de IA",
          },
        ].map((b) => (
          <div
            key={b.title}
            className={`${cardClass} group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-claude/40`}
          >
            <TopAccent />
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-claude-deep/30 bg-claude-deep/10 transition-colors duration-300 group-hover:border-claude/50 group-hover:bg-claude/15">
                <b.icon className="h-5 w-5 text-claude" />
              </span>
              <span className="text-2xl font-bold text-white/[0.08] transition-colors duration-300 group-hover:text-claude/20">
                {b.n}
              </span>
            </div>
            <h3 className="font-semibold text-white/90 mb-1">{b.title}</h3>
            <p className="text-sm text-white/50">{b.text}</p>
          </div>
        ))}
      </div>

      {/* Programa Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Eyebrow>Programa · 8 clases en 2 sábados</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-4">
            ¿Qué vas a dominar?
          </h3>
          <p className="text-white/50 max-w-2xl mx-auto">
            Un programa intensivo de 2 sábados (9:00 AM – 12:00 PM) donde pasarás
            de cero con Claude Code a construir proyectos completos con agentes
            autónomos de IA.
          </p>
        </div>

        {program.map((block) => (
          <div key={block.block} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Eyebrow>{block.block}</Eyebrow>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                {block.schedule}
              </span>
              <span className="h-px flex-grow bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {block.classes.map((cls) => (
                <div key={cls.n} className={`${cardClass} p-6`}>
                  <TopAccent />
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-claude-deep">
                      Clase {cls.n}
                    </span>
                    <span className="text-xs font-medium text-white/40">
                      {cls.time}
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
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Metodología Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="mb-10">
          <Eyebrow>Metodología</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3 mb-3">
            Nuestra propuesta de aprendizaje
          </h3>
          <p className="text-white/50 max-w-2xl">
            No es teoría. Es construir proyectos reales supervisado por
            instructores en vivo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methodology.map((m) => (
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

      {/* Requisitos Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="mb-8">
          <Eyebrow>Requisitos</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3">
            ¿Qué necesitas para empezar?
          </h3>
        </div>
        <div className={`${cardClass} p-8`}>
          <TopAccent />
          <p className="text-white/60 mb-6">
            Solo necesitas saber programar en algún lenguaje (Python,
            JavaScript, Java, etc). No importa si nunca usaste herramientas de
            IA. Arrancamos desde cero con Claude Code y al final vas a poder
            construir proyectos completos{" "}
            <strong className="text-claude">3-5x más rápido</strong>.
          </p>
          <div className="border-t border-white/10 pt-5 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-claude shrink-0 mt-0.5" />
            <p className="text-sm text-white/60">
              Cada alumno debe contar con su propio plan de Claude. Como mínimo
              el <strong className="text-white/90">plan Pro ($20 USD/mes)</strong>
              . Este costo corre por cuenta del estudiante y no está incluido en
              la inscripción.
            </p>
          </div>
        </div>
      </div>

      {/* Instructor Section */}
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
                Senior Software Engineer & GDG Organizer · Founder, Coding Latam
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm text-white/60">
            <p>
              Ingeniero de software desde 2016, especializado en la intersección
              de IA y frontend engineering. Integra herramientas como Claude
              Code, Antigravity CLI, Skills y MCP Servers en cada etapa del ciclo de
              desarrollo: desde generación de código y debugging hasta
              decisiones de arquitectura y automatización de workflows.
            </p>
            <p>
              Combina experiencia profunda en frontend (React, Next.js, Vite,
              Astro, TypeScript) con prácticas modernas de AI engineering.
              Diseña sistemas donde la integración de LLMs, agentes de código
              autónomos y prompt engineering son el core de cómo entrega
              software rápido, confiable y de alta calidad.
            </p>
            <p>
              A través de Coding Latam, entrena desarrolladores en toda
              Latinoamérica en desarrollo práctico asistido por IA. Organizador
              principal de GDG Tacna con eventos de +400 developers.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-claude-deep mb-3">
              Stack diario
            </div>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-claude">→</span>
                <span>
                  <strong className="text-white/90">
                    IA y Automatización:
                  </strong>{" "}
                  Claude Code, MCP Servers, Antigravity CLI, SDD, Prompt Engineering
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-claude">→</span>
                <span>
                  <strong className="text-white/90">Frontend y Web:</strong>{" "}
                  React, Next.js, TypeScript, Vite, Astro, Tailwind
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-claude">→</span>
                <span>
                  <strong className="text-white/90">Herramientas:</strong> Git,
                  Playwright, CI/CD, Node.js
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Claude Code",
              "MCP Servers",
              "Chrome dev tools",
              "SDD",
              "React",
              "Next.js",
              "TypeScript",
              "Antigravity CLI",
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

      {/* Testimonios Section */}
      {testimonials.length > 0 && (
        <div className="relative mt-20">
          {/* Atmospheric terracota glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-72 w-[80%] max-w-4xl rounded-full bg-claude/10 blur-[100px]"
          />

          <div className="relative max-w-4xl mx-auto text-center mb-12 px-4">
            {/* Oversized quote watermark */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-16 left-0 select-none font-bold leading-none text-claude/[0.07] text-[10rem] sm:text-[13rem]"
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
                Ellos ya llevaron el curso
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
                    {/* Accent line, brightens on hover */}
                    <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-claude/80 via-claude/20 to-transparent transition-opacity duration-300 group-hover/card:via-claude/60" />

                    {/* Editor-tab chrome bar */}
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

                    {/* LinkedIn embed */}
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

      {/* Outcomes Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className={`${cardClass} p-8 md:p-10`}>
          <TopAccent />
          {/* glow interno */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-40 w-2/3 -translate-x-1/2 rounded-full bg-claude/10 blur-[90px]"
          />
          <div className="relative text-center mb-8">
            <Eyebrow>Resultados</Eyebrow>
            <h4 className="text-xl md:text-2xl font-bold text-white/90 mt-3">
              Lo que vas a lograr
            </h4>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            {[
              { value: "3-5x", text: "Más productivo que antes del programa" },
              { value: "90%", text: "De tiempo ahorrado en tareas repetitivas" },
              { value: "20-30%", text: "Incremento salarial en promedio" },
            ].map((o, i) => (
              <div
                key={o.value}
                className={`text-center md:px-6 ${i > 0 ? "md:border-l md:border-white/10" : ""
                  }`}
              >
                <div className="text-4xl md:text-5xl font-bold text-claude mb-2 drop-shadow-[0_0_28px_rgba(217,119,87,0.35)]">
                  {o.value}
                </div>
                <p className="text-sm text-white/60 max-w-[14rem] mx-auto">
                  {o.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inclusions Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <Eyebrow>Inversión</Eyebrow>
          <h3 className="text-2xl md:text-3xl font-bold text-white/90 mt-3">
            ¿Qué incluye tu inscripción?
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inclusions.map((inc) => (
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

      {/* CTA Section */}
      <div className="mt-20">
        <div className={`${cardClass} relative p-8 md:p-12 text-center`}>
          <TopAccent />
          {/* glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-48 w-3/4 -translate-x-1/2 rounded-full bg-claude/10 blur-[100px]"
          />

          <div className="relative">
            {/* Urgencia */}
            <div className="inline-flex items-center gap-2 rounded-full border border-claude-deep/40 bg-claude-deep/10 px-4 py-1.5 mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-claude opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-claude" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-claude-deep">
                Solo quedan pocos lugares
              </span>
            </div>

            <h3 className="text-2xl md:text-4xl font-bold text-white/90 mb-4 leading-tight">
              Asegura tu lugar en la{" "}
              <span className="text-claude">Cohorte 3</span>
            </h3>
            <p className="text-white/55 max-w-xl mx-auto mb-8">
              2 sábados intensivos para dominar Claude Code y salir construyendo
              proyectos reales. El precio Early Bird es solo para los primeros
              10.
            </p>

            {/* Chips de logística */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <Calendar className="h-4 w-4 text-claude" />2 sábados · Julio 2026
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <Clock className="h-4 w-4 text-claude" />
                9:00 AM – 12:00 PM
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <BadgeCheck className="h-4 w-4 text-claude" />
                Certificación al finalizar
              </span>
            </div>

            <Link
              href="https://cursoscodinglatam.lemonsqueezy.com/checkout/buy/5e5924f2-44e3-43f5-b244-d68446726556"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-claude-deep to-claude px-10 py-5 text-xl font-bold text-white shadow-lg shadow-claude-deep/25 transition-transform duration-200 hover:scale-[1.02] hover:shadow-claude/40 cursor-pointer"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
              <CheckCircle2 className="h-6 w-6" />
              Pagar y Asegurar mi Lugar
              <ArrowRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <p className="text-white/40 text-sm mt-4">
              Pago seguro procesado por Lemon Squeezy
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
