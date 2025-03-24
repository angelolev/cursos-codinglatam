"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, FileText, Play, ChevronDown } from "lucide-react";
import { LiveCourseProps } from "@/types/course";
import Image from "next/image";
import Link from "next/link";
import {
  CurrencyType,
  formatPrice,
  RATES,
} from "../live-courses/utils/format-price";
import { USFlag } from "../live-courses/components/USFlag";
import { PEFlag } from "../live-courses/components/PEFlag";
import { MXFlag } from "../live-courses/components/MXFlag";
import { CLFlag } from "../live-courses/components/CLFlag";
import { COFlag } from "../live-courses/components/COFlag";

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
  purchaseLink,
  days,
  discountPrice,
  price,
  schedule,
  startDate,
  image,
  instructor,
  temario,
  slug,
}: LiveCourseProps) {
  const [currency, setCurrency] = useState<CurrencyType>("USD");
  const [isOpen, setIsOpen] = useState(false);
  const countdown = useCountdown(startDate);

  // Helper function to get flag component
  const getFlagComponent = (curr: CurrencyType) => {
    switch (curr) {
      case "USD":
        return <USFlag />;
      case "PEN":
        return <PEFlag />;
      case "MXN":
        return <MXFlag />;
      case "CLP":
        return <CLFlag />;
      case "COP":
        return <COFlag />;
    }
  };

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

        {/* Price and Currency Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="mb-2">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center bg-gray-100 text-gray-800 border border-gray-200 rounded-lg px-2 py-1 text-sm"
              >
                {getFlagComponent(currency)}
                <span>{currency}</span>
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="absolute z-10 mt-1 w-28 bg-white rounded-lg shadow-lg overflow-hidden">
                  {(Object.keys(RATES) as CurrencyType[]).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => {
                        setCurrency(curr);
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      {getFlagComponent(curr)}
                      <span>{curr}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap flex-col">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(discountPrice, currency)}
              </span>
              {price > discountPrice && (
                <span className="text-lg text-gray-500 line-through ml-2">
                  {formatPrice(price, currency)}
                </span>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-600 hidden lg:inline">
            Por {instructor}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <a
            href={purchaseLink}
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
                href={`/en-vivo/${slug}`}
                className="flex w-full justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                rel="noopener noreferrer"
              >
                <Play className="h-4 w-4 mr-2" />
                Detalles del Curso
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
