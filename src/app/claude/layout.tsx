import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Claude Code para programadores — Inicia el 20 de octubre",
    "Domina Claude Code, el agente de programación de Anthropic, y aprende a construir, revisar y desplegar software con agentes de IA. 8 clases en vivo, 4 semanas, 16 horas 100% prácticas. Del 20 de octubre al 12 de noviembre de 2026, martes y jueves de 8:00 a 10:00 PM hora Perú. Dictado por un miembro del Claude Partner Network.",
    "/claude",
    "https://codinglatam.dev/claude-og.png"
  ),
  keywords: [
    "Claude Code",
    "curso Claude Code",
    "certificación Claude Code",
    "AI coding assistant",
    "agentes de IA",
    "MCP servers",
    "Anthropic",
    "prompt engineering",
    "Coding Latam",
    "curso programación con IA",
    "Claude Partner Network",
  ],
  alternates: { canonical: "https://codinglatam.dev/claude" },
};

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
