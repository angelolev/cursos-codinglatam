import { notFound } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { Clock, BookOpen, Award } from "lucide-react";
import { db } from "@/utils/firebase";
import Image from "next/image";
import Link from "next/link";
import { Reviews } from "@/components/Reviews";
import { AddReview } from "@/components/AddReview";
import {
  formatTime,
  getCourseBySlug,
  getVideosFromCollection,
} from "@/utils/common";
import { VideoProps } from "@/types/video";
import ActionButton from "@/components/buttons/ActionButton";
import WatchButton from "@/components/buttons/WatchButton";
import { AverageRating } from "@/components/AverageRating";
import BackButton from "@/components/buttons/BackButton";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Curso no encontrado",
      description: "El curso que buscas no existe",
    };
  }

  return {
    title: `${course.title} | Nuestros Cursos`,
    description: course.shortDescription,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      images: [course.image],
    },
  };
}

export async function generateStaticParams() {
  try {
    const coursesRef = collection(db, "courses");
    const querySnapshot = await getDocs(coursesRef);

    return querySnapshot.docs.map((doc) => ({
      slug: doc.data().slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function CoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const clases = await getVideosFromCollection(slug);

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-0 pt-0 pb-8">
      <div className="pt-24">
        <div className="max-w-7xl mx-auto">
          <BackButton label="Volver a los cursos" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="relative h-32 md:h-64 w-full mb-8">
                <Image
                  src={course.image}
                  alt={course.title}
                  className="object-cover rounded-xl"
                  fill
                />
              </div>
              <div className="flex flex-col items-start sm:flex-row sm:items-center mb-4 gap-6">
                <h1 className="text-4xl font-bold text-white/90 ">
                  {course.title}
                </h1>

                {!course.available && (
                  <span className="bg-red-400 px-2 py-1 text-white/90">
                    {course.releaseDate}
                  </span>
                )}
              </div>
              <AverageRating reviewId={course.id} />
              <p className="text-xl text-white/80 mb-8">{course.description}</p>
              <div className="bg-white rounded-xl shadow-md p-6 mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Clases
                </h2>
                <ul className="space-y-4">
                  {clases &&
                    clases?.map((item: VideoProps) => (
                      <Link
                        key={item.guid}
                        href={`/cursos/${course.slug}/clases/${item.guid}`}
                        className="grid grid-cols-[20px_1fr_60px] md:grid-cols-[20px_minmax(550px,_1fr)_1fr] gap-2 items-center"
                      >
                        <BookOpen size={20} className="text-indigo-600" />
                        <span>{item.title}</span>
                        <span className="justify-self-end text-indigo-600 ">
                          {formatTime(item.length)}
                        </span>
                      </Link>
                    ))}
                  {!clases &&
                    course?.topics?.map((item) => (
                      <div
                        className="grid grid-cols-[20px_minmax(300px,_1fr)] gap-2 items-center"
                        key={item}
                      >
                        <BookOpen size={20} className="text-indigo-600" />
                        <p className="text-black/70">{item}</p>
                      </div>
                    ))}
                </ul>
              </div>
              {course.available && <AddReview reviewId={course.id} />}

              <Reviews reviewId={course.id} />

              <div className="mt-16">
                <h2 className="text-2xl font-bold text-white/90 mb-8">
                  Testimonios de los estudiantes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={course.testimonialVideo}
                        title="Student Testimonial 1"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">
                        Conoce la experiencia de otros desarrolladores
                      </h3>
                      <p className="text-gray-600 text-sm"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="text-3xl font-bold text-gray-900 mb-6">
                  {course.title}
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Award className="h-5 w-5 mr-2" />
                    <span>{course.level}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {clases && (
                    <ActionButton
                      href={`/cursos/${course.slug}/clases/${clases[0].guid}`}
                      label="Empezar curso"
                    />
                  )}

                  {!clases && (
                    <WatchButton
                      isAvailable={course.available}
                      clases={clases}
                    />
                  )}
                </div>
                <div className="mt-6 text-center text-sm text-gray-500">
                  Disponible mientras tu suscripción esté activa
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
