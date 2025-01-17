import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { notFound } from "next/navigation";
import { getWorkshopByslug } from "@/utils/common";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { AddReview } from "@/components/AddReview";
import { Reviews } from "@/components/Reviews";
import ValidAccessButton from "@/components/ValidAccessButton";

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
          className="inline-flex items-center text-indigo-400 font-bold hover:text-indigo-500 mb-8"
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
                {!workshop.available && (
                  <p className="bg-red-400 px-2 py-1 w-fit">
                    {workshop.releaseDate}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sobre los Workshops
              </h2>
              <p className="text-gray-600 mb-6">
                En Coding Latam, creemos que ser un gran desarrollador va mucho
                más allá de escribir código. Por eso, nuestros workshops están
                diseñados para impulsarte en todos los aspectos que necesitas
                para triunfar en tu carrera.
              </p>
              <p className="text-gray-600 mb-6">
                💡 No solo abordamos temas técnicos, como dominar frameworks y
                herramientas, sino que también nos enfocamos en desarrollar
                habilidades blandas que son clave en la industria.
              </p>
              <p className="text-gray-600 mb-6">
                Hablamos de comunicación efectiva, asertividad, negociación
                salarial, cómo destacar en entrevistas de trabajo y estrategias
                para recibir promociones y crecer profesionalmente. Sabemos que
                el éxito no solo está en el teclado, sino también en cómo te
                presentas, conectas y comunicas tu valor.
              </p>
              <p className="text-gray-600 mb-6">
                Cada workshop es una oportunidad para aprender de expertos,
                compartir experiencias y llevar tu carrera al siguiente nivel.
                🚀 En Coding Latam no solo formamos programadores, formamos
                profesionales completos. ¿Estás listo para construir un futuro
                más brillante? 💼✨
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="text-3xl font-bold text-gray-900 mb-6">
                {workshop.title}
              </div>

              <div className="space-y-4">
                {!workshop.available && (
                  <p className="text-xl font-semibold text-primary-300 text-center">
                    Próximamente
                  </p>
                )}
                {workshop.available && (
                  <ValidAccessButton
                    href={`/workshops/${slug}/videos/${filteredVideo[0].guid}`}
                    label="Ver ahora"
                    isFree={workshop.isFree}
                  />
                )}
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                Disponible mientras tu suscripción esté activa.
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 pb-24">
            <AddReview reviewId={workshop.id} />
            <Reviews reviewId={workshop.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
