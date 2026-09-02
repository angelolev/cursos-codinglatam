import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, ChevronRight } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { CourseProps } from "@/types/course";

interface RecentCourse {
  courseId: string;
  userId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  currentLessonId?: string;
  course: CourseProps | null;
}

interface ContinueLearningServerSideProps {
  recentCourses: RecentCourse[];
}

export default function ContinueLearningServerSide({
  recentCourses,
}: ContinueLearningServerSideProps) {
  const formatLastAccessed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `Hace ${diffInHours === 0 ? "menos de 1" : diffInHours} hora${
        diffInHours !== 1 ? "s" : ""
      }`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays !== 1 ? "s" : ""}`;
  };

  // Don't render if no recent courses
  if (!recentCourses || recentCourses.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white/90">
            Continúa aprendiendo
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Retoma donde lo dejaste y sigue progresando
          </p>
        </div>

        <div className="grid gap-3">
          {recentCourses.map((courseProgress) => {
            const course = courseProgress.course;
            if (!course) return null;
            return (
              <Link
                key={courseProgress.courseId}
                href={`/cursos/${course.slug}${
                  courseProgress.currentLessonId
                    ? `/clases/${courseProgress.currentLessonId}`
                    : ""
                }`}
                className="group block"
              >
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-primary-400/40 hover:bg-white/[0.06]">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-white/10">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="mb-1 text-lg font-semibold text-white/90 transition-colors group-hover:text-primary-300">
                            {course.title}
                          </h3>
                          <div className="mb-3 flex items-center gap-4 text-sm text-white/55">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>
                                {courseProgress.completedLessons}/
                                {courseProgress.totalLessons} clases
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatLastAccessed(
                                  courseProgress.lastAccessedAt
                                )}
                              </span>
                            </div>
                          </div>
                          <ProgressBar
                            progress={courseProgress.progressPercentage}
                            className="mb-0"
                            showPercentage
                          />
                        </div>
                        <ChevronRight className="ml-2 h-5 w-5 text-white/40 transition-colors group-hover:text-primary-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary-300 transition-colors hover:text-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
          >
            Ver todos los cursos
            <span className="transition-all">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
