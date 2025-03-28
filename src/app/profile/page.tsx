import React from "react";
import { Crown } from "lucide-react";
import Link from "next/link";
import { auth } from "../auth";
import Image from "next/image";
import { getCourses } from "@/utils/common";

const courseProgress = [
  {
    courseId: "modern-react",
    lastViewed: "2024-03-10",
    progress: 75,
    completed: false,
  },
  {
    courseId: "typescript-fundamentals",
    lastViewed: "2024-03-08",
    progress: 100,
    completed: true,
  },
  {
    courseId: "advanced-css",
    lastViewed: "2024-03-05",
    progress: 30,
    completed: false,
  },
];

// function ProgressBar({ progress }: { progress: number }) {
//   return (
//     <div className="w-full bg-gray-200 rounded-full h-2">
//       <div
//         className="bg-indigo-600 h-2 rounded-full"
//         style={{ width: `${progress}%` }}
//       />
//     </div>
//   );
// }

export default async function Profile() {
  const session = await auth();
  const user = session?.user;
  const courses = await getCourses();

  //   const inProgressCourses = courseProgress.map((progress) => ({
  //     ...progress,
  //     course: courses.find((c) => c.id === progress.courseId)!,
  //   }));

  const recommendedCourses =
    courses
      ?.filter(
        (course) => !courseProgress.find((p) => p.courseId === course.id)
      )
      ?.slice(0, 3) ?? [];

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
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
                  {user?.isPremium ? "Pro" : "Free"}
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
            {/* Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Courses in Progress
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {inProgressCourses.filter((c) => !c.completed).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Completed Courses
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {inProgressCourses.filter((c) => c.completed).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Crown className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Membership
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">Free</p>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Course Progress */}
            {/* <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Course Progress
              </h2>
              <div className="space-y-6">
                {inProgressCourses.map(({ course, progress, lastViewed }) => (
                  <div key={course.id} className="flex items-start">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/course/${course.id}`}
                          className="text-lg font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {course.title}
                        </Link>
                        <span className="text-sm text-gray-500">
                          Last viewed{" "}
                          {new Date(lastViewed).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex-1 mr-4">
                          <ProgressBar progress={progress} />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

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
    </div>
  );
}
