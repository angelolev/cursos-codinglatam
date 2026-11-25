"use client";
import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Check, ChevronDown, Lock } from "lucide-react";
import {
  Eyebrow,
  WhatsAppIcon,
  useScrollReveal,
} from "@/components/claude-brochure";
import angeloImage from "@/assets/angelo-devfest.jpg";
import { Countdown } from "../claude-de-0-a-100/Countdown";
import {
  CIERRE_FUNDADOR,
  CUPOS_TOTALES,
  MENSAJE_LISTA_ESPERA,
  PLANES,
  waLink,
} from "./config";
import {
  FAQ,
  INCLUYE,
  MEDIOS_DE_PAGO,
  QUIEN_SOY,
  SUBTITULO,
  TEXTO_CERRADO,
} from "./contenido";
import { useFundadorCerrado } from "./useFundadorCerrado";

// Versión 1: identidad de Coding Latam (Fira Code, Eerie Black y dorado),
// con un hero más contundente y secciones sin cajas anidadas.

const h2Class =
  "mt-3 text-[1.75rem] leading-tight md:text-4xl font-bold tracking-[-0.02em] text-white/90";

export function BuildersLab({
  cuposRestantes,
  cerradoInicial,
}: {
  cuposRestantes: number;
  cerradoInicial: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  useScrollReveal(contentRef);
  const cerrado = useFundadorCerrado(cerradoInicial);
  const ocupados = CUPOS_TOTALES - cuposRestantes;
  const [destacado, ...resto] = INCLUYE;

  return (
    <main className="pt-16 pb-24 mx-auto w-full max-w-6xl px-4 sm:px-6 flex-grow min-w-0 [--accent:#ecb033] [--accent-deep:#e4911c]">
      {/* Fondo de layout de la marca (Eerie Black). */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-[#171717]"
      />

      {/* Hero: el nombre manda, a casi todo el ancho. */}
      <section className="relative pt-10 pb-20 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[32rem] w-[56rem] max-w-[100vw] -translate-x-1/2 rounded-full bg-primary-400/10 blur-[140px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] opacity-[0.1] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <p className="inline-flex items-center gap-2 rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-primary-400">
          {cerrado ? (
            <Lock className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary-400" />
          )}
          {cerrado
            ? "Precio de lanzamiento cerrado"
            : `Conviértete en builder · Solo ${CUPOS_TOTALES} cupos hasta el lunes 30`}
        </p>

        <h1 className="mt-8 font-bold leading-[0.9] tracking-[-0.05em] text-white/90 text-[clamp(4.25rem,19vw,11rem)]">
          <span className="builders-rise block">Builders</span>
          <span
            className="builders-rise block text-primary-400 drop-shadow-[0_0_40px_rgba(236,176,51,0.35)]"
            style={{ animationDelay: "120ms" }}
          >
            Lab
          </span>
        </h1>

        <p
          className="builders-rise mx-auto mt-8 max-w-2xl text-xl md:text-2xl text-[#b5b5b5]"
          style={{ animationDelay: "240ms" }}
        >
          <span className="block">{SUBTITULO[0]}</span>
          <span className="block text-white/90">{SUBTITULO[1]}</span>
        </p>

        <a
          href="#precios"
          className="builders-rise mt-10 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary-400 px-9 py-4 text-lg font-bold text-[#171717] shadow-lg shadow-primary-500/25 transition-colors duration-200 hover:bg-primary-300"
          style={{ animationDelay: "360ms" }}
        >
          {cerrado ? "Unirme a la lista de espera" : "Conviértete en builder"}
          <ArrowRight className="h-5 w-5" />
        </a>

        {/* Urgencia real: cuenta regresiva y cupos, en un solo bloque. */}
        {!cerrado && (
          <div className="mx-auto mt-12 max-w-md border-t border-white/10 pt-8">
            <Countdown
              deadline={CIERRE_FUNDADOR}
              label="El precio de lanzamiento termina en"
            />
            <div className="mt-6">
              <p className="text-base text-white/80">
                Quedan{" "}
                <strong className="text-lg text-primary-400">
                  {cuposRestantes}
                </strong>{" "}
                de {CUPOS_TOTALES} cupos
              </p>
              <div
                aria-hidden
                className="mx-auto mt-2 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className="h-full rounded-full bg-primary-400"
                  style={{ width: `${(ocupados / CUPOS_TOTALES) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <div ref={contentRef}>
        {/* Quién soy: foto y texto, sin caja. */}
        <section className="border-t border-white/10 py-16 md:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center md:flex-row md:items-center md:gap-12 md:text-left">
            <Image
              src={angeloImage}
              alt="Angelo Leva dando una charla en el DevFest"
              sizes="(min-width: 768px) 208px, 192px"
              placeholder="blur"
              className="aspect-square h-auto w-48 shrink-0 rounded-full border-2 border-primary-400/40 object-cover object-top md:w-52"
            />
            <div>
              <Eyebrow>Quién soy</Eyebrow>
              <h2 className={h2Class}>Angelo Leva</h2>
              <p className="mt-1 text-base font-semibold text-primary-400">
                Claude Certified Associate
              </p>
              <p className="mt-5 max-w-[60ch] text-lg text-[#b5b5b5]">
                {QUIEN_SOY}
              </p>
            </div>
          </div>
        </section>

        {/* Qué incluye: la Lab Night destacada y el resto en lista. */}
        <section className="border-t border-white/10 py-16 md:py-20">
          <div className="text-center">
            <Eyebrow>Qué incluye</Eyebrow>
            <h2 className={h2Class}>Lo que pasa dentro del Lab</h2>
          </div>

          <div className="mt-10 rounded-2xl border border-primary-400/30 bg-gradient-to-br from-primary-400/[0.09] to-transparent p-7 md:p-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
              <span aria-hidden className="text-5xl md:text-6xl">
                {destacado.emoji}
              </span>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white/90">
                  {destacado.title}
                </h3>
                <p className="mt-2 max-w-[60ch] text-lg text-[#b5b5b5]">
                  {destacado.text}
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
            {resto.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 border-b border-white/10 py-6"
              >
                <span aria-hidden className="text-3xl leading-none">
                  {item.emoji}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white/90">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-base text-[#b5b5b5]">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Por qué de pago y por qué solo 20: lectura editorial. */}
        <section className="border-t border-white/10 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <Eyebrow>El porqué</Eyebrow>
            <h2 className={h2Class}>
              ¿Por qué de pago y por qué solo {CUPOS_TOTALES}?
            </h2>
            <div className="mt-8 space-y-5 border-l-2 border-primary-400/60 pl-6 text-lg text-[#b5b5b5]">
              <p>
                Porque quiero un grupo donde de verdad pasen cosas. Los espacios
                gratis se llenan, pero casi nadie participa. Cuando cada uno
                invierte, llega con ganas de construir, compartir y aportar.
                Además, el pago me permite dedicarle al Lab el tiempo que
                merece: preparar el material, los videos de cada semana y las
                sesiones.
              </p>
              <p>
                Y son solo {CUPOS_TOTALES} porque así{" "}
                <strong className="text-white/90">
                  todos hablan en la Lab Night
                </strong>
                , nos conocemos por nombre y el grupo se siente como un equipo,
                no como un chat más.
              </p>
            </div>
          </div>
        </section>

        {/* Precios y reserva */}
        <section
          id="precios"
          className="scroll-mt-20 border-t border-white/10 py-16 md:py-20"
        >
          <div className="text-center">
            <Eyebrow>{cerrado ? "Lista de espera" : "Precio de lanzamiento"}</Eyebrow>
            <h2 className={h2Class}>
              {cerrado ? "Precio de lanzamiento cerrado" : "Conviértete en builder"}
            </h2>
            {!cerrado && (
              <p className="mt-3 text-base text-[#b5b5b5]">
                Quedan {cuposRestantes} de {CUPOS_TOTALES} cupos
              </p>
            )}
          </div>

          {cerrado ? (
            <div className="mx-auto mt-10 max-w-xl text-center">
              <p className="text-lg text-[#b5b5b5]">{TEXTO_CERRADO}</p>
              <WhatsAppButton
                href={waLink(MENSAJE_LISTA_ESPERA)}
                label="Unirme a la lista de espera"
                primary
                className="mt-8 sm:w-auto sm:px-10"
              />
            </div>
          ) : (
            <>
              <div className="mx-auto mt-10 grid max-w-md grid-cols-1 gap-4 md:max-w-none md:grid-cols-3 md:items-center md:gap-5">
                {PLANES.map((plan) => (
                  <article
                    key={plan.id}
                    className={`flex flex-col rounded-2xl border p-6 sm:p-7 ${
                      plan.destacado
                        ? "md:order-2 border-primary-400/70 bg-[#1e1e1e] shadow-[0_24px_60px_-24px_rgba(236,176,51,0.35)] md:py-10"
                        : `border-[#3d3d3d] bg-[#1b1b1b] ${plan.id === "semestral" ? "md:order-1" : "md:order-3"}`
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-bold uppercase tracking-[0.12em] text-white/70">
                        {plan.nombre}
                      </h3>
                      {plan.destacado && (
                        <span className="rounded-full bg-primary-400 px-3 py-1 text-[13px] font-bold text-[#171717]">
                          Mejor opción
                        </span>
                      )}
                    </div>
                    <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-5xl font-bold tracking-[-0.03em] text-white">
                        {plan.precio}
                      </span>
                      {plan.periodo && (
                        <span className="text-lg text-white/70">{plan.periodo}</span>
                      )}
                      {plan.precioRegular && (
                        <span className="text-xl text-white/50 line-through">
                          <span className="sr-only">Precio regular </span>
                          {plan.precioRegular}
                        </span>
                      )}
                    </div>
                    {plan.equivalente && (
                      <p className="mt-2 text-base font-semibold text-primary-400">
                        {plan.equivalente}
                      </p>
                    )}
                    <p className="mt-4 flex items-center gap-2 text-base text-white/75">
                      <Check className="h-4 w-4 shrink-0 text-primary-400" aria-hidden />
                      {plan.nota}
                    </p>
                    <WhatsAppButton
                      href={waLink(plan.mensaje)}
                      label="Reservar mi cupo"
                      primary={plan.destacado}
                      className="mt-6"
                    />
                  </article>
                ))}
              </div>
              <p className="mx-auto mt-8 max-w-2xl text-center text-base text-[#b5b5b5]">
                {MEDIOS_DE_PAGO}
              </p>
            </>
          )}
        </section>

        {/* Preguntas frecuentes */}
        <section className="border-t border-white/10 pt-16 md:pt-20">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <Eyebrow>FAQ</Eyebrow>
              <h2 className={h2Class}>Preguntas frecuentes</h2>
            </div>
            <div className="mt-10 border-t border-white/10">
              {FAQ.map((item) => (
                <details key={item.q} className="group border-b border-white/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-semibold text-white/85 transition-colors duration-200 hover:text-primary-400 [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="pb-6 text-base text-[#b5b5b5]">{item.a}</p>
                </details>
              ))}
            </div>
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
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 text-base font-bold transition-colors duration-200 ${
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
