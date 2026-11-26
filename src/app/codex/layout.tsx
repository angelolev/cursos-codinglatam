import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Codex para programadores — Inicia el 12 de enero",
    "Domina Codex, el agente de programación de OpenAI, en la terminal, el editor, la app y la nube. 8 clases en vivo, 4 semanas, 16 horas 100% prácticas. Del 12 de enero al 4 de febrero de 2027, martes y jueves de 8:00 a 10:00 PM hora Perú.",
    "/codex"
  ),
  keywords: [
    "Codex",
    "OpenAI Codex",
    "curso Codex",
    "Codex CLI",
    "AGENTS.md",
    "agentes de IA",
    "MCP servers",
    "AI coding assistant",
    "Coding Latam",
    "curso programación con IA",
  ],
  alternates: { canonical: "https://codinglatam.dev/codex" },
};

export default function CodexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
