import { CourseProps } from "@/types/course";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Crown } from "lucide-react";

export function ClientCourseCard({
  title,
  shortDescription,
  image,
  level,
  duration,
  slug,
  isPremium,
}: CourseProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg relative">
      {isPremium && (
        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
          <Crown className="h-3 w-3" />
          PREMIUM
        </div>
      )}
      <Link href={`cursos/${slug}`}>
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
          <p className="text-gray-600 mb-4 text-sm">{shortDescription}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              {level}
            </span>
            <span>{duration}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}