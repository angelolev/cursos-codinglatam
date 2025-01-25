import { AddComment } from "@/components/AddComment";
import { Comments } from "@/components/Comments";
import LikeMaterial from "@/components/LikeMaterial";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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

export async function generateStaticParams() {
  const videos = await fetch(
    `${process.env.NEXT_PUBLIC_BUNNYNET_API_URL}/${process.env.NEXT_PUBLIC_BUNNYNET_LIBRARY_ID}/videos`,
    {
      headers: {
        AccessKey: process.env.NEXT_PUBLIC_BUNNYNET_ACCESS_KEY || "",
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  return videos?.items?.map((video: IVideo) => ({
    guid: video.guid,
  }));
}

export default async function Page({ params }: { params: Params }) {
  const { guid, slug } = await params;

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BUNNYNET_API_URL}/${process.env.NEXT_PUBLIC_BUNNYNET_LIBRARY_ID}/videos/${guid}`,
    {
      headers: {
        AccessKey: process.env.NEXT_PUBLIC_BUNNYNET_ACCESS_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  const video = await data.json();

  return (
    <div className="flex flex-col lg:flex-row gap-6">
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

          {video.metaTags.map((item: IMetatag) => (
            <p className="text-base text-white/90" key={item.value}>
              {item.value}
            </p>
          ))}
          <div className="mt-6">
            <Link
              href={`/workshops/${slug}`}
              className="inline-flex items-center text-indigo-400 font-bold hover:text-indigo-500 mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Link>
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
    </div>
  );
}
