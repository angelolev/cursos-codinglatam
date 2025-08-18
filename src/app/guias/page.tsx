import GuiasClient from "@/components/GuiasClient";
import { getProducts } from "@/utils/common";

export const dynamic = "force-static";

export default async function Guias() {
  const products = await getProducts();

  return (
    <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
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
