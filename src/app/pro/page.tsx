import {
  Check,
  Star,
  Zap,
  Crown,
  Gift,
  Calendar,
  BookOpen,
  MessageSquare,
  Users,
} from "lucide-react";
import SubscriptionButton from "@/components/buttons/SubscriptionButton";
import { auth } from "../auth";
import { redirect } from "next/navigation";

const benefits = [
  {
    icon: <Gift className="h-6 w-6 text-indigo-600" />,
    title: "Acceso anticipado a nuevos contenidos",
    description:
      "Serás uno de los primeros en acceder a nuevos cursos, proyectos y material antes de que estén disponibles públicamente.",
  },
  {
    icon: <Star className="h-6 w-6 text-indigo-600" />,
    title: "Cursos exclusivos para usuarios Pro",
    description:
      "Accede a cursos avanzados y talleres disponibles solo para miembros Pro.",
  },
  {
    icon: <Zap className="h-6 w-6 text-indigo-600" />,
    title: "Acceso a TODOS los cursos",
    description:
      "Obtén acceso permanente a todos los cursos y materiales educativos.",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-indigo-600" />,
    title: "Recursos descargables",
    description:
      "Acceso a código fuente descargable, cheatsheets y guías de estudio.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-indigo-600" />,
    title: "Prioridad en soporte",
    description:
      "Tendrás respuestas más rápidas de los instructores y canales de soporte dedicados.",
  },
  {
    icon: <Calendar className="h-6 w-6 text-indigo-600" />,
    title: "Acceso prioritario a eventos",
    description:
      "Tendrás tu lugar reservado en talleres en vivo y sesiones de mentoría.",
  },
  {
    icon: <Users className="h-6 w-6 text-indigo-600" />,
    title: "Sé parte de la comunidad Pro",
    description:
      "Serás parte del grupo exclusivo y tendrás oportunidades de networking.",
  },
  {
    icon: <Crown className="h-6 w-6 text-indigo-600" />,
    title: "Participación en mentorías",
    description:
      "Mentorías grupales: recibe orientación directa y mejora tus proyectos con apoyo personalizado.",
  },
];

export default async function ProPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-indigo-100 rounded-full px-4 py-2 text-indigo-700 mb-8">
            <Crown className="h-5 w-5 mr-2" />
            <span className="font-medium">Únete a Premium</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Descubre todo tu potencial
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Obtén acceso a beneficios exclusivos que acelerarán tu proceso de
            aprendizaje y te ayudarán a convertirte en un(a) mejor
            desarrollador(a)
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <SubscriptionButton />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">20%+</div>
            <div className="text-gray-600">Descuento en cursos y workshops</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">100+</div>
            <div className="text-gray-600">
              Recursos descargables exclusivos
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              Acceso Total
            </div>
            <div className="text-gray-600">A TODOS los cursos y workshops</div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white/90 text-center mb-16">
            Todo lo que obtienes siendo usuario Pro
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <h2 className="text-2xl text-center font-bold text-white mb-8 md:hidden">
          ¿Estás listo(a) para llevar tus habilidades al siguiente nivel?
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto md:hidden">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Crown className="h-8 w-8 text-indigo-600" />
            <h3 className="text-2xl font-bold text-gray-900 text-center">
              Membresía Pro
            </h3>
          </div>
          <div className="text-5xl font-bold text-gray-900 text-center mb-6">
            $4.99<span className="text-xl text-gray-500">/mes</span>
          </div>
          <ul className="space-y-4 mb-8 text-left max-w-md mx-auto">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
                <span className="text-gray-600">{benefit.title}</span>
              </li>
            ))}
          </ul>
          <SubscriptionButton />
          <p className="text-sm text-gray-500 mt-8">
            Garantía de devolución de dinero de 30 días. Sin preguntas.
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl overflow-hidden hidden md:block">
          <div className="px-8 py-16 sm:px-16 sm:py-24 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              ¿Estás listo(a) para llevar tus habilidades al siguiente nivel?
            </h2>
            <p className="text-xl text-indigo-100 mb-12 max-w-3xl mx-auto">
              Únete a los desarrolladores que ya son parte de Pro y aceleraron
              su crecimiento profesional.
            </p>
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Crown className="h-8 w-8 text-indigo-600" />
                <h3 className="text-3xl font-bold text-gray-900">
                  Membresía Pro
                </h3>
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-6">
                $4.99<span className="text-xl text-gray-500">/mes</span>
              </div>
              <ul className="space-y-4 mb-8 text-left max-w-md mx-auto">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-1" />
                    <span className="text-gray-600">{benefit.title}</span>
                  </li>
                ))}
              </ul>
              <SubscriptionButton />
              <p className="text-sm text-gray-500 mt-8">
                Garantía de devolución de dinero de 30 días. Sin preguntas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
