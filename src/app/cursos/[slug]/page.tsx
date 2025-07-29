import { notFound } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { Clock, BookOpen, Award, Lock, Play } from "lucide-react";
import { db } from "@/utils/firebase";
import Image from "next/image";
import Link from "next/link";
import { Reviews } from "@/components/Reviews";
import { AddReview } from "@/components/AddReview";
import {
  formatTime,
  getCourseBySlug,
  getVideosFromCollection,
  orderVideosByTitle,
} from "@/utils/common";
import { VideoProps } from "@/types/video";
import ActionButton from "@/components/buttons/ActionButton";
import WatchButton from "@/components/buttons/WatchButton";
import { AverageRating } from "@/components/AverageRating";
import BackButton from "@/components/buttons/BackButton";
import { isLessonFree } from "@/utils/freemium";

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
  const orderedClases = clases ? orderVideosByTitle(clases) : null;

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
                  {orderedClases &&
                    orderedClases?.map((item: VideoProps, index: number) => {
                      const isFree = isLessonFree(index);
                      return (
                        <Link
                          key={item.guid}
                          href={`/cursos/${course.slug}/clases/${item.guid}`}
                          className={`grid grid-cols-[20px_1fr_60px_60px] md:grid-cols-[20px_minmax(450px,_1fr)_1fr_60px] gap-2 items-center p-3 rounded-lg transition-colors ${
                            isFree ? "hover:bg-green-50" : "hover:bg-amber-50"
                          }`}
                        >
                          {isFree ? (
                            <Play size={20} className="text-green-600" />
                          ) : (
                            <Lock size={20} className="text-amber-600" />
                          )}
                          <span
                            className={
                              isFree ? "text-gray-900" : "text-gray-600"
                            }
                          >
                            {item.title}
                          </span>
                          <span
                            className={`justify-self-end ${
                              isFree ? "text-green-600" : "text-amber-600"
                            }`}
                          >
                            {formatTime(item.length)}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full text-center ${
                              isFree
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isFree ? "Gratis" : "Pro"}
                          </span>
                        </Link>
                      );
                    })}
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
                  {orderedClases && (
                    <ActionButton
                      href={`/cursos/${course.slug}/clases/${orderedClases[0].guid}`}
                      label="Empezar curso"
                    />
                  )}

                  {!orderedClases && (
                    <WatchButton
                      isAvailable={course.available}
                      clases={orderedClases}
                    />
                  )}
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-amber-50 rounded-lg border border-gray-200">
                  <div className="text-center mb-3">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Acceso al Curso
                    </h4>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Play className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-green-700">
                        4 lecciones gratuitas
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 text-amber-600 mr-2" />
                      <span className="text-amber-700">Resto requiere Pro</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 text-center mt-3">
                    Solo necesitas estar registrado para acceder a las primeras
                    4 lecciones
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
