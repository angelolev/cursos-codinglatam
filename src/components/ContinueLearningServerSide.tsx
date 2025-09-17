import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, Play, ChevronRight } from "lucide-react";
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
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Continúa aprendiendo
            </h2>
            <p className="text-gray-300">
              Retoma donde lo dejaste y sigue progresando
            </p>
          </div>
          <Play className="w-8 h-8 text-blue-400" />
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
                <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-600/30 hover:border-blue-500/50 transition-all hover:bg-gray-700/80 hover:shadow-lg">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-gray-600/50">
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
                          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-300 transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
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
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors ml-2" />
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
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors inline-flex items-center gap-1 "
          >
            Ver todos los cursos
            <span className="transition-all">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
