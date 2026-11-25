// Configuración del Builders Lab: todo lo que cambia (fecha de cierre, cupos,
// precios y WhatsApp) vive aquí y lo leen la página, los meta tags y la
// imagen OG.

// Cierre del precio de lanzamiento: lunes 30 de noviembre de 2026 a las 23:59:59
// hora Perú (UTC-5, sin horario de verano).
export const CIERRE_FUNDADOR = new Date("2026-11-30T23:59:59-05:00");

export const CUPOS_TOTALES = 20;

// Los cupos restantes se editan desde /admin (pestaña "Builders Lab") y se
// guardan en Firestore, en este documento. En 0 se cierra el precio de
// lanzamiento y la página pasa a lista de espera.
export const BUILDERS_LAB_DOC_PATH = "config/buildersLab";
// Respaldo si Firestore falla o el documento aún no existe.
export const CUPOS_RESTANTES_RESPALDO = 18;

// Devuelve el número si es un entero válido (0 a CUPOS_TOTALES), si no null.
export const normalizarCupos = (valor: unknown): number | null =>
  typeof valor === "number" &&
  Number.isInteger(valor) &&
  valor >= 0 &&
  valor <= CUPOS_TOTALES
    ? valor
    : null;

export const WHATSAPP_NUMERO = "51964225808";

export const waLink = (mensaje: string) =>
  `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

export type Plan = {
  id: "anual" | "semestral" | "mensual";
  nombre: string;
  precio: string;
  periodo?: string;
  precioRegular?: string;
  equivalente?: string;
  nota: string;
  destacado?: boolean;
  mensaje: string;
};

// Orden de las tarjetas: la anual primero (en mobile queda arriba y en
// desktop se reubica al centro con `order`).
export const PLANES: Plan[] = [
  {
    id: "anual",
    nombre: "Anual",
    precio: "S/599",
    precioRegular: "S/948",
    equivalente: "≈ S/50 al mes",
    nota: "Precio congelado al renovar",
    destacado: true,
    mensaje:
      "Hola Angelo, quiero convertirme en builder con el plan ANUAL del Builders Lab (S/599).",
  },
  {
    id: "semestral",
    nombre: "Semestral",
    precio: "S/349",
    precioRegular: "S/474",
    equivalente: "≈ S/58 al mes",
    nota: "Precio congelado al renovar",
    mensaje:
      "Hola Angelo, quiero convertirme en builder con el plan SEMESTRAL del Builders Lab (S/349).",
  },
  {
    id: "mensual",
    nombre: "Mensual",
    precio: "S/79",
    periodo: "al mes",
    nota: "Cancela cuando quieras",
    mensaje:
      "Hola Angelo, quiero unirme al Builders Lab con el plan MENSUAL (S/79).",
  },
];

export const MENSAJE_LISTA_ESPERA =
  "Hola Angelo, quiero entrar a la lista de espera del Builders Lab.";

export const fundadorCerrado = (
  cuposRestantes: number,
  ahora: number = Date.now()
) => cuposRestantes <= 0 || ahora >= CIERRE_FUNDADOR.getTime();
