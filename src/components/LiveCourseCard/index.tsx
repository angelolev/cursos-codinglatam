"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, FileText, Play } from "lucide-react";
import { LiveCourseProps } from "@/types/course";
import Image from "next/image";
import Link from "next/link";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function useCountdown(targetDate: string): CountdownResult {
  const calculateTimeLeft = (): CountdownResult => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownResult>(
    calculateTimeLeft()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return timeLeft;
}

export function LiveCourseCard({
  title,
  description,
  available,
  buyLink,
  days,
  demo,
  discountPrice,
  price,
  schedule,
  startDate,
  image,
  instructor,
  temario,
  slug,
}: LiveCourseProps) {
  const countdown = useCountdown(startDate);
  const startDateFormatted = new Date(startDate).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg ${
        !available ? "opacity-75" : ""
      }`}
    >
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className="w-full h-48 object-cover"
        />
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-red-400 text-white px-4 py-2 rounded-full font-medium">
              Pronto
            </span>
          </div>
        )}
        {available && (
          <div className="absolute top-4 right-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Vacantes disponibles
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <Link href={`/en-vivo/${slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        </Link>

        <p className="text-gray-600 mb-4">{description}</p>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {days} • {schedule}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock className="h-4 w-4 mr-1" />
          <span>Inicio {startDateFormatted}</span>
        </div>

        {/* Countdown Timer */}
        <div className="bg-indigo-50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-indigo-800 mb-2">
            Las inscripciones cierran en:
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-white rounded-md p-2">
              <div className="text-xl font-bold text-indigo-600">
                {countdown.days}
              </div>
              <div className="text-xs text-gray-500">Días</div>
            </div>
            <div className="bg-white rounded-md p-2">
              <div className="text-xl font-bold text-indigo-600">
                {countdown.hours}
              </div>
              <div className="text-xs text-gray-500">Horas</div>
            </div>
            <div className="bg-white rounded-md p-2">
              <div className="text-xl font-bold text-indigo-600">
                {countdown.minutes}
              </div>
              <div className="text-xs text-gray-500">Mins</div>
            </div>
            <div className="bg-white rounded-md p-2">
              <div className="text-xl font-bold text-indigo-600">
                {countdown.seconds}
              </div>
              <div className="text-xs text-gray-500">Segs</div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${discountPrice}
            </span>
            {price > discountPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${price}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-600">Por {instructor}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <a
            href={buyLink}
            className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              available
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {available ? "Inscríbete ahora" : "Notifícame"}
          </a>
          {available ? (
            <div className="flex gap-2 flex-wrap">
              <a
                href={demo}
                className="flex w-full justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="h-4 w-4 mr-2" />
                Opiniones de alumnos
              </a>
              <a
                href={temario}
                className="flex w-full justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4 mr-2" />
                Temario
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
