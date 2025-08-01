import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/utils/common";
import { Book } from "lucide-react";
import Image from "next/image";
import { AddReview } from "@/components/AddReview";
import { Reviews } from "@/components/Reviews";
import ValidAccessButton from "@/components/buttons/ValidAccessButton";
import BackButton from "@/components/buttons/BackButton";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    return querySnapshot.docs.map((doc) => ({
      slug: doc.data().slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-8 mb-8 relative">
              <Image
                src={product.image}
                width={500}
                height={500}
                alt={product.title}
                className="w-full md:w-64 h-80 object-cover rounded-xl shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  {product.title}
                </h1>
                <p className="text-base md:text-xl text-white/90 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center text-white/90 mb-2">
                  <Book className="h-5 w-5 mr-2" />
                  <span>{product.pages} páginas</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sobre el autor
              </h2>
              <p className="text-gray-600 mb-6">
                ¡Hola! Mi nombre es Angelo Leva. Soy ingeniero de software con
                más de 9 años de experiencia en el mundo tech. He pasado por
                consultoras, startups y empresas tradicionales, acumulando un
                montón de aprendizajes en el camino.
              </p>
              <p className="text-gray-600">
                Ahora quiero compartir todo eso contigo para ayudarte a mejorar
                tus habilidades y conseguir ese trabajo que siempre has soñado.
                🚀 ¿Listo para dar el siguiente paso en tu carrera? 💼✨
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-3xl font-bold text-gray-900 mb-6">
                {product.title}
              </div>
              <div className="space-y-4 mb-6">
                <div className="">
                  <h3 className="text-black/60 font-semibold mb-2">
                    Formatos disponibles:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.format.map((format) => (
                      <span
                        key={format}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <ValidAccessButton
                  href={product.href}
                  label="Descargar"
                  isFree={product.isFree}
                />
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                Descarga digital inmediata
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 pb-24">
            <AddReview reviewId={product.id} />
            <Reviews reviewId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
