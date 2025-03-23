import { Check, Crown } from "lucide-react";
import Link from "next/link";
import { auth } from "@/app/auth";

export default async function Pricing() {
  const session = await auth();

  const pricingPlans = [
    {
      name: "Gratis",
      price: 0,
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
      price: 4.99,
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
      price: 39.99,
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
              plan.popular ? "ring-2 ring-indigo-600 scale-105" : ""
            }`}
          >
            {plan.popular && (
              <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
                Más Popular
              </div>
            )}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {plan.name === "Pro" && (
                  <Crown className="h-6 w-6 text-indigo-600" />
                )}
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600 ml-1">/mes</span>
              </div>
              <p className="mt-2 text-gray-600">{plan.description}</p>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block text-center mt-8 w-full py-3 px-6 rounded-lg cursor-pointer font-semibold ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                } transition-colors`}
              >
                {plan.name === "Gratis" ? "Comienza ahora" : "Suscríbete ahora"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
