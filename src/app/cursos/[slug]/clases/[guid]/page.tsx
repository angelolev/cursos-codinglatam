import { AddComment } from "@/components/AddComment";
import BackButton from "@/components/buttons/BackButton";
import { Comments } from "@/components/Comments";
import FreemiumGuard from "@/components/FreemiumGuard";
import LikeMaterial from "@/components/LikeMaterial";
import Resources from "@/components/Resources";
import VideoPlayerWithProgress from "@/components/VideoPlayerWithProgress";
import { getVideosFromCollection, orderVideosByTitle } from "@/utils/common";
import { getLessonIndex } from "@/utils/freemium";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/app/auth";

// Force dynamic rendering for auth checks and redirects
export const dynamic = 'force-dynamic';

type Params = Promise<{ guid: string; slug: string }>;

interface IVideo {
  guid: string;
  title: string;
  description: string;
  buyLink: string;
  available: boolean;
  slug: string;
}

interface IMetatag {
  property: string;
  value: string;
}

export default async function Page({ params }: { params: Params }) {
  try {
    const { guid, slug } = await params;

    // Check authentication server-side before fetching data
    const session = await auth();
    if (!session) {
      const callbackUrl = `/cursos/${slug}/clases/${guid}`;
      redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    // Log environment check (will show in Vercel logs)
    console.log('Environment check:', {
      hasApiUrl: !!process.env.NEXT_PUBLIC_BUNNYNET_API_URL,
      hasLibraryId: !!process.env.NEXT_PUBLIC_BUNNYNET_LIBRARY_ID,
      hasAccessKey: !!process.env.NEXT_PUBLIC_BUNNYNET_ACCESS_KEY,
    });

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_BUNNYNET_API_URL}/${process.env.NEXT_PUBLIC_BUNNYNET_LIBRARY_ID}/videos/${guid}`,
      {
        headers: {
          AccessKey: process.env.NEXT_PUBLIC_BUNNYNET_ACCESS_KEY || "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!data.ok) {
      console.error('BunnyNet API error:', {
        status: data.status,
        statusText: data.statusText,
        guid,
      });
      throw new Error(`Failed to fetch video: ${data.status} ${data.statusText}`);
    }

    const video = await data.json();


    const allVideos = await getVideosFromCollection(slug);

    // Order videos by title to ensure consistent lesson ordering
    const orderedVideos = allVideos ? orderVideosByTitle(allVideos) : [];

    // Find the current video index in ordered list
    const currentIndex = getLessonIndex(orderedVideos, guid);

    // Determine the next video
    const nextVideo =
      orderedVideos &&
      currentIndex !== -1 &&
      currentIndex < orderedVideos.length - 1
        ? orderedVideos[currentIndex + 1]
        : null;

    return (
    <FreemiumGuard 
      lessonIndex={currentIndex}
      lessonTitle={video.title}
      courseSlug={slug}
      lessonGuid={guid}
    >
      <main className="pt-20 mx-auto max-w-7xl sm:px-6 px-4 flex flex-col lg:flex-row gap-6 lg:px-0 flex-grow">
        <div className="w-full">
          <VideoPlayerWithProgress 
            guid={guid}
            courseSlug={slug}
            videoDuration={video.length || video.duration || video.lengthSeconds || video.durationSeconds}
            libraryId={process.env.NEXT_PUBLIC_BUNNYNET_LIBRARY_ID || ""}
            totalCourseLessons={orderedVideos.length}
          />
          <div className="class-information">
            <div className="w-full flex-wrap gap-6 flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-primary-300">
                {video.title}
              </h1>
              <LikeMaterial
                color="fff"
                guid={guid}
                label="¿Te gustó esta clase?"
              />
            </div>

            {video.metaTags?.map((item: IMetatag) => (
              <p className="text-base text-white/90" key={item.value}>
                {item.value}
              </p>
            ))}
            <div className="mt-6 flex justify-between flex-wrap">
              <BackButton href={`/cursos/${slug}`} label="Volver al curso" />

              {nextVideo && (
                <Link
                  href={`/cursos/${slug}/clases/${nextVideo?.guid}`}
                  className="inline-flex items-center border bg-indigo-400 text-white font-semibold border-indigo-400 px-4 py-3 rounded-lg hover:text-white hover:bg-indigo-500 mb-8"
                >
                  {nextVideo?.title}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:max-w-[400px]">
          <div>
            <h2 className="text-2xl mb-4 font-bold text-white/90">
              Recursos de la clase
            </h2>
            <ul>
              <Resources classId={guid} />
            </ul>
          </div>
          <div className="mt-6 mb-20">
            <h2 className="text-2xl mb-4 font-bold text-white/90">
              Comentarios de la clase
            </h2>
            <AddComment commentId={guid} />
            <ul className="lg:max-h-96 overflow-y-auto">
              <Comments commentId={guid} />
            </ul>
          </div>
        </div>
      </main>
    </FreemiumGuard>
    );
  } catch (error) {
    console.error('Error in lesson page:', error);
    throw error; // Re-throw to trigger Next.js error page
  }
}
