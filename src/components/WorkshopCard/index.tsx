import Link from "next/link";
import Image from "next/image";
import { Crown, Gift } from "lucide-react";
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
  isFree,
}: WorkshopProps) {
  const workshop = await getWorkshopByslug(slug);
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg relative">
      <Link href={`workshops/${slug}`}>
        <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
          {/* Availability Badge */}
          {!available ? (
            <span className="bg-red-500 px-2 py-1 text-white text-sm rounded">
              {releaseDate}
            </span>
          ) : null}

          {/* Free/Premium Badge */}
          {available && isFree && (
            <span className="bg-green-600 px-3 py-1 text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <Gift className="h-3 w-3" />
              Gratis
            </span>
          )}
          {available && !isFree && (
            <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Crown className="h-3 w-3" />
              PREMIUM
            </span>
          )}
        </div>

        <div className="h-48 w-full overflow-hidden relative">
          <Image
            className="w-full h-full object-cover"
            src={image}
            alt={title}
            width={420}
            height={193}
          />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

          {workshop && <AverageRating reviewId={workshop.id} />}
          <p className="text-gray-600 mb-4 text-sm">{description}</p>
        </div>
      </Link>
    </div>
  );
}
