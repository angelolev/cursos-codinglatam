import Link from "next/link";
import Image from "next/image";
import { getWorkshopByslug } from "@/utils/common";
import { WorkshopProps } from "@/types/workshop";
import { AverageRating } from "../AverageRating";

export default async function Workshop({
  image,
  title,
  slug,
  description,
  available,
  releaseDate,
}: WorkshopProps) {
  const workshop = await getWorkshopByslug(slug);
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg relative">
      <div className="absolute right-0 z-20">
        {!available ? (
          <span className=" bg-red-500 px-2 py-1 text-white">
            {releaseDate}
          </span>
        ) : null}
      </div>
      <div className="h-48 w-full overflow-hidden relative">
        <Image
          className="w-full h-full object-cover"
          src={image}
          alt={title}
          fill
        />
      </div>
      <div className="p-6">
        <Link href={`workshops/${slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        </Link>
        {workshop && <AverageRating reviewId={workshop.id} />}
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
    </div>
  );
}
