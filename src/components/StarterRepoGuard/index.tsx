"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Crown, Lock, GitBranch } from "lucide-react";

interface StarterRepoGuardProps {
  children: React.ReactNode;
  isPremium: boolean;
  repoTitle?: string;
  repoSlug?: string;
}

export default function StarterRepoGuard({
  children,
  isPremium: repoIsPremium,
  repoTitle,
  repoSlug,
}: StarterRepoGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userIsPremium = session?.user?.isPremium || false;

  // If repo is free, allow access to everyone
  if (!repoIsPremium) {
    return <>{children}</>;
  }

  // Wait for session to load
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!session) {
    const callbackUrl = repoSlug
      ? `/repositorios/${repoSlug}`
      : `/repositorios`;
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is premium, show full content
  if (userIsPremium) {
    return <>{children}</>;
  }

  // Show premium upgrade prompt for non-premium users
  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-0 pt-24 pb-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-8">
          <Lock className="h-10 w-10 text-indigo-600" />
        </div>

        <h1 className="text-4xl font-bold text-white/90 mb-4">
          Repositorio Premium
        </h1>

        {repoTitle && (
          <h2 className="text-2xl text-white/70 mb-6">{repoTitle}</h2>
        )}

        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
          Este repositorio de inicio es parte del contenido premium. Actualiza
          tu cuenta para acceder a todos los starter repos y recursos.
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-md mx-auto">
          <p className="text-white/80">
            Los usuarios premium tienen acceso a repositorios exclusivos con
            configuraciones avanzadas y mejores prácticas.
          </p>
        </div>

        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 mb-8 max-w-lg mx-auto">
          <div className="flex items-center justify-center mb-3">
            <GitBranch className="h-6 w-6 text-green-400 mr-2" />
            <span className="text-green-400 font-semibold">
              Repositorios Gratuitos
            </span>
          </div>
          <p className="text-white/80">
            Algunos repositorios están disponibles gratuitamente para todos los
            usuarios registrados. Explora la colección completa en la página de
            repositorios.
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 max-w-lg mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">Hazte Premium</h3>
          </div>

          <p className="text-indigo-100 mb-6">
            Accede a todos los repositorios de apoyo, cursos completos, recursos
            descargables y soporte prioritario.
          </p>

          <div className="text-3xl font-bold text-white mb-6">
            $4.99<span className="text-lg text-indigo-200">/mes</span>
          </div>

          <button
            onClick={() => router.push("/pro")}
            className="w-full bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors cursor-pointer"
          >
            Actualizar a Premium
          </button>

          <p className="text-indigo-200 text-sm mt-4">
            Cancela en cualquier momento
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.push(`/repositorios`)}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            ← Volver a repositorios
          </button>
        </div>
      </div>
    </div>
  );
}
