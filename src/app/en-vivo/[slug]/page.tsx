import { notFound } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { getLiveCourseBySlug } from "@/utils/common";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Code2,
  Rocket,
  Star,
} from "lucide-react";
import Image from "next/image";
import instructorImage from "@/assets/angelo.jpeg";
import projectImage from "@/assets/project.png";

type Params = Promise<{ slug: string }>;

const faqs = [
  {
    question: "¿Qué pasa si me pierdo una sesión en vivo?",
    answer:
      "Todas las sesiones son grabadas y disponibles dentro de las 24 horas. Tendrás acceso a las grabaciones por tiempo indefinido y puedes repasarlas a tu ritmo.",
  },
  {
    question: "¿Necesito tener conocimientos previos?",
    answer:
      "Se requiere conocimientos básicos de JavaScript y React. Proporcionaremos materiales de preparación para ayudarte a prepararte para el curso.",
  },
  {
    question: "¿Tienes un reembolso?",
    answer:
      "Si, ofrecemos un reembolso completo si no estás satisfecho después de la primera sesión. Simplemente háznoslo saber dentro de las 24 horas de la primera clase.",
  },
  {
    question: "¿Obtendré un certificado?",
    answer:
      "Si, al completar el curso y el proyecto final, recibirás un certificado verificado de finalización.",
  },
  {
    question: "¿Qué tipo de soporte se ofrece?",
    answer:
      "Tendrás acceso a un grupo privado y soporte por correo electrónico durante el curso.",
  },
];

const reasons = [
  {
    title: "Clases en vivo",
    description:
      "Aprende directamente de expertos en la industria con interacción en tiempo real y feedback",
  },
  {
    title: "Proyectos reales",
    description:
      "Construye un proyecto listo para producción desde cero con las mejores prácticas",
  },
  {
    title: "Aplicaciones reales",
    description:
      "Aprende patrones y técnicas utilizadas en el desarrollo profesional",
  },
  {
    title: "Aprendizaje interactivo",
    description:
      "Sesiones en vivo con feedback y preguntas al final de cada clase",
  },
  {
    title: "Habilidades que el mercado necesita",
    description:
      "Gana experiencia práctica que se aplica directamente a tu trabajo",
  },
];

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getLiveCourseBySlug(slug);

  if (!course) {
    return {
      title: "Curso no encontrado",
      description: "El curso que buscas no existe",
    };
  }

  return {
    title: `${course.title} | Nuestros Cursos`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [course.image],
    },
  };
}

export async function generateStaticParams() {
  try {
    const coursesRef = collection(db, "liveCourses");
    const querySnapshot = await getDocs(coursesRef);

    return querySnapshot.docs.map((doc) => ({
      slug: doc.data().slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function LiveCoursePage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getLiveCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="pt-16 flex-grow">
      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${course.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/90">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-3xl">
              <Link
                href="/en-vivo"
                className="inline-flex items-center text-white mb-8"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver a los cursos
              </Link>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                {course.title}
              </h1>
              <p className="text-xl text-gray-200 mb-8">{course.description}</p>
              <div className="flex flex-wrap gap-4 text-white">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>
                    Inicia {new Date(course.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{course.schedule}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Why Take This Course */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white/90 mb-12">
            ¿Por qué debería tomar este curso?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600">{reason.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Syllabus */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white/90 mb-12">Temario</h2>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.topics.map((topic, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                    <Code2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg text-gray-900">{topic}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Preview */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white/90 mb-12">
            {/* What You'll Build */}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center gap-4">
              <Image
                src={projectImage}
                alt="Project Preview"
                className="rounded-xl shadow-lg"
                width={700}
                height={700}
              />
              <Link
                className="text-white/90 underline text-xl underline-offset-4"
                href={course.figmaLink}
              >
                Figma del proyecto
              </Link>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white/90 mb-6">
                Proyecto a desarrollar: {course.project.title}
              </h3>
              <div className="space-y-6">
                {course.project.ideas.map((idea, index) => (
                  <div key={index} className="flex items-start">
                    <Rocket size={20} className="text-indigo-600 mr-4 mt-1" />
                    <p className="text-white/70 w-[90%] text-xl">{idea}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing and Schedule */}
        <div className="mb-24">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl overflow-hidden">
            <div className="px-8 py-12 sm:px-16 sm:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Detalles del curso
                    </h3>
                    <div className="space-y-4 text-white">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3" />
                        <span>
                          Inicia{" "}
                          {new Date(course.startDate).toLocaleDateString()}
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
                    <div className="text-6xl font-bold mb-2">
                      ${course.discountPrice}
                      {course.price > course.discountPrice && (
                        <span className="text-2xl line-through ml-3 text-white/70">
                          ${course.price}
                        </span>
                      )}
                    </div>
                    <p className="text-white/80 mb-8">
                      Un solo pago, acceso permanente
                    </p>
                    <div className="space-y-4">
                      <a
                        href={course.buyLink}
                        className="block w-full bg-white text-indigo-600 text-center px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Inscribirme ahora
                      </a>
                      <a
                        href={course.demo}
                        className="block w-full border-2 border-white text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver testimonios
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">
                    Qué incluye
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-center text-white">
                      <CheckCircle2 className="h-5 w-5 mr-3" />
                      Sesiones interactivas en vivo
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
              </div>
            </div>
          </div>
        </div>

        {/* Author Bio */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-white/90 mb-12">
            Conoce a tu instructor
          </h2>
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-start">
              <Image
                src={instructorImage}
                alt={course.instructor}
                className="w-24 h-24 rounded-full object-cover"
                width={100}
                height={100}
              />
              <div className="ml-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course.instructor}
                </h3>

                <p className="mt-4 text-black/70">
                  Ingeniero de software apasionado por las tecnologías web y el
                  desarrollo de aplicaciones multiplataforma.
                </p>

                <p className="mt-4 text-black/70">
                  Tengo más de 8 años de experiencia laboral en empresas de
                  tecnología, startups locales y extranjeras. Creo contenido en
                  redes sociales sobre programación.
                </p>

                <p className="mt-4 text-black/70">
                  Trabajo como arquitecto front-end ayudando a crear
                  aplicaciones web de alto rendimiento. Disfruto aprendiendo
                  cosas nuevas, desarrollando actividades de equipo y soluciones
                  creativas.
                </p>

                <p className="mt-4 text-black/70">
                  Siempre estoy ansioso por aprender nuevas tecnologías y con un
                  interés genuino por la mejor experiencia de usuario.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-3xl font-bold text-white/90 mb-12">
            Preguntas frecuentes
          </h2>
          <div className="grid gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
