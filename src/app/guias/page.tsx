import Product from "@/components/ProductCard";
import { getProducts } from "@/utils/common";

export default async function Guias() {
  const products = await getProducts();

  return (
    <>
      <div className="text-center mt-12 mb-24">
        <h1 className="text-4xl font-bold text-white/90 mb-4">
          Guías de estudio para ti
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Material enfocado en ayudarte a optimizar todo lo necesario para la
          búsqueda laboral y mejora de skills
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products?.map((product, index) => (
          <Product key={index} {...product} />
        ))}
      </div>
    </>
  );
}
