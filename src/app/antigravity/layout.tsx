import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

export const metadata: Metadata = {
  ...generatePageMetadata(
    "Curso de Google Antigravity — Coding Latam",
    "Domina Google Antigravity, el IDE agéntico impulsado por Gemini 3. Programa práctico para construir software con agentes autónomos de IA. Únete a la waitlist y sé de los primeros en inscribirte.",
    "/antigravity"
  ),
  keywords: [
    "Google Antigravity",
    "curso Antigravity",
    "Antigravity IDE",
    "Gemini 3",
    "agentes de IA",
    "IDE agéntico",
    "prompt engineering",
    "Coding Latam",
    "curso programación con IA",
  ],
  alternates: { canonical: "https://codinglatam.dev/antigravity" },
};

export default function AntigravityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
