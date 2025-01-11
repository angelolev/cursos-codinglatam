/* eslint-disable @next/next/no-img-element */
import { CourseProps } from "@/types/course";
import Link from "next/link";
import React from "react";

export function CourseCard({
  title,
  shortDescription,
  image,
  level,
  duration,
  slug,
  available,
}: CourseProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg relative">
      <div className="absolute right-0">
        {!available ? (
          <span className=" bg-red-500 px-2 py-1 text-white">Febrero 2025</span>
        ) : null}
      </div>
      <div className="h-48 w-full overflow-hidden">
        <img className="w-full h-full object-cover" src={image} alt={title} />
      </div>
      <div className="p-6">
        <Link href={`cursos/${slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        </Link>
        <p className="text-gray-600 mb-4">{shortDescription}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            {level}
          </span>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
}
