import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Claude Code para no programadores — Curso en vivo, 4 sesiones",
    "Tu propio asistente ejecutivo con IA, corriendo en tu computadora. 4 sesiones en vivo de 90 minutos, martes y jueves durante dos semanas: tu página web, una pieza gráfica con Canva, tus herramientas conectadas y tu primera Skill. Sin terminal, sin código, sin experiencia previa. Inicia el martes 22 de setiembre, 8:00 PM hora Perú. Grabaciones con acceso de por vida.",
    "/claude-no-programadores-curso",
    "https://codinglatam.dev/claude-og.png"
  ),
  keywords: [
    "Claude Code para no programadores",
    "curso Claude Code sin código",
    "Claude Desktop",
    "Cowork",
    "automatización con IA",
    "crear página web sin programar",
    "conectores Gmail Drive Canva",
    "Skills de Claude",
    "Coding Latam",
  ],
  alternates: {
    canonical: "https://codinglatam.dev/claude-no-programadores-curso",
  },
};

export default function ClaudeNoProgramadoresCursoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
