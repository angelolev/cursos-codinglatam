"use client";
import { Play } from "lucide-react";
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
      </div>
    );
  }

  if (user && isFree) {
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

  if (!user.isPremium) {
    return (
      <p className="text-indigo-500 text-center">
        Necesitas ser{" "}
        <Link href="/pro" className="font-semibold underline ">
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
