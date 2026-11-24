import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Certificación Codex Dev — Cohorte 1",
    "Domina Codex, el agente de programación de OpenAI, en 2 días intensivos: 6 horas en vivo, 100% prácticas. CLI, IDE, Codex Cloud, AGENTS.md, MCP y GitHub. Certificación · Cohorte 1 · Enero 2027. Early Bird para los primeros 10.",
    "/codex"
  ),
  keywords: [
    "Codex",
    "OpenAI Codex",
    "curso Codex",
    "certificación Codex",
    "Codex CLI",
    "AGENTS.md",
    "agentes de IA",
    "MCP servers",
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
