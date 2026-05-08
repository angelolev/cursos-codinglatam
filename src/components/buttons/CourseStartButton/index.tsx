"use client";
import { Play } from "lucide-react";
import Link from "next/link";
import LoginButton from "../LoginButton";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface CourseStartButtonProps {
  courseSlug: string;
  lessonGuids: string[];
}

export default function CourseStartButton({
  courseSlug,
  lessonGuids,
}: CourseStartButtonProps) {
  const { data: session } = useSession();
  const [completedLessons, setCompletedLessons] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!session?.user?.email) {
      setLoaded(true);
      return;
    }

    let cancelled = false;
    fetch(`/api/progress/course/${courseSlug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (typeof data?.progress?.completedLessons === "number") {
          setCompletedLessons(data.progress.completedLessons);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email, courseSlug]);

  if (!session) {
    return (
      <div className="flex flex-col text-center gap-2">
        <LoginButton />
        <p className="text-xs text-gray-600">
          Inicia sesión para acceder a las primeras 2 lecciones gratis
        </p>
      </div>
    );
  }

  let targetGuid = lessonGuids[0];
  let label = "Empezar curso";

  if (loaded && completedLessons > 0) {
    const nextIndex = Math.min(completedLessons, lessonGuids.length - 1);
    targetGuid = lessonGuids[nextIndex];
    label = "Continuar curso";
  }

  return (
    <Link
      href={`/cursos/${courseSlug}/clases/${targetGuid}`}
      className="w-full bg-primary-300 text-white px-6 py-3 rounded-md hover:bg-primary-400 transition-colors flex items-center justify-center"
    >
      <Play className="h-5 w-5 mr-2" />
      {label}
    </Link>
  );
}
