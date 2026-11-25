// Textos compartidos por las dos versiones de la landing (/builders-lab y
// /builders-lab/v2). Cambiar aquí cambia ambas.
import { CUPOS_TOTALES } from "./config";

export const SUBTITULO = [
  "Deja de ver tutoriales.",
  "Empieza a construir con IA.",
] as const;

export const QUIEN_SOY =
  "Todos los días pruebo herramientas de IA y construyo con ellas, porque la única manera de aprender es haciendo, no viendo curso tras curso. Como Claude Certified Associate, quiero compartir todo eso con un grupo pequeño de builders.";

export const INCLUYE = [
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

export const FAQ = [
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

export const MEDIOS_DE_PAGO =
  "Te respondo por WhatsApp con los medios de pago (Yape, Plin, transferencia o PayPal).";

export const TEXTO_CERRADO =
  "Los precios de lanzamiento ya no están disponibles. Déjame tu nombre en la lista de espera y te escribo cuando se abra un cupo.";
