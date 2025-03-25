"use client";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Star,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { LiveCourseProps } from "@/types/course";
import { useState } from "react";
import { USFlag } from "../USFlag";
import { PEFlag } from "../PEFlag";
import { MXFlag } from "../MXFlag";
import { CLFlag } from "../CLFlag";
import { COFlag } from "../COFlag";
import { formatPrice } from "../../utils/format-price";
import Image from "next/image";
import paypalImage from "@/assets/paypal.svg";
import visaImage from "@/assets/visa.svg";
import cardImage from "@/assets/card.svg";
import americanExpressImage from "@/assets/amex.svg";
import yapeImage from "@/assets/yape.svg";
import plinImage from "@/assets/plin.svg";
import yapeQR from "@/assets/yape-qr.png";

// Update the RATES object to include COP
const RATES = {
  USD: 1,
  PEN: 3.7,
  MXN: 16.75,
  CLP: 987,
  COP: 3950,
} as const;

type CurrencyType = keyof typeof RATES;

export function Pricing({ course }: { course: LiveCourseProps }) {
  const [currency, setCurrency] = useState<CurrencyType>("USD");
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="my-12 md:my-16">
      <h2 className="text-3xl font-bold text-white/90 mb-12">Inversión</h2>
      <div className="bg-transparent  md:bg-black/20 rounded-3xl overflow-hidden ">
        <div className="px-0 md:px-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-indigo-500 rounded-xl p-6 mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Detalles del curso
                </h3>
                <div className="space-y-4 text-white">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3" />
                    <span>
                      Inicia {new Date(course.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-3" />
                    <span>{course.days}</span>
                  </div>
                </div>
              </div>
              <div className="text-white">
                <div className="mb-4 relative">
                  <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="cursor-pointer flex items-center bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1"
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
                    <div className="absolute z-10 top-full left-0 mt-1 w-28 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
                      {(Object.keys(RATES) as CurrencyType[]).map((curr) => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => {
                            setCurrency(curr);
                            setIsOpen(false);
                          }}
                          className="flex items-center w-full px-3 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer"
                        >
                          {getFlagComponent(curr)}
                          <span>{curr}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-5xl font-bold mb-2 flex flex-wrap flex-col md:flex-row">
                  {formatPrice(course.discountPrice, currency)}
                  {course.price > course.discountPrice && (
                    <span className="text-2xl line-through md:ml-3 mt-4 md:mt-0 text-white/70">
                      {formatPrice(course.price, currency)}
                    </span>
                  )}
                </div>
                <p className="text-white/80 mb-8">
                  Un solo pago, acceso permanente
                </p>
                <div className="space-y-4">
                  <a
                    href={course.purchaseLink}
                    className="block w-full bg-primary-400 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-primary-500 transition-colors"
                    rel="noopener noreferrer"
                  >
                    Inscribirme ahora
                  </a>
                  <a
                    href={course.buyLink}
                    className="flex items-center justify-center w-full border-2 border-white text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    ¿Tienes dudas? Habla con nosotros
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-indigo-500 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">
                  Qué incluye
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center text-white">
                    <CheckCircle2 className="h-5 w-5 mr-3" />
                    Clases interactivas EN VIVO
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle2 className="h-5 w-5 mr-3" />
                    Código fuente del proyecto
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle2 className="h-5 w-5 mr-3" />
                    Acceso privado al grupo de Whatsapp
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle2 className="h-5 w-5 mr-3" />
                    Grabaciones de sesiones
                  </li>
                  <li className="flex items-center text-white">
                    <CheckCircle2 className="h-5 w-5 mr-3" />
                    Certificado de finalización
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-bold text-black/90 mb-2">
                    Paga con
                  </h3>
                  <div className="flex items-center gap-0 flex-wrap">
                    <Image src={visaImage} alt="Visa" width={50} height={50} />
                    <Image src={cardImage} alt="Card" width={60} height={60} />
                    <Image
                      src={paypalImage}
                      alt="Paypal"
                      width={50}
                      height={50}
                    />
                    <Image
                      src={americanExpressImage}
                      alt="American Express"
                      width={50}
                      height={50}
                    />
                  </div>
                  <p className="text-black/90 text-base font-bold mt-4">
                    Otras opciones (válidas para Perú):
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Image src={yapeImage} alt="Card" width={50} height={50} />
                    <Image src={plinImage} alt="Visa" width={50} height={50} />
                  </div>
                  <p className="text-black/90 text-sm mt-4">
                    Envia tu voucher al <b>+51 964225808</b> para completar tu
                    registro
                  </p>
                </div>
                <div className="flex justify-center items-center flex-wrap gap-4">
                  <div className="relative w-full h-80 md:h-full">
                    <Image
                      src={yapeQR}
                      alt="Yape QR"
                      fill
                      sizes="100vh"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
