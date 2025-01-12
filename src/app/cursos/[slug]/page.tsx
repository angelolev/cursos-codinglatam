// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { notFound } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { ArrowLeft, Clock, BookOpen, Award } from "lucide-react";
import { db } from "@/utils/firebase";
import Image from "next/image";
import Link from "next/link";
import { CourseReviews } from "@/components/CourseReviews";
import { AddCourseReview } from "@/components/AddCourseReview";
import { getCourseBySlug, orderVideosByTitle } from "@/utils/common";
import { VideoProps } from "@/types/video";
import RegisterButton from "@/components/RegisterButton";

type Params = Promise<{ slug: string }>;

const courseCollections = {
  react: {
    collectionId: "ec89bb8c-a703-444c-8f00-70a6f138dfe7",
  },
  javascript: {
    collectionId: "50efd55f-c061-4c22-a2ee-032ad92b2f6c",
  },
  web: {
    collectionId: "80e121f4-0083-444c-bb22-10b89383114d",
  },
};

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

  const filteredClases = items?.filter(
    (item) => item.collectionId === courseCollections[slug].collectionId
  );

  const clases =
    filteredClases.length > 0 ? orderVideosByTitle(filteredClases) : null;

  return (
    <div className="container max-w-7xl mx-auto px-0 pt-0 pb-8">
      <div className="pt-0">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-white/90 hover:text-white mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a los cursos
          </Link>

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
              <h1 className="text-4xl font-bold text-white/90 mb-4">
                {course.title}
              </h1>
              <p className="text-xl text-white/80 mb-8">{course.description}</p>

              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Clases
                </h2>
                <ul className="space-y-4">
                  {clases &&
                    clases?.map((item: VideoProps) => (
                      <Link
                        key={item.guid}
                        href={`/cursos/${course.slug}/clases/${item.guid}`}
                        className="flex items-center"
                      >
                        <BookOpen className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  {!clases &&
                    course?.topics?.map((item) => (
                      <div className="flex items-center" key={item}>
                        <BookOpen className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                        <p className="text-black/70">{item}</p>
                      </div>
                    ))}
                </ul>
              </div>
              <AddCourseReview courseId={course.id} />
              <CourseReviews courseId={course.id} />
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <div className="text-3xl font-bold text-gray-900 mb-6">
                  {/* ${course.price} */}
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
                  {clases ? (
                    <Link
                      href={`/cursos/${course.slug}/clases/${clases[0].guid}`}
                      className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors inline-block text-center"
                    >
                      Empezar curso
                    </Link>
                  ) : (
                    <RegisterButton />
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
