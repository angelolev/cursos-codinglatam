import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Certificación Claude Code Dev — Cohorte 3",
    "Domina Claude Code en 2 sábados intensivos: 6 horas en vivo, 100% prácticas. De cero a construir proyectos completos con agentes autónomos de IA. Certificación · Cohorte 3 · Julio 2026. Early Bird para los primeros 10.",
    "/claude"
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
