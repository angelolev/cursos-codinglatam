import React from "react";
import { Code2, Clock, Wrench } from "lucide-react";
import Link from "next/link";
import { ProjectProps } from "@/types/project";
import Image from "next/image";

export default function ProjectCard({
  title,
  description,
  image,
  duration,
  difficulty,
  stack,
  slug,
}: ProjectProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      <div className="h-48 w-full overflow-hidden relative">
        <Image
          className="w-full h-full object-cover"
          src={image}
          alt={title}
          width={300}
          height={200}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex gap-2">
            {stack.map((item) => (
              <span
                key={item}
                className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6">
        <Link href={`/proyectos/${slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 flex items-center">
            <Code2 className="h-5 w-5 mr-2 text-indigo-600" />
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <Wrench className="h-4 w-4 mr-1" />
            <span>{difficulty}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
