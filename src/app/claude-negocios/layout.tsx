import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Claude para Negocios — Curso en vivo",
    "Aprende a delegarle tu trabajo diario a la IA y a construir tus propios agentes conectados a tus herramientas. 8 sesiones en vivo, 16 horas, sin código y sin conocimientos técnicos previos. Del 13 de octubre al 5 de noviembre de 2026.",
    "/claude-negocios",
    "https://codinglatam.dev/claude-og.png"
  ),
  keywords: [
    "Claude para Negocios",
    "Claude IA para empresas",
    "curso de IA sin código",
    "productividad con IA",
    "agentes de IA para negocios",
    "automatización con Claude",
    "Coding Latam",
  ],
  alternates: { canonical: "https://codinglatam.dev/claude-negocios" },
};

export default function ClaudeNegociosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
