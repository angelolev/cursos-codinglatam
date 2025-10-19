"use client";

import React from "react";
import { GitBranch, Clock, Award, Crown } from "lucide-react";
import Link from "next/link";
import { StarterRepoProps } from "@/types/starter-repo";
import Image from "next/image";

export default function StarterRepoCard({
  title,
  shortDescription,
  description,
  thumbnail,
  stack,
  difficulty,
  slug,
  isPremium,
  setupTime,
}: StarterRepoProps) {
  const difficultyColors = {
    Principiante: "bg-green-100 text-green-800",
    Intermedio: "bg-yellow-100 text-yellow-800",
    Avanzado: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg relative">
      {isPremium && (
        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
          <Crown className="h-3 w-3" />
          PREMIUM
        </div>
      )}

      <div className="h-48 w-full overflow-hidden relative">
        <Image
          className="w-full h-full object-cover"
          src={thumbnail}
          alt={title}
          width={400}
          height={200}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex gap-2 flex-wrap">
            {stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs"
              >
                {tech}
              </span>
            ))}
            {stack.length > 3 && (
              <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
                +{stack.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <Link href={`/repositorios/${slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600 flex items-center">
            <GitBranch className="h-5 w-5 mr-2 text-indigo-600" />
            {title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-4 text-sm">
          {shortDescription || description}
        </p>

        <div className="flex justify-between items-center text-sm">
          {setupTime && (
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{setupTime}</span>
            </div>
          )}

          <div className="flex items-center">
            <Award className="h-4 w-4 mr-1" />
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                difficultyColors[difficulty as keyof typeof difficultyColors]
              }`}
            >
              {difficulty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
