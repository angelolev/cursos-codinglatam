import { generatePageMetadata } from "@/utils/metadata";

// /pro is a client component (interactive pricing), so metadata lives in this
// server-side layout wrapper.
export const metadata = generatePageMetadata(
  "Hazte Pro",
  "Desbloquea todos los cursos, proyectos y mentorías con Coding Latam Pro.",
  "/pro"
);

export default function ProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
