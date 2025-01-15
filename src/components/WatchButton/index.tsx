"use client";
import { useAuth } from "@/app/auth/auth-context";
import { Play } from "lucide-react";
import Link from "next/link";
import { CourseProps } from "@/types/course";
import LoginButton from "../LoginButton";

interface WatchButtonProps {
  href?: string;
  isAvailable: boolean;
  clases: CourseProps[] | null;
}

export default function WatchButton({
  href,
  isAvailable,
  clases,
}: WatchButtonProps) {
  const { user } = useAuth();

  if (!user) {
    return <LoginButton />;
  }

  if ((user && !isAvailable) || (user && !clases)) {
    return (
      <p className="text-primary-300 font-semibold text-xl text-center">
        Próximamente
      </p>
    );
  }

  return (
    <Link
      href={href || ""}
      target="_blank"
      className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
    >
      <Play className="h-5 w-5 mr-2" />
      Empezar curso
    </Link>
  );
}
