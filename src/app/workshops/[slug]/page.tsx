import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { notFound } from "next/navigation";
import { getWorkshopByslug } from "@/utils/common";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import ActionButton from "@/components/DownloadButton";

type Params = Promise<{ slug: string }>;

const workshopsCollections = {
  workshops: {
    collectionId: "c2b0aa49-83d5-4d5d-8b20-cebb641e0c93",
  },
};

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const workshop = await getWorkshopByslug(slug);

  if (!workshop) {
    return {
      title: "Curso no encontrado",
      description: "El curso que buscas no existe",
    };
  }

  return {
    title: `${workshop.title} | Talleres para mejorar tus skills`,
    description: workshop.description,
    openGraph: {
      title: workshop.title,
      description: workshop.description,
      images: [workshop.image],
    },
  };
}

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

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BUNNYNET_API_URL}/${process.env.NEXT_PUBLIC_BUNNYNET_LIBRARY_ID}/videos`,
    {
      headers: {
        AccessKey: process.env.NEXT_PUBLIC_BUNNYNET_ACCESS_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );
  const { items } = await data.json();

  const filteredVideo = items?.filter(
    (item: { collectionId: string }) =>
      item.collectionId === workshopsCollections.workshops.collectionId
  );

  return (
    <div className="px-4 sm:px-0">
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
                {/* <Link
                  href={`/workshops/${slug}/videos/${filteredVideo[0].guid}`}
                  className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
                >
                  <Video className="h-5 w-5 mr-2" />
                  Ver ahora
                </Link> */}
                <ActionButton
                  href={`/workshops/${slug}/videos/${filteredVideo[0].guid}`}
                  label="Ver ahora"
                />
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                Disponible mientras tu suscripción esté activa.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
