import LikeIcon from "@/components/LikeIcon";

type Params = Promise<{ guid: string }>;

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
    "https://video.bunnycdn.com/library/350908/videos",
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
  const { guid } = await params;

  const data = await fetch(
    `https://video.bunnycdn.com/library/350908/videos/${guid}`,
    {
      headers: {
        AccessKey: process.env.NEXT_PUBLIC_BUNNYNET_ACCESS_KEY || "",
        "Content-Type": "application/json",
      },
    }
  );

  const video = await data.json();

  return (
    <div>
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        <iframe
          src={`https://iframe.mediadelivery.net/embed/350908/${guid}?autoplay=false&loop=false&muted=false&preload=false&responsive=true`}
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
      <div className="class-information p-4">
        <h1 className="text-2xl mb-4 font-bold">{video.title}</h1>
        {video.metaTags.map((item: IMetatag) => (
          <p className="text-base text-white/70" key={item.value}>
            {item.value}
          </p>
        ))}
        <div className="like max-w-fit max-h-fit">
          <LikeIcon classId={guid} />
        </div>
      </div>
    </div>
  );
}
