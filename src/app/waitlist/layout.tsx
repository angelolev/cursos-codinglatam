import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

export const metadata: Metadata = generatePageMetadata(
  "Certificación AI Engineer - Cohorte 1",
  "Únete a la Cohorte 1 de AI Engineer. Domina herramientas profesionales de IA en 6 semanas. 40% OFF para los primeros 15 inscritos. Inicia Febrero 2026.",
  "/waitlist"
);

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
