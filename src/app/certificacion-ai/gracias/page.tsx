import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/utils/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = generatePageMetadata(
  "¡Gracias por tu compra! - Certificación AI Engineer",
  "Bienvenido a la Certificación AI Engineer Cohorte 1. En 6 semanas dominarás las herramientas de IA que usan los mejores developers del mundo. Inicia Febrero 2026.",
  "/certificacion-ai/gracias"
);

import {
  Sparkles,
  Calendar,
  Rocket,
  ArrowRight,
  CheckCircle2,
  PartyPopper,
  BookOpen,
  Users,
  Award,
  Zap,
  Code2,
  Video,
  MessageSquare,
  Trophy,
  Brain,
  Target,
} from "lucide-react";

const benefits = [
  {
    icon: <Sparkles className="h-6 w-6 text-cyan-600" />,
    title: "Herramientas IA Profesionales",
    description:
      "Domina Claude Code, Cursor, GitHub Copilot, v0, Bolt y más herramientas que usan los mejores developers.",
  },
  {
    icon: <Award className="h-6 w-6 text-cyan-600" />,
    title: "Certificación Oficial",
    description:
      "Badge verificable en LinkedIn y portfolio que demuestra tus skills profesionales con IA.",
  },
  {
    icon: <Users className="h-6 w-6 text-cyan-600" />,
    title: "Comunidad Elite de AI Engineers",
    description:
      "Acceso de por vida al grupo privado de desarrolladores certificados en IA.",
  },
  {
    icon: <Video className="h-6 w-6 text-cyan-600" />,
    title: "Clases en Vivo",
    description:
      "Sesiones interactivas Mar/Jue 8PM-10PM con instructores expertos durante 6 semanas.",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-cyan-600" />,
    title: "Material Exclusivo",
    description:
      "Guías, templates, prompts profesionales y recursos descargables de por vida.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-cyan-600" />,
    title: "Mentorías 1-on-1",
    description:
      "Sesiones personalizadas con mentores para resolver dudas y revisar tu código.",
  },
  {
    icon: <Code2 className="h-6 w-6 text-cyan-600" />,
    title: "Proyectos Reales",
    description:
      "Construye aplicaciones profesionales usando IA desde el primer día del programa.",
  },
  {
    icon: <Trophy className="h-6 w-6 text-cyan-600" />,
    title: "Portfolio Profesional",
    description:
      "Crea un portfolio impresionante con proyectos que demuestran tus skills con IA.",
  },
];

const nextSteps = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Únete al Discord Privado",
    description:
      "Accede al canal exclusivo de la Cohorte 1 y conoce a tus compañeros AI Engineers",
    link: "https://discord.com/invite/kgRRjUBNGU",
    linkText: "Unirme ahora",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Revisa el Calendario",
    description:
      "Marca las fechas: Febrero 10, 2026. Clases Mar/Jue 8PM-10PM durante 6 semanas",
    link: "/claude",
    linkText: "Ver cronograma",
  },
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Prepara tu Setup",
    description:
      "Recibirás un email con las herramientas necesarias y cómo configurarlas antes del inicio",
    link: "/",
    linkText: "Explorar contenido",
  },
];

const whatYouWillLearn = [
  {
    title: "Semanas 1-2: Fundamentos",
    items: [
      "Setup de herramientas IA",
      "Prompting profesional",
      "Workflows básicos con Claude & Cursor",
      "Primer proyecto guiado",
    ],
  },
  {
    title: "Semanas 3-4: Nivel Avanzado",
    items: [
      "Custom agents & MCP",
      "Debugging avanzado con IA",
      "Code review automático",
      "Proyecto individual completo",
    ],
  },
  {
    title: "Semanas 5-6: Certificación",
    items: [
      "Proyecto final profesional",
      "Best practices de producción",
      "Examen de certificación",
      "Portfolio y LinkedIn badge",
    ],
  },
];

export default function GraciasCertificacionAI() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 rounded-full mb-6">
            <CheckCircle2 className="h-8 w-8 text-cyan-600" />
          </div>
          <h1 className="text-4xl font-bold text-white/90 mb-4">
            ¡Bienvenido(a) a AI Engineer Cohorte 1!{" "}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
            Felicidades por dar el paso más importante de tu carrera. En 6
            semanas dominarás las herramientas de IA que usan los mejores
            developers del mundo.
          </p>
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-sm rounded-full px-6 py-3 border border-cyan-400/30">
            <Brain className="h-5 w-5 text-cyan-300" />
            <span className="text-cyan-300 font-semibold">
              Inicia: Febrero 10, 2026 · Mar/Jue 8PM-10PM
            </span>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 rounded-2xl shadow-lg p-8 mb-12 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold text-white/90">
              Todo lo que obtienes
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-gray-600/30 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="bg-cyan-500/20 rounded-lg p-3 mb-4 inline-block">
                  {benefit.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white mb-12">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold">Primeros pasos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="bg-white/20 rounded-lg p-3 mb-4 inline-block">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-cyan-100 mb-4 text-sm">{step.description}</p>
                <Link
                  href={step.link}
                  className="inline-flex items-center text-white hover:text-cyan-200 font-semibold"
                >
                  {step.linkText}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 rounded-2xl shadow-lg p-8 border border-gray-700/50 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold text-white/90">
              Qué aprenderás en 6 semanas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whatYouWillLearn.map((week, index) => (
              <div
                key={index}
                className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30"
              >
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                  {week.title}
                </h3>
                <ul className="space-y-2">
                  {week.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-300"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 text-center">
          <Award className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white/90 mb-3">
            Prepárate para transformar tu carrera
          </h2>
          <p className="text-lg text-white/70 mb-6 max-w-2xl mx-auto">
            Recibirás un email con toda la información detallada, acceso al
            Discord privado y las instrucciones de setup en las próximas 24
            horas.
          </p>
          <div className="text-white/60 text-sm space-y-1">
            <p>📧 Revisa tu email (incluyendo spam) para más detalles</p>
            <p>
              💬 Únete al{" "}
              <Link
                target="_blank"
                href="https://chat.whatsapp.com/Gh91Z1WS2EfKOPxu4gHUp8"
                className="text-cyan-400 hover:text-cyan-300 text-underline"
              >
                grupo de Whatsapp
              </Link>{" "}
              para conocer a tus compañeros
            </p>
            <p>🚀 Nos vemos el 10 de Febrero, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
