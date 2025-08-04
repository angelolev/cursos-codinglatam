"use client";
import React from "react";
import Link from "next/link";
import { ExternalLink, Lock, Crown } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

interface FigmaLinkSectionProps {
  figmaLink: string;
  isPremium: boolean;
}

export default function FigmaLinkSection({
  figmaLink,
  isPremium,
}: FigmaLinkSectionProps) {
  const { convertAndFormatPrice } = useCurrency();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
        <svg
          className="h-6 w-6 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" fill="#1abcfe" />
          <path d="M4 20a4 4 0 0 1 4-4h4v4a4 4 0 0 1-8 0Z" fill="#0acf83" />
          <path d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z" fill="#ff7262" />
          <path d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z" fill="#f24e1e" />
          <path d="M12 4a4 4 0 0 1 4-4 4 4 0 0 1 0 8h-4V4Z" fill="#a259ff" />
        </svg>
        Archivos de Figma
      </h2>

      {isPremium ? (
        <>
          <p className="text-gray-600 mb-4">
            Accede a los archivos de diseño de Figma para ver los componentes,
            estilos y especificaciones completas del proyecto.
          </p>
          <Link
            href={figmaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Ver en Figma
            <ExternalLink className="h-4 w-4 ml-2" />
          </Link>
        </>
      ) : (
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Left side - Content info */}
          <div className="text-center lg:text-left py-8 lg:py-0">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 lg:mb-6">
              <Lock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Contenido Premium
            </h3>
            <p className="text-gray-600 mb-6 lg:mb-0">
              Los archivos de Figma están disponibles solo para usuarios
              premium. Accede a recursos de diseño completos y especificaciones
              detalladas.
            </p>
          </div>

          {/* Right side - Pricing card */}
          <div className="lg:max-w-sm lg:mx-auto xl:max-w-md">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-lg p-6 text-white">
              <div className="flex items-center justify-center mb-3">
                <Crown className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="font-semibold">Hazte Premium</span>
              </div>
              <p className="mb-4 text-center">
                Accede a todos los recursos y contenido exclusivo desde
              </p>
              <div className="text-2xl font-bold mb-4 text-center">
                {convertAndFormatPrice(1.99)}
                <span className="text-sm text-indigo-200">/semana</span>
              </div>
              <Link
                href="/pro"
                className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-block text-center"
              >
                Actualizar a Premium
              </Link>
              <p className="text-indigo-200 text-sm mt-3 text-center">
                Cancela en cualquier momento
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
