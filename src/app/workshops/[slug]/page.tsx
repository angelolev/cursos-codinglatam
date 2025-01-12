import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { notFound } from "next/navigation";
import { getWorkshopByslug } from "@/utils/common";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const workshopsRef = collection(db, "workshops");
    const querySnapshot = await getDocs(workshopsRef);

    return querySnapshot.docs.map((doc) => ({
      slug: doc.data().slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function WorkshopPage({ params }: { params: Params }) {
  const { slug } = await params;
  const workshop = await getWorkshopByslug(slug);

  if (!workshop) {
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
                src={workshop.image}
                width={500}
                height={500}
                alt={workshop.title}
                className="w-full md:w-64 h-80 object-cover rounded-xl shadow-lg"
              />
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  {workshop.title}
                </h1>
                <p className="text-xl text-white/90 mb-4">
                  {workshop.description}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-3xl font-bold text-gray-900 mb-6">
                {workshop.title}
              </div>

              <div className="space-y-4">
                <Link
                  href="/"
                  target="_blank"
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Descargar
                </Link>
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
