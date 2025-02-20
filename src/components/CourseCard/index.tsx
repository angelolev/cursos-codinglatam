import { CourseProps } from "@/types/course";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AverageRating } from "../AverageRating";
import { getCourseBySlug } from "@/utils/common";

export async function CourseCard({
  title,
  shortDescription,
  image,
  level,
  duration,
  slug,
  available,
  releaseDate,
  hasAllClassesAvailable,
}: CourseProps) {
  const course = await getCourseBySlug(slug);

  const renderStatus = () => {
    if (available && hasAllClassesAvailable) {
      return (
        <span className=" bg-green-500 px-2 py-1 text-white">Disponible</span>
      );
    } else if (available && !hasAllClassesAvailable) {
      return (
        <span className=" bg-green-500 px-2 py-1 text-white">
          Primeras clases disponibles
        </span>
      );
    } else {
      return (
        <span className=" bg-red-500 px-2 py-1 text-white">{releaseDate}</span>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg relative">
      <Link href={`cursos/${slug}`}>
        <div className="absolute right-0 z-20">{renderStatus()}</div>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

          {course && <AverageRating reviewId={course.id} />}
          <p className="text-gray-600 mb-4">{shortDescription}</p>
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
