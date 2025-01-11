import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourseProps } from "@/types/course";
type Params = Promise<{ slug: string }>;

export default async function Clases({ params }: { params: Params }) {
  const { slug } = await params;

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BUNNYNET_API_URL}/${process.env.NEXT_PUBLIC_BUNNYNET_LIBRARY_ID}/videos`,
    {
      headers: {
        AccessKey: process.env.NEXT_PUBLIC_BUNNYNET_ACCESS_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );
  const videos = await data.json();

  return (
    <div className="mt-6">
      <Link
        href={`/cursos/${slug}`}
        className="inline-flex items-center text-white/90 hover:text-white mb-8"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al curso
      </Link>
      <h2 className="text-xl font-semibold mb-6">Clases xd</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.items.map((item: CourseProps) => (
          <div className="video" key={item.guid}>
            <div className="thumbnail bg-slate-400 h-60 flex items-center justify-center rounded-md relative">
              <iframe
                src={`https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNYNET_LIBRARY_ID}/${item.guid}?autoplay=false&loop=false&muted=false&preload=false&responsive=true`}
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
            <div className="title mt-2">
              <Link
                href={`/cursos/${slug}/clases/${item.guid}`}
                className="text-white/70"
              >
                {item.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
