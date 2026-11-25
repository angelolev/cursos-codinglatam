import type { Metadata } from "next";

// Versión de comparación del rediseño (skill gemini-frontend-design).
// Oculta a buscadores: solo existe para comparar con /builders-lab.
export const metadata: Metadata = {
  title: "Builders Lab (v2)",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://codinglatam.dev/builders-lab" },
};

export default function BuildersLabV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
