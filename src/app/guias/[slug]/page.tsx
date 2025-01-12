import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/utils/common";
import Link from "next/link";
import { ArrowLeft, Book } from "lucide-react";
import Image from "next/image";
import DownloadButton from "@/components/DownloadButton";

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
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-white hover:text-white mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Link>

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
                <h1 className="text-4xl font-bold text-white mb-4">
                  {product.title}
                </h1>
                <p className="text-xl text-white/90 mb-4">
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
              <p className="text-gray-600">
                Soy Ingeniero de software con más de 9 años de experiencia. He
                trabajado en consultoras, startups y empresas de software
                tradicionales durante mi carrera. Puedo ayudarte a mejorar tus
                skills y conseguir ese trabajo que estás buscando.
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
                <DownloadButton href={product.href} />
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                Descarga digital inmediata
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
