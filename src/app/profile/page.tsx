import React from "react";
import { BookOpen, Award, Crown, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { auth } from "../auth";
import Image from "next/image";
import { getCourses } from "@/utils/common";
import { getUserProgressStats, getUserCourseProgress } from "@/utils/progress";
import ProgressBar from "@/components/ProgressBar";

// Helper function to format watch time
function formatWatchTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return "Hoy";
  if (diffInDays === 1) return "Ayer";
  if (diffInDays < 7) return `Hace ${diffInDays} días`;
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export default async function Profile() {
  const session = await auth();
  const user = session?.user;

  if (!user?.email) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Por favor inicia sesión para ver tu perfil
          </h1>
        </div>
      </main>
    );
  }

  // Fetch user progress data and courses in parallel
  const [progressStats, userCourseProgress, courses] = await Promise.all([
    getUserProgressStats(user.email),
    getUserCourseProgress(user.email),
    getCourses(),
  ]);

  // Combine course progress with course metadata
  const coursesWithProgress = userCourseProgress
    .map((progress) => {
      const courseData = courses?.find(
        (course) => course.slug === progress.courseId
      );
      return {
        ...progress,
        courseData,
      };
    })
    .filter((item) => item.courseData); // Only include courses that exist

  // Sort by last accessed date (most recent first)
  coursesWithProgress.sort(
    (a, b) =>
      new Date(b.lastAccessedAt).getTime() -
      new Date(a.lastAccessedAt).getTime()
  );

  // Get recommended courses (courses not yet started)
  const startedCourseIds = userCourseProgress.map((p) => p.courseId);
  const recommendedCourses =
    courses
      ?.filter((course) => !startedCourseIds.includes(course.slug))
      ?.slice(0, 3) ?? [];

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex-grow">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center">
                <Image
                  src={user?.image || "/default-avatar.png"}
                  alt={user?.name || "User Avatar"}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  width={128}
                  height={128}
                />
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.name}
                </h1>
                <p
                  className={`text-lg font-bold ${
                    user?.isPremium ? "text-green-600" : "text-indigo-600"
                  }`}
                >
                  {user?.isPremium ? "Pro" : "Gratis"}
                </p>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              {/* <div className="space-y-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  {userProfile.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  Joined {new Date(userProfile.joinDate).toLocaleDateString()}
                </div>
              </div> */}

              {/* <div className="border-t border-gray-200 my-6 pt-6">
                <p className="text-gray-600 mb-4">{userProfile.bio}</p>
                <div className="flex space-x-4">
                  <a
                    href={userProfile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                </div>
              </div> */}
              {!user?.isPremium && (
                <Link
                  href="/pro"
                  className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Convertirse en Pro
                </Link>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Progress Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Cursos en Progreso
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {progressStats.coursesInProgress}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Cursos Completados
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {progressStats.coursesCompleted}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Tiempo Total
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatWatchTime(progressStats.totalWatchTime)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Crown className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Progreso Promedio
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {progressStats.averageProgressPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Progress */}
            {coursesWithProgress.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Progreso de Cursos
                </h2>
                <div className="space-y-6">
                  {coursesWithProgress.map((courseProgress) => (
                    <div
                      key={courseProgress.courseId}
                      className="flex items-start"
                    >
                      <div className="relative">
                        <Image
                          src={courseProgress?.courseData?.image || ""}
                          alt={courseProgress?.courseData?.title || ""}
                          width={96}
                          height={64}
                          className="w-24 h-16 object-cover rounded-lg"
                        />
                        {courseProgress.progressPercentage === 100 && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                            <Award className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <Link
                            href={`/cursos/${courseProgress?.courseData?.slug}`}
                            className="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                          >
                            {courseProgress?.courseData?.title}
                          </Link>
                          <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Última vez:{" "}
                              {formatDate(courseProgress.lastAccessedAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="flex-1 mr-4">
                            <ProgressBar
                              progress={courseProgress.progressPercentage}
                              showPercentage={false}
                              color={
                                courseProgress.progressPercentage === 100
                                  ? "success"
                                  : "primary"
                              }
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
                            {courseProgress.progressPercentage}%
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>
                            {courseProgress.completedLessons} de{" "}
                            {courseProgress.totalLessons} lecciones completadas
                          </span>
                          {courseProgress.currentLessonId &&
                            courseProgress.progressPercentage < 100 && (
                              <Link
                                href={`/cursos/${courseProgress?.courseData?.slug}/clases/${courseProgress.currentLessonId}`}
                                className="ml-4 text-indigo-600 hover:text-indigo-700 font-medium"
                              >
                                Continuar →
                              </Link>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Courses */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Te recomendamos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/cursos/${course.slug}`}
                    className="group"
                  >
                    <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-indigo-600">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600">{course.level}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
