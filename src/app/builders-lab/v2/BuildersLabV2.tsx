"use client";
import { useState } from "react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowRight, ChevronDown } from "lucide-react";
import { WhatsAppIcon } from "@/components/claude-brochure";
import angeloImage from "@/assets/angelo-devfest.jpg";
import { useCountdown } from "../../claude-de-0-a-100/Countdown";
import {
  CIERRE_FUNDADOR,
  CUPOS_TOTALES,
  MENSAJE_LISTA_ESPERA,
  PLANES,
  type Plan,
  waLink,
} from "../config";
import {
  FAQ,
  INCLUYE,
  MEDIOS_DE_PAGO,
  QUIEN_SOY,
  SUBTITULO,
  TEXTO_CERRADO,
} from "../contenido";
import { useFundadorCerrado } from "../useFundadorCerrado";

// Versión 2: sigue la skill gemini-frontend-design. Fondo claro tipo galería,
// un solo acento (azul cobalto), una sola familia sans y sin adornos.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Paleta: fondo, superficie, texto, texto secundario (AA sobre el fondo),
// líneas y acento.
const c = {
  bg: "bg-[#F6F7F9]",
  surface: "bg-[#E8EAF0]",
  ink: "text-[#0B0D12]",
  muted: "text-[#4A5160]",
  line: "border-[#D6D9E1]",
  accentText: "text-[#1F3BFF]",
};

const container = "mx-auto w-full max-w-7xl px-5 sm:px-8";
const h2Class =
  "text-4xl md:text-5xl font-bold leading-[1.05] tracking-[-0.03em]";

export function BuildersLabV2({
  cuposRestantes,
  cerradoInicial,
}: {
  cuposRestantes: number;
  cerradoInicial: boolean;
}) {
  const cerrado = useFundadorCerrado(cerradoInicial);

  return (
    <main
      className={`${bricolage.className} ${c.bg} ${c.ink} flex-grow min-w-0 w-full pt-16`}
    >
      {/* Hero: póster tipográfico a todo el ancho. */}
      <section className={`${container} pt-12 pb-14 md:pt-20 md:pb-20`}>
        <h1 className="font-extrabold leading-[0.82] tracking-[-0.055em] text-[clamp(4.5rem,21vw,16rem)]">
          <span className="builders-rise block">Builders</span>
          <span
            className={`builders-rise block ${c.accentText}`}
            style={{ animationDelay: "120ms" }}
          >
            Lab
          </span>
        </h1>
        <div
          className="builders-rise mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between"
          style={{ animationDelay: "260ms" }}
        >
          <p className="max-w-xl text-2xl md:text-3xl font-medium leading-snug tracking-[-0.01em]">
            <span className={`block ${c.muted}`}>{SUBTITULO[0]}</span>
            <span className="block">{SUBTITULO[1]}</span>
          </p>
          <a
            href="#precios"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#1F3BFF] px-8 py-4 text-lg font-semibold text-white transition-colors duration-200 ease-out hover:bg-[#1630D9] sm:w-auto"
          >
            {cerrado ? "Unirme a la lista de espera" : "Conviértete en builder"}
            <ArrowRight className="h-5 w-5" aria-hidden />
          </a>
        </div>
      </section>

      {/* Franja de color: urgencia real (cupos y cuenta regresiva). */}
      <section className="bg-[#1F3BFF] text-white">
        <div
          className={`${container} grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end md:py-16`}
        >
          {cerrado ? (
            <h2 className={h2Class}>Precio de lanzamiento cerrado.</h2>
          ) : (
            <>
              <div>
                <h2 className={`${h2Class} max-w-2xl`}>
                  Solo {CUPOS_TOTALES} cupos. Precio de lanzamiento hasta el
                  lunes 30.
                </h2>
                <p className="mt-6 text-lg text-white/85">
                  Quedan <strong className="text-white">{cuposRestantes}</strong>{" "}
                  de {CUPOS_TOTALES} cupos
                </p>
                <div
                  aria-hidden
                  className="mt-3 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/25"
                >
                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${((CUPOS_TOTALES - cuposRestantes) / CUPOS_TOTALES) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <CuentaRegresiva />
            </>
          )}
        </div>
      </section>

      {/* Quién soy: foto grande y texto, en dos columnas asimétricas. */}
      <section className={`${container} py-20 md:py-28`}>
        <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-8">
          <Image
            src={angeloImage}
            alt="Angelo Leva dando una charla en el DevFest"
            sizes="(min-width: 768px) 40vw, 100vw"
            placeholder="blur"
            className="aspect-[4/5] h-auto w-full max-w-md rounded-2xl object-cover md:col-span-5 md:max-w-none"
          />
          <div className="md:col-span-6 md:col-start-7">
            <h2 className={h2Class}>Angelo Leva</h2>
            <p className={`mt-2 text-lg font-semibold ${c.accentText}`}>
              Claude Certified Associate
            </p>
            <p className={`mt-6 max-w-[60ch] text-lg leading-relaxed ${c.muted}`}>
              {QUIEN_SOY}
            </p>
          </div>
        </div>
      </section>

      {/* Qué incluye: filas con divisores, título y texto en columnas. */}
      <section className={`${container} pb-20 md:pb-28`}>
        <h2 className={h2Class}>Lo que pasa dentro del Lab</h2>
        <ul className={`mt-10 border-t ${c.line}`}>
          {INCLUYE.map((item) => (
            <li
              key={item.title}
              className={`grid gap-2 border-b ${c.line} py-7 md:grid-cols-12 md:gap-8`}
            >
              <h3 className="flex items-center gap-3 text-lg font-bold md:col-span-5">
                <span aria-hidden className="text-2xl">
                  {item.emoji}
                </span>
                {item.title}
              </h3>
              <p className={`text-lg ${c.muted} md:col-span-7`}>{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Por qué de pago: bloque oscuro a todo el ancho. */}
      <section className="bg-[#0B0D12] text-white">
        <div className={`${container} grid gap-10 py-20 md:grid-cols-12 md:py-28`}>
          <h2 className={`${h2Class} md:col-span-5`}>
            ¿Por qué de pago y por qué solo {CUPOS_TOTALES}?
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-white/75 md:col-span-6 md:col-start-7">
            <p>
              Porque quiero un grupo donde de verdad pasen cosas. Los espacios
              gratis se llenan, pero casi nadie participa. Cuando cada uno
              invierte, llega con ganas de construir, compartir y aportar.
              Además, el pago me permite dedicarle al Lab el tiempo que merece:
              preparar el material, los videos de cada semana y las sesiones.
            </p>
            <p>
              Y son solo {CUPOS_TOTALES} porque así{" "}
              <strong className="text-white">todos hablan en la Lab Night</strong>
              , nos conocemos por nombre y el grupo se siente como un equipo, no
              como un chat más.
            </p>
          </div>
        </div>
      </section>

      {/* Precios: un selector de plan y un solo botón. */}
      <section id="precios" className={`${container} scroll-mt-16 py-20 md:py-28`}>
        <div className="mx-auto max-w-3xl">
          <h2 className={h2Class}>
            {cerrado ? "Precio de lanzamiento cerrado" : "Conviértete en builder"}
          </h2>
          {cerrado ? (
            <>
              <p className={`mt-6 text-lg ${c.muted}`}>{TEXTO_CERRADO}</p>
              <BotonWhatsApp
                href={waLink(MENSAJE_LISTA_ESPERA)}
                label="Unirme a la lista de espera"
                className="mt-8"
              />
            </>
          ) : (
            <SelectorDePlan cuposRestantes={cuposRestantes} />
          )}
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className={`border-t ${c.line}`}>
        <div className={`${container} grid gap-10 py-20 md:grid-cols-12 md:py-28`}>
          <h2 className={`${h2Class} md:col-span-4 md:self-start md:sticky md:top-24`}>
            Preguntas frecuentes
          </h2>
          <div className={`border-t ${c.line} md:col-span-7 md:col-start-6`}>
            {FAQ.map((item) => (
              <details key={item.q} className={`group border-b ${c.line}`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-lg font-bold transition-colors duration-200 ease-out hover:text-[#1F3BFF] [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180" />
                </summary>
                <p className={`pb-6 text-lg ${c.muted}`}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function SelectorDePlan({ cuposRestantes }: { cuposRestantes: number }) {
  const [planId, setPlanId] = useState<Plan["id"]>("anual");
  const plan = PLANES.find((p) => p.id === planId) ?? PLANES[0];

  return (
    <>
      <p className={`mt-4 text-lg ${c.muted}`}>
        Quedan {cuposRestantes} de {CUPOS_TOTALES} cupos
      </p>

      <div
        role="radiogroup"
        aria-label="Elige tu plan"
        className={`mt-10 inline-flex rounded-full ${c.surface} p-1`}
      >
        {PLANES.map((p) => {
          const activo = p.id === planId;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => setPlanId(p.id)}
              className={`rounded-full px-5 py-2.5 text-base font-semibold transition-colors duration-200 ease-out sm:px-7 ${
                activo
                  ? "bg-white text-[#0B0D12] shadow-sm"
                  : `${c.muted} hover:text-[#0B0D12]`
              }`}
            >
              {p.nombre}
            </button>
          );
        })}
      </div>

      <div className={`mt-10 border-t ${c.line} pt-10`}>
        {plan.destacado && (
          <p className={`text-lg font-bold ${c.accentText}`}>Mejor opción</p>
        )}
        <p className="mt-2 flex flex-wrap items-baseline gap-x-3 tabular-nums">
          <span className="text-[clamp(4rem,14vw,7rem)] font-extrabold leading-none tracking-[-0.04em]">
            {plan.precio}
          </span>
          {plan.periodo && (
            <span className={`text-2xl font-medium ${c.muted}`}>{plan.periodo}</span>
          )}
        </p>
        <p className={`mt-4 text-lg ${c.muted}`}>
          {plan.precioRegular && (
            <>
              Precio regular{" "}
              <span className="line-through">{plan.precioRegular}</span>
              {plan.equivalente ? ". " : ""}
            </>
          )}
          {plan.equivalente && (
            <strong className="font-semibold text-[#0B0D12]">
              {plan.equivalente}
            </strong>
          )}
        </p>
        <p className="mt-2 text-lg font-semibold">{plan.nota}</p>

        <BotonWhatsApp
          href={waLink(plan.mensaje)}
          label="Reservar mi cupo"
          className="mt-10"
        />
        <p className={`mt-5 text-base ${c.muted}`}>{MEDIOS_DE_PAGO}</p>
      </div>
    </>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

function CuentaRegresiva() {
  const r = useCountdown(CIERRE_FUNDADOR);
  if (r === "expired") return null;
  const units = [
    { value: r ? String(r.days) : "0", label: "días" },
    { value: r ? pad(r.hours) : "00", label: "horas" },
    { value: r ? pad(r.minutes) : "00", label: "min" },
    { value: r ? pad(r.seconds) : "00", label: "seg" },
  ];
  return (
    <div role="timer" className={r ? "" : "invisible"}>
      {r && (
        <span className="sr-only">
          El precio de lanzamiento termina en {r.days} días, {r.hours} horas y{" "}
          {r.minutes} minutos
        </span>
      )}
      <p aria-hidden className="text-base font-semibold text-white/85">
        Termina en
      </p>
      <div aria-hidden className="mt-2 flex gap-5 tabular-nums sm:gap-7">
        {units.map((u) => (
          <div key={u.label}>
            <div className="text-5xl font-extrabold leading-none tracking-[-0.03em] sm:text-6xl">
              {u.value}
            </div>
            <div className="mt-2 text-base text-white/80">{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BotonWhatsApp({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F3BFF] px-9 py-4 text-lg font-semibold text-white transition-colors duration-200 ease-out hover:bg-[#1630D9] sm:w-auto ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {label}
    </a>
  );
}
