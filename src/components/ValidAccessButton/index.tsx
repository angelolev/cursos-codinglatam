"use client";
import { useAuth } from "@/app/auth/auth-context";
import { Play } from "lucide-react";
import Link from "next/link";
import LoginButton from "../LoginButton";

interface ValidAccessButtonProps {
  href: string;
  label: string;
}

export default function ValidAccessButton({
  href,
  label,
}: ValidAccessButtonProps) {
  const { user, isPremium } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col text-center gap-2">
        <LoginButton />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <p className="text-indigo-500 text-center">
        Necesitas ser{" "}
        <Link
          href="https://www.patreon.com/c/codinglatam/membership"
          target="_blank"
          className="font-semibold underline "
        >
          PRO
        </Link>{" "}
        para acceder a este contenido
      </p>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
    >
      <Play className="h-5 w-5 mr-2" />
      {label}
    </Link>
  );
}
