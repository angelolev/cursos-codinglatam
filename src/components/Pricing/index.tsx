"use client";
import { Check, Crown } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

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

export default function Pricing() {
  const { data: session } = useSession();
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
      description: "Perfect para empezar",
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
        monthly: { price: 4.99, label: "/mes" },
        yearly: { price: 49.99, label: "/año", savings: "Ahorra $9.89" },
      },
      description: "Todo lo que necesitas para crecer",
      href: session?.user
        ? "https://cursoscodinglatam.lemonsqueezy.com/checkout/buy/c36b9bc2-a598-4b21-9442-924f771c8e8b"
        : "/login",
      features: [
        "Todos los beneficios de la versión gratuita",
        "Acceso a todos los cursos",
        "Mentorías grupales",
        "Acceso al grupo privado de la comunidad",
        "Descuentos Exclusivos para Cursos en vivo",
        "Proyectos y plantillas premium",
        "Workshops en vivo",
        "Soporte prioritario",
      ],
      popular: true,
    },
    {
      name: "Equipos",
      pricing: {
        weekly: { price: 12.99, label: "/semana" },
        monthly: { price: 39.99, label: "/mes" },
        yearly: { price: 399.99, label: "/año", savings: "Ahorra $79.89" },
      },
      description: "Para equipos de hasta 5 desarrolladores",
      href: "https://wa.link/dnyqus",
      features: [
        "Todos los beneficios de la versión Pro",
        "Colaboración en equipo",
        "Rutas de aprendizaje personalizadas",
        "Sesiones de Preguntas y Respuestas (Q&A)",
        "Acceso a una Comunidad de Networking",
        "Y mucho más...",
      ],
    },
  ];

  return (
    <div className="my-24">
      <div className="text-center mb-24">
        <h2 className="text-4xl font-bold text-white/90 mb-4">
          Elige tu camino de aprendizaje
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Selecciona el plan que mejor se adapte a tus objetivos y lleva tus
          skills de programación al siguiente nivel
        </p>

        {/* Billing Frequency Toggle */}
        <div className="mt-8 inline-flex bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
          {(["weekly", "monthly", "yearly"] as BillingFrequency[]).map(
            (frequency) => (
              <button
                key={frequency}
                onClick={() => setBillingFrequency(frequency)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
              plan.popular
                ? "ring-2 ring-indigo-600 scale-105"
                : "hover:scale-102"
            }`}
          >
            {plan.popular && (
              <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
                Más Popular
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {plan.name === "Pro" && (
                    <Crown className="h-6 w-6 text-indigo-600" />
                  )}
                  {plan.name}
                </h3>
                {plan.pricing[billingFrequency].savings && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {plan.pricing[billingFrequency].savings}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.pricing[billingFrequency].price}
                </span>
                <span className="text-gray-600 ml-1">
                  {plan.pricing[billingFrequency].label}
                </span>
              </div>
              {billingFrequency === "yearly" && plan.name !== "Gratis" && (
                <div className="mt-1 text-sm text-gray-500">
                  ${(plan.pricing[billingFrequency].price / 12).toFixed(2)}/mes
                </div>
              )}
              {billingFrequency === "weekly" && plan.name !== "Gratis" && (
                <div className="mt-1 text-sm text-blue-600 font-medium">
                  Acceso completo por 7 días
                </div>
              )}
              <p className="mt-2 text-gray-600">{plan.description}</p>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center mt-8 w-full py-3 px-6 rounded-lg cursor-pointer font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-105"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.name === "Gratis"
                  ? "Comienza ahora"
                  : billingFrequency === "weekly"
                  ? "Prueba 7 días"
                  : `Suscríbete ${
                      billingFrequency === "yearly"
                        ? "anualmente"
                        : "mensualmente"
                    }`}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
