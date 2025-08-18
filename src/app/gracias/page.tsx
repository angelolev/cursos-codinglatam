import React from "react";
import Link from "next/link";

export const dynamic = 'force-static';
import {
  Star,
  Zap,
  Gift,
  Calendar,
  Rocket,
  ArrowRight,
  CheckCircle2,
  PartyPopper,
  BookOpen,
  MessageSquare,
  Users,
  Crown,
} from "lucide-react";
import Image from "next/image";

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

const nextSteps = [
  {
    title: "Completa tu Perfil",
    description:
      "Añade tus habilidades e intereses para obtener recomendaciones personalizadas",
    link: "/perfil",
    linkText: "Completar Perfil",
  },
  {
    title: "Únete a la comunidad Pro",
    description:
      "Conéctate con otros miembros pro en nuestro canal exclusivo de Discord",
    link: "https://discord.com/invite/kgRRjUBNGU",
    linkText: "Unirme a Discord",
  },
  {
    title: "Explora todo el contenido",
    description: "Consulta nuestros cursos y recursos pro exclusivos",
    link: "/",
    linkText: "Ver todos los cursos",
  },
];

const recommendedCourses = [
  {
    title: "React desde cero",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    duration: "15 clases",
    link: "/cursos/react",
  },
  {
    title: "Programación web desde cero",
    image:
      "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?auto=format&fit=crop&q=80&w=800",
    duration: "24 clases",
    link: "/cursos/web",
  },
  {
    title: "Integrando IA en aplicaciones de React",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    duration: "01 sesión",
    link: "/workshops/ia-y-programacion",
  },
];

export default function Gracias() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-white/90 mb-4">
            Bienvenido(a) a la comunidad Pro!{" "}
            <PartyPopper className="h-8 w-8 inline-block text-yellow-500" />
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Gracias por unirte a nuestra membresía Pro. Tu viaje para
            convertirte en un desarrollador excepcional comienza ahora.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Tus beneficios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-start">
                <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-lg p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-8">Siguientes pasos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {nextSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-indigo-100 mb-4">{step.description}</p>
                <Link
                  href={step.link}
                  className="inline-flex items-center text-white hover:text-indigo-200"
                >
                  {step.linkText}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Cursos Pro Recomendados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendedCourses.map((course, index) => (
              <Link
                href={course.link}
                key={index}
                className="group cursor-pointer"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600">{course.duration}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex  bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors  items-center justify-center"
            >
              <Rocket className="h-5 w-5 mr-2" />
              Conoce todo el contenido
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
