"use client";
import { Check, Crown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Session } from "next-auth";

type BillingFrequency = "weekly" | "monthly" | "yearly";

interface PricingOption {
  price: number;
  label: string;
  savings?: string;
}

interface PricingPlan {
  name: string;
  pricing: Record<BillingFrequency, PricingOption>;
  description: string;
  href: string;
  features: string[];
  popular?: boolean;
}

interface PricingServerSideProps {
  userSession: Session | null;
}

export default function PricingServerSide({
  userSession,
}: PricingServerSideProps) {
  const { convertAndFormatPrice, currentCurrency, isLoading } = useCurrency();
  const [billingFrequency, setBillingFrequency] =
    useState<BillingFrequency>("monthly");

  const pricingPlans: PricingPlan[] = [
    {
      name: "Gratis",
      pricing: {
        weekly: { price: 0, label: "/semana" },
        monthly: { price: 0, label: "/mes" },
        yearly: { price: 0, label: "/año" },
      },
      description: "Descubre las bases y potencia tu carrera",
      href: "/login",
      features: [
        "Acceso a cursos gratis",
        "Acceso a proyectos",
        "Descarga Guías para Aprender en Minutos",
        "Acceso al Discord de la comunidad",
      ],
    },
    {
      name: "Pro",
      pricing: {
        weekly: { price: 1.99, label: "/semana", savings: "Prueba 7 días" },
        monthly: { price: 5.99, label: "/mes" },
        yearly: { price: 59.99, label: "/año", savings: "Ahorra $11.89" },
      },
      description: "Se un desarrollador que domina las AI tools",
      href: userSession?.user
        ? "https://cursoscodinglatam.lemonsqueezy.com/checkout/buy/c36b9bc2-a598-4b21-9442-924f771c8e8b"
        : "/login",
      features: [
        "Todos los beneficios de la versión gratuita",
        "Acceso a todos los cursos",
        "Mentorías grupales",
        "Acceso al canal de Discord privado de suscriptores",
        "Figma de proyectos",
        "Descuento en programas de certificación",
        "Soporte prioritario",
      ],
      popular: true,
    },
    {
      name: "Elite",
      pricing: {
        weekly: { price: 12.99, label: "/semana" },
        monthly: { price: 39.99, label: "/mes" },
        yearly: { price: 399.99, label: "/año", savings: "Ahorra $79.89" },
      },
      description: "Máximo nivel: dominio completo de IA",
      href: "https://wa.link/dnyqus",
      features: [
        "Todos los beneficios de Free y Pro",
        "Sesiones de Pair Programming con IA",
        "Sesiones 1-on-1 con mentores expertos",
        "Certificados de finalización para tu LinkedIn",
        "Revisión de proyectos personales",
        "Acceso a comunidad Elite de networking",
      ],
    },
  ];

  return (
    <div className="my-12 md:my-20 md:px-4">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-3">
          Invierte en tu futuro con IA
        </h2>
        <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto px-4">
          Domina las herramientas de IA y diferénciate en el mercado laboral.
          Elige el plan que mejor se adapte a tus objetivos
        </p>

        {/* Billing Frequency Toggle */}
        <div className="mt-8 inline-flex bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20 max-w-full overflow-x-auto">
          {(["weekly", "monthly", "yearly"] as BillingFrequency[]).map(
            (frequency) => (
              <button
                key={frequency}
                onClick={() => setBillingFrequency(frequency)}
                className={`px-3 md:px-6 py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  billingFrequency === frequency
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-white/70 hover:text-white/90"
                }`}
              >
                {frequency === "weekly" && "Semanal"}
                {frequency === "monthly" && "Mensual"}
                {frequency === "yearly" && "Anual"}
                {frequency === "yearly" && (
                  <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                    Ahorra
                  </span>
                )}
              </button>
            )
          )}
        </div>

        {/* Currency Indicator */}
        {!isLoading && currentCurrency.code !== "USD" && (
          <div className="mt-4 text-sm text-white/60 flex items-center justify-center gap-2">
            <span>{currentCurrency.flag}</span>
            <span>Precios mostrados en {currentCurrency.name}</span>
            <span className="text-xs text-white/40">
              • Pago procesado en USD
            </span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer border ${
              plan.popular
                ? "border-blue-500/50 ring-2 ring-blue-500/30 md:scale-105"
                : "border-gray-600/30 hover:border-blue-500/30"
            }`}
          >
            {plan.popular && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 text-sm font-medium">
                Más Popular
              </div>
            )}
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                  {plan.name === "Pro" && (
                    <Crown className="h-5 w-5 text-blue-400" />
                  )}
                  {plan.name}
                </h3>
                {plan.pricing[billingFrequency].savings && (
                  <span className="bg-green-500/20 text-green-300 text-xs font-medium px-2 py-1 rounded-full border border-green-500/30">
                    {plan.pricing[billingFrequency].savings}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-baseline">
                <span className="text-xl md:text-3xl font-bold text-white">
                  {isLoading ? (
                    <span className="animate-pulse">$...</span>
                  ) : plan.name === "Gratis" ? (
                    `${currentCurrency.symbol}${plan.pricing[billingFrequency].price}`
                  ) : (
                    convertAndFormatPrice(plan.pricing[billingFrequency].price)
                  )}
                </span>
                <span className="text-gray-300 ml-1">
                  {plan.pricing[billingFrequency].label}
                </span>
              </div>
              {billingFrequency === "yearly" && plan.name !== "Gratis" && (
                <div className="mt-1 text-sm text-gray-400">
                  {isLoading ? (
                    <span className="animate-pulse">$...</span>
                  ) : (
                    convertAndFormatPrice(
                      plan.pricing[billingFrequency].price / 12
                    )
                  )}
                  /mes
                </div>
              )}
              {billingFrequency === "weekly" && plan.name !== "Gratis" && (
                <div className="mt-1 text-sm text-blue-400 font-medium">
                  Acceso completo por 7 días
                </div>
              )}
              <p className="mt-2 text-sm text-gray-300">{plan.description}</p>
              <ul className="mt-4 md:mt-5 space-y-2 md:space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center mt-5 md:mt-6 w-full py-2.5 px-5 rounded-lg cursor-pointer font-semibold text-sm transition-all duration-200  ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                {plan.name === "Gratis"
                  ? "Comienza ahora"
                  : billingFrequency === "weekly"
                  ? "Prueba 7 días"
                  : `Suscríbete`}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
