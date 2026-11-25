import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";
import { MetaPixel } from "./MetaPixel";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Claude de 0 a 100 — Inicia el 12 de enero",
    "De nunca haber usado IA a tener tu propio sistema de trabajo con Claude: correos, documentos, datos, atención por WhatsApp, diseño, tareas automáticas, tu propia web y edición de video, sin saber programar. 8 clases en vivo, 16 horas de práctica guiada y 5 entregables propios. Del 12 de enero al 4 de febrero de 2027, martes y jueves de 8:00 a 10:00 PM hora Perú. Dictado por un miembro del Claude Partner Network.",
    "/claude-de-0-a-100",
    "https://codinglatam.dev/claude-de-0-a-100-og.jpg"
  ),
  keywords: [
    "Claude de 0 a 100",
    "curso Claude de 0 a 100",
    "curso de Claude",
    "Claude para no programadores",
    "Claude Design",
    "Claude Cowork",
    "Claude Code",
    "inteligencia artificial para el trabajo",
    "Anthropic",
    "Coding Latam",
    "Claude Partner Network",
  ],
  alternates: { canonical: "https://codinglatam.dev/claude-de-0-a-100" },
};

export default function ClaudeDe0a100Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MetaPixel />
      {children}
    </>
  );
}
