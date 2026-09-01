import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Claude Code para no programadores — Taller en vivo",
    "Tu propio asistente ejecutivo con IA, corriendo en tu computadora. 1 sesión en vivo de 2 horas: del Excel al dashboard, conectores con Canva y Gmail, y tu primera Skill. Sin terminal, sin código, sin experiencia previa. Sábado 5 de setiembre, 9:00 a 11:00 AM. Grabación con acceso de por vida.",
    "/claude-no-programadores",
    "https://codinglatam.dev/claude-og.png"
  ),
  keywords: [
    "Claude Code para no programadores",
    "Claude Desktop",
    "Cowork",
    "automatización con IA",
    "taller IA sin código",
    "productividad con IA",
    "conectores Gmail Drive Canva",
    "Skills de Claude",
    "Coding Latam",
  ],
  alternates: {
    canonical: "https://codinglatam.dev/claude-no-programadores",
  },
};

export default function ClaudeNoProgramadoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
