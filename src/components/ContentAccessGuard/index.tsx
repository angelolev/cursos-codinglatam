"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Crown, Lock, Play, Book, Video } from "lucide-react";

interface ContentAccessGuardProps {
  children: React.ReactNode;
  isFree: boolean;
  contentType: 'workshop' | 'product' | 'guide';
  contentTitle?: string;
  contentSlug?: string;
}

/**
 * Universal component that enforces access rules for workshops, products, and guides
 */
export default function ContentAccessGuard({ 
  children, 
  isFree,
  contentType,
  contentTitle,
  contentSlug
}: ContentAccessGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle redirect in useEffect to avoid render-time side effects
  useEffect(() => {
    if (status !== "loading" && !session) {
      const currentUrl = window.location.pathname;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentUrl)}`);
    }
  }, [status, session, router]);

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

  // If content is free, allow access for logged-in users
  if (isFree) {
    return <>{children}</>;
  }

  // If content is premium and user is premium, allow access
  if (!isFree && isPremium) {
    return <>{children}</>;
  }

  // Show upgrade prompt for premium content to non-premium users
  const getContentIcon = () => {
    switch (contentType) {
      case 'workshop':
        return <Video className="h-10 w-10 text-indigo-600" />;
      case 'product':
        return <Book className="h-10 w-10 text-indigo-600" />;
      case 'guide':
        return <Book className="h-10 w-10 text-indigo-600" />;
      default:
        return <Lock className="h-10 w-10 text-indigo-600" />;
    }
  };

  const getContentTypeName = () => {
    switch (contentType) {
      case 'workshop':
        return 'Workshop';
      case 'product':
        return 'Producto';
      case 'guide':
        return 'Guía';
      default:
        return 'Contenido';
    }
  };

  const getBackUrl = () => {
    switch (contentType) {
      case 'workshop':
        return contentSlug ? `/workshops/${contentSlug}` : '/workshops';
      case 'product':
        return contentSlug ? `/guias/${contentSlug}` : '/guias';
      case 'guide':
        return contentSlug ? `/guias/${contentSlug}` : '/guias';
      default:
        return '/';
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-0 pt-24 pb-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Content Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-8">
          {getContentIcon()}
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-white/90 mb-4">
          {getContentTypeName()} Premium
        </h1>
        
        {contentTitle && (
          <h2 className="text-2xl text-white/70 mb-6">
            {contentTitle}
          </h2>
        )}

        {/* Description */}
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
          Este {contentType === 'workshop' ? 'workshop' : contentType} es parte del contenido premium. 
          Actualiza tu cuenta para acceder al contenido exclusivo.
        </p>

        {/* Status Message */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-md mx-auto">
          <p className="text-white/80">
            <strong>Estado:</strong> Requiere suscripción Pro
          </p>
        </div>

        {/* Free Content Info */}
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 mb-8 max-w-lg mx-auto">
          <div className="flex items-center justify-center mb-3">
            <Play className="h-6 w-6 text-green-400 mr-2" />
            <span className="text-green-400 font-semibold">Contenido Gratuito Disponible</span>
          </div>
          <p className="text-white/80">
            {contentType === 'workshop' && 'Algunos workshops están disponibles gratuitamente. '}
            {contentType === 'product' && 'Algunos productos están disponibles gratuitamente. '}
            {contentType === 'guide' && 'Algunas guías están disponibles gratuitamente. '}
            Además, puedes acceder a las primeras 4 lecciones de cualquier curso.
          </p>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-8 max-w-lg mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">Hazte Premium</h3>
          </div>
          
          <p className="text-indigo-100 mb-6">
            Accede a todo el contenido, recursos descargables, workshops exclusivos y soporte prioritario.
          </p>
          
          <div className="text-3xl font-bold text-white mb-6">
            $4.99<span className="text-lg text-indigo-200">/mes</span>
          </div>
          
          <button
            onClick={() => router.push("/pro")}
            className="w-full bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
          >
            Actualizar a Premium
          </button>
          
          <p className="text-indigo-200 text-sm mt-4">
            Cancela en cualquier momento
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => router.push(getBackUrl())}
            className="text-white/70 hover:text-white transition-colors"
          >
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}