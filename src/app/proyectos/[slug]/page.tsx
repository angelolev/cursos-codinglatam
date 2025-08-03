import React from "react";
import {
  Clock,
  Wrench,
  Code2,
  Layers,
  ExternalLink,
  Lock,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { getProjectBySlug, getProjectComments } from "@/utils/common";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Image from "next/image";
import ProjectComments from "@/components/ProjectComments";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import BackButton from "@/components/buttons/BackButton";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  try {
    const projectsRef = collection(db, "projects");
    const querySnapshot = await getDocs(projectsRef);

    return querySnapshot.docs.map((doc) => ({
      slug: doc.data().slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function ProjectDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!project) {
    return (
      <div className="pt-24 px-4 text-center">
        <h2 className="text-2xl font-bold text-white/90 mb-6">
          Proyecto no encontrado
        </h2>
        <BackButton href="/proyectos" label="Volver a proyectos" />
      </div>
    );
  }

  const projectComments = await getProjectComments(project.id);
  const isPremium = session.user?.isPremium || false;

  return (
    <div className="pb-16 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        <BackButton href="/proyectos" label="Volver a proyectos" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Image
              src={project.image}
              alt={project.title}
              className="w-full h-80 object-cover rounded-xl mb-8"
              width={800}
              height={200}
            />
            <h1 className="text-4xl font-bold text-white/90 mb-4">
              {project.title}
            </h1>
            <p className="text-xl text-white/70 mb-8">
              {project.longDescription || project.description}
            </p>

            {project.features && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Pondrás en práctica:
                </h2>
                <ul className="space-y-4">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Layers className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Mockups del proyecto
              </h2>
              <p className="text-gray-600 mb-4">
                Consulta la imagen adjunta del proyecto para ver el diseño del
                proyecto.
              </p>
              <Link href={project.image} target="_blank">
                <div className="relative h-96">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={260}
                    className="w-full h-96 object-cover rounded-xl mb-8"
                  />
                </div>
              </Link>
            </div>

            {project.figmaLink && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="h-6 w-6 mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
                      fill="#1abcfe"
                    />
                    <path
                      d="M4 20a4 4 0 0 1 4-4h4v4a4 4 0 0 1-8 0Z"
                      fill="#0acf83"
                    />
                    <path
                      d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z"
                      fill="#ff7262"
                    />
                    <path
                      d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4Z"
                      fill="#f24e1e"
                    />
                    <path
                      d="M12 4a4 4 0 0 1 4-4 4 4 0 0 1 0 8h-4V4Z"
                      fill="#a259ff"
                    />
                  </svg>
                  Archivos de Figma
                </h2>

                {isPremium ? (
                  <>
                    <p className="text-gray-600 mb-4">
                      Accede a los archivos de diseño de Figma para ver los
                      componentes, estilos y especificaciones completas del
                      proyecto.
                    </p>
                    <Link
                      href={project.figmaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Ver en Figma
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Lock className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Contenido Premium
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Los archivos de Figma están disponibles solo para usuarios
                      premium. Accede a recursos de diseño completos y
                      especificaciones detalladas.
                    </p>
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-center mb-3">
                        <Crown className="h-6 w-6 text-yellow-400 mr-2" />
                        <span className="font-semibold">Hazte Premium</span>
                      </div>
                      <p className="mb-4">
                        Accede a todos los recursos de diseño, código fuente y
                        contenido exclusivo.
                      </p>
                      <div className="text-2xl font-bold mb-4">
                        $4.99
                        <span className="text-sm text-indigo-200">/mes</span>
                      </div>
                      <Link
                        href="/pro"
                        className="w-full bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-block text-center"
                      >
                        Actualizar a Premium
                      </Link>
                      <p className="text-indigo-200 text-sm mt-3">
                        Cancela en cualquier momento
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <ProjectComments
              comments={projectComments}
              projectId={project.id}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Detalles del proyecto
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Duración: {project.duration}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Wrench className="h-5 w-5 mr-2" />
                  <span>Dificultad: {project.difficulty}</span>
                </div>
                <div>
                  <h3 className="text-gray-900 font-medium mb-2 flex items-center">
                    <Code2 className="h-5 w-5 mr-2" />
                    Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
                Ver Proyecto
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
