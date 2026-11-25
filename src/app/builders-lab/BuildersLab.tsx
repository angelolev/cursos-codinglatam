"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown, Lock } from "lucide-react";
import {
  Eyebrow,
  cardClass,
  TopAccent,
  WhatsAppIcon,
  useScrollReveal,
} from "@/components/claude-brochure";
import angeloImage from "@/assets/angelo-devfest.jpg";
import { Countdown } from "../claude-de-0-a-100/Countdown";
import {
  CIERRE_FUNDADOR,
  CUPOS_RESTANTES,
  CUPOS_TOTALES,
  MENSAJE_LISTA_ESPERA,
  PLANES,
  waLink,
} from "./config";

// Paleta Coding Latam: tarjetas en Eerie Black-900 con borde Onyx.
const brandCard = cardClass
  .replace("border-white/10", "border-[#3d3d3d]")
  .replace(
    "from-white/[0.055] to-white/[0.015]",
    "from-[#1e1e1e] to-[#1e1e1e]"
  );

const INCLUYE = [
  {
    emoji: "🌙",
    title: "Lab Night mensual",
    text: "El último viernes de cada mes nos juntamos en vivo a compartir lo que estamos creando, lo que aprendimos y lo que nos estresó.",
  },
  {
    emoji: "🎥",
    title: "Aprendizaje de la semana",
    text: "Un video con lo que probé, lo que funcionó y lo que no.",
  },
  {
    emoji: "⚡",
    title: "Acceso anticipado",
    text: "Mis videos del canal, antes que nadie.",
  },
  {
    emoji: "💬",
    title: "Grupo privado",
    text: `Nuestro nexo de conexión inmediata con los ${CUPOS_TOTALES} builders para compartir recursos, novedades, herramientas y más sobre IA.`,
  },
  {
    emoji: "🎓",
    title: "Material premium de certificación",
    text: "Para prepararte en certificaciones de IA, empezando por Claude.",
  },
];

const FAQ = [
  {
    q: "¿Cómo entro al grupo?",
    a: "Me escribes por WhatsApp desde el botón de tu plan, te paso los medios de pago y, cuando confirmo tu pago, te agrego al grupo privado y te envío el acceso al material.",
  },
  {
    q: "¿Necesito saber programar?",
    a: "No. El Lab es para cualquier persona que esté construyendo con IA, programe o no. Lo importante es que estés creando algo y quieras compartirlo.",
  },
  {
    q: "¿Puedo cancelar el plan mensual?",
    a: "Sí, cuando quieras. Simplemente no renuevas el mes siguiente y mantienes tu acceso hasta el final del mes que pagaste.",
  },
  {
    q: "¿Qué pasa después del Black Friday?",
    a: `El precio regular es S/79 al mes y, cuando se llenen los ${CUPOS_TOTALES} cupos, solo se entra por lista de espera.`,
  },
];

// Cierra el Pase Fundador en vivo si la fecha vence con la página abierta.
function useFundadorCerrado(cerradoInicial: boolean) {
  const [cerrado, setCerrado] = useState(cerradoInicial);
  useEffect(() => {
    if (cerrado) return;
    const ms = CIERRE_FUNDADOR.getTime() - Date.now();
    if (ms <= 0) {
      setCerrado(true);
      return;
    }
    // setTimeout no admite más de ~24,8 días; por encima no hace falta.
    if (ms > 2_147_483_647) return;
    const id = setTimeout(() => setCerrado(true), ms);
    return () => clearTimeout(id);
  }, [cerrado]);
  return cerrado;
}

const sectionTitle =
  "text-[1.7rem] leading-tight md:text-3xl font-bold text-white/90 mt-3";

export function BuildersLab({ cerradoInicial }: { cerradoInicial: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);
  useScrollReveal(contentRef);
  const cerrado = useFundadorCerrado(cerradoInicial);

  const ocupados = CUPOS_TOTALES - Math.max(CUPOS_RESTANTES, 0);

  return (
    <main className="pt-24 pb-20 mx-auto w-full max-w-5xl px-4 sm:px-6 flex-grow min-w-0 [--accent:#ecb033] [--accent-deep:#e4911c]">
      {/* Fondo de layout de la marca (Eerie Black). */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-[#171717]"
      />
      <div ref={contentRef}>
        {/* Hero */}
        <section className="relative text-center mb-20">
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
            {cerrado ? (
              <Lock className="h-3.5 w-3.5 text-primary-400" />
            ) : (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-primary-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-400" />
              </span>
            )}
            <span className="text-xs font-semibold uppercase tracking-[0.08em] md:tracking-[0.2em] text-primary-500">
              {cerrado
                ? "Pase Fundador cerrado"
                : `Solo ${CUPOS_TOTALES} cupos · Pase Fundador hasta el lunes 30`}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white/90 mb-6 leading-[1.05]">
            Builders{" "}
            <span className="text-primary-400 drop-shadow-[0_0_30px_rgba(236,176,51,0.35)]">
              Lab
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#b5b5b5] max-w-xl mx-auto mb-8">
            Un grupo exclusivo para aplicar IA de verdad y aprender sobre
            agentes y mucho más.
          </p>

          {!cerrado && (
            <>
              <Countdown
                deadline={CIERRE_FUNDADOR}
                label="El Pase Fundador cierra en"
                className="mb-8"
              />

              <div className="mx-auto mb-8 max-w-xs">
                <p className="text-base md:text-sm text-white/80">
                  Quedan{" "}
                  <strong className="text-primary-400 text-lg">
                    {CUPOS_RESTANTES}
                  </strong>{" "}
                  de {CUPOS_TOTALES} cupos
                </p>
                <div
                  className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                  aria-hidden
                >
                  <div
                    className="h-full rounded-full bg-primary-400"
                    style={{ width: `${(ocupados / CUPOS_TOTALES) * 100}%` }}
                  />
                </div>
              </div>
            </>
          )}

          <a
            href="#precios"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary-400 px-8 py-4 text-lg font-bold text-[#171717] shadow-lg shadow-primary-500/25 transition-colors hover:bg-primary-300"
          >
            {cerrado ? "Unirme a la lista de espera" : "Reserva tu cupo"}
            <ArrowRight className="h-5 w-5" />
          </a>
        </section>

        {/* Quién soy */}
        <section className="mb-20 max-w-3xl mx-auto">
          <div className={`${brandCard} p-6 sm:p-8`}>
            <TopAccent />
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center text-center sm:text-left">
              <Image
                src={angeloImage}
                alt="Angelo Leva dando una charla en el DevFest"
                sizes="(min-width: 640px) 160px, 192px"
                placeholder="blur"
                className="w-48 sm:w-40 aspect-square h-auto rounded-full object-cover object-top border-2 border-primary-400/40 shrink-0"
              />
              <div>
                <Eyebrow>Quién soy</Eyebrow>
                <h2 className="text-2xl font-bold text-white/90 mt-2">
                  Angelo Leva
                </h2>
                <p className="text-primary-400 text-sm mt-1">
                  Claude Certified Associate
                </p>
                <p className="mt-4 text-base text-[#b5b5b5]">
                  Todos los días pruebo herramientas de IA y construyo con
                  ellas, porque la única manera de aprender es haciendo, no
                  viendo curso tras curso. Como Claude Certified Associate,
                  quiero compartir todo eso con un grupo pequeño de builders.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Qué incluye */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <Eyebrow>Qué incluye</Eyebrow>
            <h2 className={sectionTitle}>Lo que pasa dentro del Lab</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {INCLUYE.map((item) => (
              <div
                key={item.title}
                className={`${brandCard} p-6 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]`}
              >
                <TopAccent />
                <span className="text-3xl" aria-hidden>
                  {item.emoji}
                </span>
                <h3 className="mt-3 text-lg font-bold text-white/90">
                  {item.title}
                </h3>
                <p className="mt-2 text-base md:text-sm text-[#b5b5b5]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Por qué de pago y por qué solo 20 */}
        <section className="mb-20 max-w-3xl mx-auto">
          <Eyebrow>El porqué</Eyebrow>
          <h2 className={`${sectionTitle} mb-6`}>
            ¿Por qué de pago y por qué solo {CUPOS_TOTALES}?
          </h2>
          <div className="space-y-4 text-base md:text-lg text-[#b5b5b5]">
            <p>
              Porque quiero un grupo donde de verdad pasen cosas. Los espacios
              gratis se llenan, pero casi nadie participa. Cuando cada uno
              invierte, llega con ganas de construir, compartir y aportar.
              Además, el pago me permite dedicarle al Lab el tiempo que merece:
              preparar el material, los videos de cada semana y las sesiones.
            </p>
            <p>
              Y son solo {CUPOS_TOTALES} porque así{" "}
              <strong className="text-white/90">
                todos hablan en la Lab Night
              </strong>
              , nos conocemos por nombre y el grupo se siente como un equipo, no
              como un chat más.
            </p>
          </div>
        </section>

        {/* Precios y reserva */}
        <section id="precios" className="mb-20 scroll-mt-24">
          <div className="text-center mb-10">
            <Eyebrow>{cerrado ? "Lista de espera" : "Pase Fundador"}</Eyebrow>
            <h2 className={sectionTitle}>
              {cerrado ? "Pase Fundador cerrado" : "Reserva tu cupo"}
            </h2>
            {!cerrado && (
              <p className="mt-3 text-base md:text-sm text-[#b5b5b5]">
                Quedan {CUPOS_RESTANTES} de {CUPOS_TOTALES} cupos
              </p>
            )}
          </div>

          {cerrado ? (
            <div className={`${brandCard} max-w-xl mx-auto p-7 text-center`}>
              <TopAccent />
              <Lock className="mx-auto h-8 w-8 text-primary-400" />
              <p className="mt-4 text-base text-[#b5b5b5]">
                Los precios de fundador ya no están disponibles. Déjame tu
                nombre en la lista de espera y te escribo cuando se abra un
                cupo.
              </p>
              <WhatsAppButton
                href={waLink(MENSAJE_LISTA_ESPERA)}
                label="Unirme a la lista de espera"
                primary
                className="mt-6"
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 md:items-center max-w-md md:max-w-none mx-auto">
                {PLANES.map((plan) => (
                  <div
                    key={plan.id}
                    className={`${brandCard} p-6 sm:p-7 flex flex-col ${
                      plan.destacado
                        ? "md:order-2 border-primary-400/70! shadow-[0_0_0_1px_rgba(236,176,51,0.35),0_24px_60px_-24px_rgba(236,176,51,0.35)] md:py-10"
                        : plan.id === "semestral"
                          ? "md:order-1"
                          : "md:order-3"
                    }`}
                  >
                    {plan.destacado && <TopAccent />}
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70">
                        {plan.nombre}
                      </h3>
                      {plan.destacado && (
                        <span className="rounded-full bg-primary-400 px-3 py-1 text-xs font-bold text-[#171717]">
                          Mejor opción
                        </span>
                      )}
                    </div>
                    <div className="mt-5 flex items-baseline flex-wrap gap-x-3 gap-y-1">
                      <span className="text-5xl font-bold text-white">
                        {plan.precio}
                      </span>
                      {plan.periodo && (
                        <span className="text-lg text-white/70">
                          {plan.periodo}
                        </span>
                      )}
                      {plan.precioRegular && (
                        <span className="text-xl text-white/50 line-through">
                          <span className="sr-only">Precio regular </span>
                          {plan.precioRegular}
                        </span>
                      )}
                    </div>
                    {plan.equivalente && (
                      <p className="mt-2 text-base md:text-sm font-semibold text-primary-400">
                        {plan.equivalente}
                      </p>
                    )}
                    <p className="mt-4 rounded-lg border border-dashed border-primary-400/40 px-3 py-2 text-[15px] md:text-sm text-white/75">
                      {plan.nota}
                    </p>
                    <WhatsAppButton
                      href={waLink(plan.mensaje)}
                      label="Reservar mi cupo"
                      primary={plan.destacado}
                      className="mt-6"
                    />
                  </div>
                ))}
              </div>

              <p className="mt-8 max-w-2xl mx-auto text-center text-base md:text-sm text-[#b5b5b5]">
                Te respondo por WhatsApp con los medios de pago (Yape, Plin,
                transferencia o PayPal).
              </p>
            </>
          )}
        </section>

        {/* Preguntas frecuentes */}
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className={sectionTitle}>Preguntas frecuentes</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-[#3d3d3d] bg-[#1e1e1e]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-base font-semibold text-white/85 hover:text-primary-400 [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="border-t border-white/10 px-5 py-4 text-base md:text-sm text-[#b5b5b5]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function WhatsAppButton({
  href,
  label,
  primary,
  className = "",
}: {
  href: string;
  label: string;
  primary?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 text-base font-bold transition-colors ${
        primary
          ? "bg-primary-400 text-[#171717] shadow-lg shadow-primary-500/25 hover:bg-primary-300"
          : "border border-primary-400/60 text-primary-400 hover:bg-primary-400/10"
      } ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {label}
    </a>
  );
}
