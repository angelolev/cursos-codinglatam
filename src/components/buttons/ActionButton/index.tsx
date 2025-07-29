"use client";
import { Play } from "lucide-react";
import Link from "next/link";
import LoginButton from "../LoginButton";
import { useSession } from "next-auth/react";

interface ActionButtonProps {
  href: string;
  label: string;
}

export default function ActionButton({ href, label }: ActionButtonProps) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-col text-center gap-2">
        <LoginButton />
        <p className="text-xs text-gray-600">
          Inicia sesión para acceder a las primeras 4 lecciones gratis
        </p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
    >
      <Play className="h-5 w-5 mr-2" />
      {label}
    </Link>
  );
}
