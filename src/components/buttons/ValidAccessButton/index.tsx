"use client";
import { Play, Crown, Gift } from "lucide-react";
import Link from "next/link";
import LoginButton from "../LoginButton";
import { useSession } from "next-auth/react";

interface ValidAccessButtonProps {
  href: string;
  label: string;
  isFree: boolean;
}

export default function ValidAccessButton({
  href,
  label,
  isFree,
}: ValidAccessButtonProps) {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex flex-col text-center gap-2">
        <LoginButton />
        <p className="text-xs text-gray-600 flex items-center justify-center">
          {isFree ? (
            <>
              <Gift className="h-4 w-4 mr-1" />
              Contenido gratuito disponible después del login
            </>
          ) : (
            <>
              <Crown className="h-4 w-4 mr-1" />
              Contenido premium - Requiere suscripción
            </>
          )}
        </p>
      </div>
    );
  }

  if (user && isFree) {
    return (
      <div className="space-y-2">
        <Link
          href={href}
          target="_blank"
          className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
        >
          <Play className="h-5 w-5 mr-2" />
          {label}
        </Link>
        <div className="flex items-center justify-center text-sm text-green-700">
          <Gift className="h-3 w-3 mr-1" />
          <span>Contenido gratuito</span>
        </div>
      </div>
    );
  }

  if (!user.isPremium) {
    return (
      <div className="space-y-4">
        <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <Crown className="h-8 w-8 text-amber-600 mx-auto mb-2" />
          <p className="text-amber-800 font-semibold mb-2">Contenido Premium</p>
          <p className="text-amber-700 text-sm mb-3">
            Este contenido requiere una suscripción Pro para acceder.
          </p>
          <Link
            href="/pro"
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm font-semibold"
          >
            <Crown className="h-4 w-4 mr-2" />
            Actualizar a Pro
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Link
        href={href}
        target="_blank"
        className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
      >
        <Play className="h-5 w-5 mr-2" />
        {label}
      </Link>
      <div className="flex items-center justify-center text-xs text-indigo-700">
        <Crown className="h-3 w-3 mr-1" />
        <span>Incluido en tu suscripción Pro</span>
      </div>
    </div>
  );
}
