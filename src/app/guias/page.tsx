import GuiasClient from "@/components/GuiasClient";
import { getProducts } from "@/utils/common";
import { generatePageMetadata } from "@/utils/metadata";

export const dynamic = "force-static";

export function generateMetadata() {
  return generatePageMetadata(
    "Guías de Estudio",
    "Material enfocado en ayudarte a optimizar todo lo necesario para la búsqueda laboral y mejora de skills en desarrollo web.",
    "/guias"
  );
}

export default async function Guias() {
  const products = await getProducts();

  return (
    <main className="pt-32 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
      <div className="text-center my-12">
        <h1 className="text-4xl font-bold text-white/90 mb-4">
          Guías de estudio para ti
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Material enfocado en ayudarte a optimizar todo lo necesario para la
          búsqueda laboral y mejora de skills
        </p>
      </div>
      <GuiasClient products={products || []} />
    </main>
  );
}
