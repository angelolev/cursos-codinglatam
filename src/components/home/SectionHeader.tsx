import { Eyebrow } from "@/components/claude-brochure/primitives";

// Cabecera de sección de la landing de empresas: eyebrow + titular a la
// izquierda, bajada a la derecha desde lg. Antes cada sección resolvía esto por
// su cuenta y alternaba centrado y alineado a la izquierda sin criterio.
export default function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-end lg:gap-16">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 text-balance text-3xl font-bold text-white/90 md:text-4xl">
          {title}
        </h2>
      </div>
      <p className="text-lg text-white/60 lg:pb-1">{children}</p>
    </div>
  );
}
