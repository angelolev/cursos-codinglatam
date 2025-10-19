import { getStarterRepoBySlug } from "@/utils/common";
import { notFound } from "next/navigation";
import Image from "next/image";
import { GitBranch, Clock, Award, ExternalLink, Play, CheckCircle2 } from "lucide-react";
import StarterRepoGuard from "@/components/StarterRepoGuard";
import { generatePageMetadata } from "@/utils/metadata";
import Link from "next/link";
import { auth } from "@/app/auth";

export const revalidate = 86400; // 24 hours

type Params = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: Params }) {
  const params = await props.params;
  const repo = await getStarterRepoBySlug(params.slug);

  if (!repo) {
    return generatePageMetadata(
      "Repositorio no encontrado",
      "El repositorio que buscas no existe.",
      "/repositorios"
    );
  }

  return generatePageMetadata(
    repo.title,
    repo.description,
    `/repositorios/${params.slug}`
  );
}

export default async function RepoDetailPage(props: { params: Params }) {
  const params = await props.params;
  const repo = await getStarterRepoBySlug(params.slug);
  const session = await auth();
  const userIsPremium = session?.user?.isPremium || false;

  if (!repo) {
    notFound();
  }

  const difficultyColors = {
    Principiante: "bg-green-100 text-green-800",
    Intermedio: "bg-yellow-100 text-yellow-800",
    Avanzado: "bg-red-100 text-red-800",
  };

  const canAccess = !repo.isPremium || userIsPremium;

  return (
    <StarterRepoGuard
      isPremium={repo.isPremium}
      repoTitle={repo.title}
      repoSlug={params.slug}
    >
      <main className="pt-32 mx-auto max-w-7xl sm:px-6 px-4 lg:px-0 flex-grow pb-16">
        <div className="mb-8">
          <Link
            href="/repositorios"
            className="text-indigo-300 hover:text-indigo-200 transition-colors inline-flex items-center gap-2"
          >
            ← Volver a repositorios
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4 flex items-center gap-3">
                <GitBranch className="h-10 w-10 text-indigo-400" />
                {repo.title}
              </h1>
              <p className="text-xl text-white/70">{repo.description}</p>
            </div>

            <div className="mb-8 rounded-xl overflow-hidden">
              <Image
                src={repo.thumbnail}
                alt={repo.title}
                width={800}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>

            {repo.features && repo.features.length > 0 && (
              <div className="bg-white rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Características incluidas
                </h2>
                <ul className="space-y-3">
                  {repo.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {repo.readme && canAccess && (
              <div className="bg-white rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Instrucciones de uso
                </h2>
                <div className="prose prose-indigo max-w-none">
                  <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{repo.readme}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Detalles del repositorio
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Dificultad
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      difficultyColors[
                        repo.difficulty as keyof typeof difficultyColors
                      ]
                    }`}
                  >
                    {repo.difficulty}
                  </span>
                </div>

                {repo.setupTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Tiempo de setup
                    </span>
                    <span className="font-medium text-gray-900">
                      {repo.setupTime}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <span className="text-gray-600 block mb-2">Categoría</span>
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {repo.category}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Stack de tecnologías
                </h4>
                <div className="flex flex-wrap gap-2">
                  {repo.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {canAccess ? (
                <div className="space-y-3">
                  <a
                    href={repo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <GitBranch className="h-5 w-5" />
                    Ver en GitHub
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  {repo.demoUrl && (
                    <a
                      href={repo.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="h-5 w-5" />
                      Ver Demo
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 rounded-lg text-center">
                  <p className="text-sm mb-2">Repositorio Premium</p>
                  <p className="text-xs opacity-90">
                    Actualiza a Premium para acceder
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </StarterRepoGuard>
  );
}
