import { AddComment } from "@/components/AddComment";
import BackButton from "@/components/buttons/BackButton";
import { Comments } from "@/components/Comments";
import ContentAccessGuard from "@/components/ContentAccessGuard";
import LikeMaterial from "@/components/LikeMaterial";
import { getWorkshopByslug } from "@/utils/common";
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
      const callbackUrl = `/workshops/${slug}/videos/${guid}`;
      redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    // Fetch workshop data to get isFree property
    const workshop = await getWorkshopByslug(slug);

    if (!workshop) {
      throw new Error(`Workshop not found: ${slug}`);
    }

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
      throw new Error(`Failed to fetch video: ${data.status} ${data.statusText}`);
    }

    const video = await data.json();

  return (
    <ContentAccessGuard
      isFree={workshop.isFree}
      contentType="workshop"
      contentTitle={video.title}
      contentSlug={slug}
    >
      <main className="pt-20 mx-auto max-w-7xl sm:px-6 px-4 flex flex-col lg:flex-row gap-6 lg:px-0 flex-grow">
        <div className="w-full">
          <div className="w-full relative mb-8 overflow-hidden bg-gray-800 rounded aspect-video">
            <iframe
              src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNYNET_LIBRARY_ID}/${guid}?autoplay=false&loop=false&muted=false&preload=false&responsive=true`}
              loading="lazy"
              style={{
                border: 0,
                position: "absolute",
                top: 0,
                height: "100%",
                width: "100%",
              }}
              allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
              allowFullScreen
            ></iframe>
          </div>
          <div className="class-information">
            <div className="w-full flex-wrap gap-6 flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-primary-300 max-w-xl">
                {video.title}
              </h1>

              <LikeMaterial guid={guid} label="¿Te gustó este workshop?" />
            </div>

            {video.metaTags?.map((item: IMetatag) => (
              <p className="text-base text-white/90" key={item.value}>
                {item.value}
              </p>
            ))}
            <div className="mt-6">
              <BackButton href={`/workshops/${slug}`} />
            </div>
          </div>
        </div>
        <div className="w-full lg:max-w-[350px]">
          <div className="max-h-96">
            <h2 className="text-2xl mb-4 font-bold text-white/90">
              Comentarios del workshop
            </h2>
            <AddComment commentId={guid} />
            <ul>
              <Comments commentId={guid} />
            </ul>
          </div>
        </div>
      </main>
    </ContentAccessGuard>
    );
  } catch (error) {
    // Re-throw to trigger Next.js error page
    throw error;
  }
}
