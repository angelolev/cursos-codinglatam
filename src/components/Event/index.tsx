import { Calendar } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  href: string;
}

const currentEvents: Event[] = [
  {
    id: "1",
    title: "Core Web Vitals: El Secreto del Rendimiento Web",
    description:
      "Descubre cómo optimizar los Core Web Vitals para lograr sitios más rápidos, estables y efectivos.",
    date: "25 Ene",
    href: "https://cursos.codinglatam.dev/workshops/core-web-vitals",
  },
  {
    id: "2",
    title: "Tailwind CSS en aplicaciones web modernas",
    description:
      "Domina Tailwind CSS y revoluciona tu forma de construir interfaces modernas.",
    date: "01 Feb",
    href: "https://cursos.codinglatam.dev/workshops/tailwind-en-aplicaciones-web",
  },

  {
    id: "3",
    title: "Curso: De 0 a la Web EN VIVO",
    description:
      "Aprende desde cero las tecnologías con las que podrás crear proyectos para la web.",
    date: "04 Feb",
    href: "https://www.codinglatam.dev/cursos/web",
  },
  {
    id: "4",
    title: "Curso: De 0 a React EN VIVO",
    description:
      "Domina la biblioteca más popular del front-end y construye aplicaciones web dinámicas.",
    date: "05 Feb",
    href: "https://www.codinglatam.dev/cursos/react",
  },
  {
    id: "5",
    title: "Portafolios que Contratan: Aprende a Destacar como Dev",
    description:
      "Aprende los tips y consejos para que tu portafolio destaque tus habilidades y atraiga reclutadores.",
    date: "08 Feb",
    href: "https://cursos.codinglatam.dev/workshops/portafolios-que-contratan",
  },
];

export function MonthlyEvents() {
  //   const currentMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary-300 to-primary-400 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Calendar className="h-6 w-6 mr-2" />
          Lo que se viene
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {currentEvents.map((event) => (
            <Link
              href={event.href}
              key={event.id}
              className="flex items-center space-x-4"
              target="_blank"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center text-center">
                <span className="text-lg font-bold text-indigo-600">
                  {event.date}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
