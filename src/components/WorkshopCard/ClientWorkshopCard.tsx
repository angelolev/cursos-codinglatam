import Link from "next/link";
import Image from "next/image";
import { Crown, Gift } from "lucide-react";
import { WorkshopProps } from "@/types/workshop";

export function ClientWorkshopCard({
  image,
  title,
  slug,
  description,
  available,
  releaseDate,
  isFree,
}: WorkshopProps) {
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
          {available && (
            <span
              className={`px-2 py-1 text-white text-base rounded flex items-center ${
                isFree ? "bg-green-600" : "bg-indigo-600"
              }`}
            >
              {isFree ? (
                <>
                  <Gift className="h-3 w-3 mr-1" />
                  Gratis
                </>
              ) : (
                <>
                  <Crown className="h-3 w-3 mr-1" />
                  Pro
                </>
              )}
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
          <p className="text-gray-600 mb-4 text-sm">{description}</p>
        </div>
      </Link>
    </div>
  );
}