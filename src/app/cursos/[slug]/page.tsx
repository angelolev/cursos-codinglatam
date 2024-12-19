import { notFound } from "next/navigation";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/utils/firebase";
import jsLogo from "@/assets/jslogo.svg";
import Image from "next/image";
import Link from "next/link";

interface Course {
  id: string;
  guid: string;
  title: string;
  description: string;
  buyLink: string;
  available: boolean;
  slug: string;
}

type Params = Promise<{ slug: string }>;

async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    // Query to find course by slug
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef);

    const querySnapshot = await getDocs(q);

    // Find the course with matching slug
    const courseDoc = querySnapshot.docs.find(
      (doc) => doc.data().slug === slug
    );

    if (!courseDoc) return null;

    return {
      id: courseDoc.id,
      ...courseDoc.data(),
    } as Course;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found",
    };
  }

  return {
    title: `${course.title} | Nuestros Cursos`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
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

  const data = await fetch("https://video.bunnycdn.com/library/350908/videos", {
    headers: {
      AccessKey: process.env.BUNNYNET_ACCESS_KEY || "",
      "Content-Type": "application/json",
    },
  });
  const videos = await data.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p>{course.description}</p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Clases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.items.map((item: Course) => (
              <div className="video" key={item.guid}>
                <div className="thumbnail bg-slate-400 h-60 flex items-center justify-center rounded-md">
                  <Image src={jsLogo} width={100} height={100} alt="JS logo" />
                </div>
                <div className="title mt-2">
                  <Link href={`/clases/${item.guid}`}>{item.title}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
