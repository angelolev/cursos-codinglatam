import React from "react";
import {
  Clock,
  Wrench,
  Code2,
  Layers,
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
import FigmaLinkSection from "@/components/projects/FigmaLinkSection";
import { generateProjectMetadata } from "@/utils/metadata";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Proyecto no encontrado",
      description: "El proyecto que buscas no existe",
    };
  }

  return generateProjectMetadata(project);
}

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
              <FigmaLinkSection 
                figmaLink={project.figmaLink} 
                isPremium={isPremium} 
              />
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
