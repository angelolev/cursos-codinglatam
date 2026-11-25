import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

// La imagen OG la genera ./opengraph-image.tsx; por convención de Next.js
// reemplaza a la imagen por defecto que pone generatePageMetadata.
export const metadata: Metadata = {
  ...generatePageMetadata(
    "Builders Lab — Pase Fundador, solo 20 cupos",
    "Un grupo privado de máximo 20 personas para construir con IA junto a Angelo Leva, Claude Certified Associate. Lab Night mensual en vivo, aprendizaje de la semana, acceso anticipado a los videos y material premium de certificación. Pase Fundador por Black Friday hasta el lunes 30 de noviembre.",
    "/builders-lab"
  ),
  keywords: [
    "Builders Lab",
    "comunidad de IA",
    "construir con IA",
    "Claude",
    "certificación Claude",
    "Angelo Leva",
    "Coding Latam",
  ],
  alternates: { canonical: "https://codinglatam.dev/builders-lab" },
};

export default function BuildersLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
