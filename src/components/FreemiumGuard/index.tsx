"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Crown, Lock, Play } from "lucide-react";
import { getLessonAccessStatus, getFreemiumMessage } from "@/utils/freemium";

interface FreemiumGuardProps {
  children: React.ReactNode;
  lessonIndex: number;
  lessonTitle?: string;
  courseSlug?: string;
  lessonGuid?: string;
}

/**
 * Component that enforces freemium access rules for individual lessons
 */
export default function FreemiumGuard({
  children,
  lessonIndex,
  lessonTitle,
  courseSlug,
  lessonGuid,
}: FreemiumGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle redirect in useEffect to avoid render-time side effects
  useEffect(() => {
    if (status !== "loading" && !session) {
      const callbackUrl = lessonGuid
        ? `/cursos/${courseSlug}/clases/${lessonGuid}`
        : `/cursos/${courseSlug}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  }, [status, session, router, courseSlug, lessonGuid]);

  // Wait for session to load
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show loading while redirect is happening
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isPremium = session.user?.isPremium || false;
  const accessStatus = getLessonAccessStatus(lessonIndex, isPremium);

  // If user can access the lesson, render content
  if (accessStatus.canAccess) {
    return <>{children}</>;
  }

  // Show upgrade prompt for premium-only lessons
  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-0 pt-24 pb-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Lock Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-8">
          <Lock className="h-10 w-10 text-indigo-600" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-white/90 mb-4">
          Contenido Premium
        </h1>

        {lessonTitle && (
          <h2 className="text-2xl text-white/70 mb-6">{lessonTitle}</h2>
        )}

        {/* Description */}
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
          Esta lección es parte del contenido premium. Actualiza tu cuenta para
          acceder a todas las lecciones del curso.
        </p>

        {/* Status Message */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-md mx-auto">
          <p className="text-white/80">
            {getFreemiumMessage(lessonIndex, isPremium)}
          </p>
        </div>

        {/* Free Lessons Info */}
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 mb-8 max-w-lg mx-auto">
          <div className="flex items-center justify-center mb-3">
            <Play className="h-6 w-6 text-green-400 mr-2" />
            <span className="text-green-400 font-semibold">
              Lecciones Gratuitas
            </span>
          </div>
          <p className="text-white/80">
            Puedes acceder a las primeras 4 lecciones de cualquier curso de
            forma gratuita. Solo necesitas estar registrado.
          </p>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 max-w-lg mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">Hazte Premium</h3>
          </div>

          <p className="text-indigo-100 mb-6">
            Accede a todo el contenido, recursos descargables y soporte
            prioritario.
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

        {/* Back to Course Button */}
        <div className="mt-8">
          <button
            onClick={() => router.push(`/cursos/${courseSlug}`)}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            ← Volver al curso
          </button>
        </div>
      </div>
    </div>
  );
}
