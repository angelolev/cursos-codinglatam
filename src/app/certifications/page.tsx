
"use client";
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
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

const benefits = [
  {
    icon: <Gift className="h-6 w-6 text-indigo-600" />,
    title: "Networking Exclusivo",
    description:
      "Accede a nuestra comunidad privada de estudiantes y profesionales. Conecta, colabora y crece con otros miembros de la comunidad.",
  },
  {
    icon: <Star className="h-6 w-6 text-indigo-600" />,
    title: "Mejoras en tu Carrera",
    description:
      "Nuestros cursos están diseñados para darte las habilidades que el mercado demanda. Mejora tu perfil profesional y accede a mejores oportunidades.",
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

export default function CertificationsPage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session === null) {
      redirect("/login");
    }
  }, [session]);

  if (session === undefined) {
    return null; // Loading state
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-indigo-100 rounded-full px-4 py-2 text-indigo-700 mb-8">
              <Crown className="h-5 w-5 mr-2" />
              <span className="font-medium">Certificaciones</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Valida tus conocimientos
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Nuestras certificaciones son el reconocimiento a tu esfuerzo y dedicación. Demuestra tus habilidades y conocimientos al mundo.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">1000+</div>
              <div className="text-gray-600">Egresados</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">95%</div>
              <div className="text-gray-600">
                De egresados consiguieron trabajo
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                Top 5
              </div>
              <div className="text-gray-600">Empresas contratan a nuestros egresados</div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-white/90 text-center mb-16">
              Beneficios de ser Premium
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

          {/* Certified Users Section */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold text-white/90 text-center mb-16">
              Nuestros Egresados
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {/* Placeholder for certified users */}
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <Logo />
                <h3 className="font-bold mt-2">Nombre del Egresado</h3>
                <p className="text-sm text-gray-600">Curso Completado</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <Logo />
                <h3 className="font-bold mt-2">Nombre del Egresado</h3>
                <p className="text-sm text-gray-600">Curso Completado</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <Logo />
                <h3 className="font-bold mt-2">Nombre del Egresado</h3>
                <p className="text-sm text-gray-600">Curso Completado</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <Logo />
                <h3 className="font-bold mt-2">Nombre del Egresado</h3>
                <p className="text-sm text-gray-600">Curso Completado</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
