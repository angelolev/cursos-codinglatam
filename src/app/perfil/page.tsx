"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  MapPin,
  Github,
  Linkedin,
  Globe,
  Calendar,
  BookOpen,
  Crown,
  Award,
} from "lucide-react";
import Image from "next/image";

const courses = [
  {
    id: "modern-react",
    title: "Modern React Development",
    description:
      "Master React 18 with hooks, context, and modern best practices",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    level: "Intermediate",
    duration: "8 weeks",
    curriculum: [
      "React 18 Fundamentals",
      "Hooks Deep Dive",
      "Context and State Management",
      "Performance Optimization",
      "Testing React Applications",
      "Real-world Project Development",
    ],
    instructor: "Sarah Johnson",
    price: 299,
  },
  {
    id: "typescript-fundamentals",
    title: "TypeScript Fundamentals",
    description:
      "Build type-safe applications with TypeScript and modern tooling",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
    level: "Beginner",
    duration: "6 weeks",
    curriculum: [
      "TypeScript Basics",
      "Type System Deep Dive",
      "Interfaces and Types",
      "Generics",
      "Decorators",
      "Project Setup and Configuration",
    ],
    instructor: "Michael Chen",
    price: 249,
  },
  {
    id: "advanced-css",
    title: "Advanced CSS & Tailwind",
    description: "Create stunning user interfaces with modern CSS and Tailwind",
    image:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800",
    level: "Advanced",
    duration: "10 weeks",
    curriculum: [
      "Modern CSS Features",
      "Tailwind Fundamentals",
      "Responsive Design",
      "Animations and Transitions",
      "CSS Architecture",
      "Performance Optimization",
    ],
    instructor: "Emma Davis",
    price: 349,
  },
  {
    id: "javascript-performance",
    title: "JavaScript Performance",
    description:
      "Optimize your JavaScript applications for maximum performance",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800",
    level: "Advanced",
    duration: "8 weeks",
    curriculum: [
      "Performance Fundamentals",
      "Memory Management",
      "Rendering Optimization",
      "Network Performance",
      "Build Tools and Bundling",
      "Monitoring and Profiling",
    ],
    instructor: "David Wilson",
    price: 399,
  },
  {
    id: "web-accessibility",
    title: "Web Accessibility",
    description: "Learn to build inclusive web applications for all users",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800",
    level: "Intermediate",
    duration: "4 weeks",
    curriculum: [
      "WCAG Guidelines",
      "Semantic HTML",
      "ARIA Labels",
      "Keyboard Navigation",
      "Screen Readers",
      "Testing Accessibility",
    ],
    instructor: "Lisa Thompson",
    price: 199,
  },
  {
    id: "nextjs-fullstack",
    title: "Next.js & Full Stack",
    description: "Build full-stack applications with Next.js and modern APIs",
    image:
      "https://images.unsplash.com/photo-1561736778-92e52a7769ef?auto=format&fit=crop&q=80&w=800",
    level: "Advanced",
    duration: "12 weeks",
    curriculum: [
      "Next.js Fundamentals",
      "Server Components",
      "API Routes",
      "Database Integration",
      "Authentication",
      "Deployment Strategies",
    ],
    instructor: "Alex Rodriguez",
    price: 499,
  },
];

const recommendedCourses = courses.slice(0, 3);

interface FormData {
  name: string;
  github: string;
  email: string;
  isPremium: boolean;
  premiumSince: Date | null;
  updatedAt: Date | null;
}

export default function CompleteProfile() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    github: "",
    email: session?.user?.email || "",
    isPremium: false,
    premiumSince: null,
    updatedAt: null,
  });

  useEffect(() => {
    // if (!user) {
    //   router.push("/login");
    //   return;
    // }

    const fetchUserData = async () => {
      try {
        if (!session?.user?.aud) {
          throw new Error("User ID is undefined");
        }

        const docRef = doc(db, "users", session.user.aud);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFormData({
            name: userData.name || "",
            github: userData.github || "",
            email: session.user.email || "",
            isPremium: userData.isPremium || false,
            premiumSince: userData.premiumSince || null,
            updatedAt: userData.updatedAt || null,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Swal.fire({
          icon: "error",
          text: "Error al cargar los datos del usuario",
        });
      }
    };

    fetchUserData();
  }, [session?.user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateReviewName = async (userUid: string, name: string) => {
    const reviewsRef = collection(db, "reviews");

    try {
      const querySnapshot = await getDocs(reviewsRef);
      const updatePromises = querySnapshot.docs
        .filter((doc) => doc.id.includes(userUid))
        .map(async (docSnapshot) => {
          const docRef = doc(db, "reviews", docSnapshot.id);
          try {
            await updateDoc(docRef, {
              name: name,
            });
          } catch (updateError) {
            console.error(
              `Error actualizando documento ${docSnapshot.id}:`,
              updateError
            );
          }
        });
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error en la operación:", error);
    }
  };

  const updateCommetsName = async (userUid: string, name: string) => {
    const commentsRef = collection(db, "comments");

    try {
      const querySnapshot = await getDocs(commentsRef);
      const updatePromises = querySnapshot.docs
        .filter((doc) => doc.id.includes(userUid))
        .map(async (docSnapshot) => {
          const docRef = doc(db, "comments", docSnapshot.id);
          try {
            await updateDoc(docRef, {
              name: name,
            });
          } catch (updateError) {
            console.error(
              `Error actualizando documento ${docSnapshot.id}:`,
              updateError
            );
          }
        });
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error en la operación:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;

    const requiredStringFields = {
      name: formData.name,
    };

    const isFormValid = Object.values(requiredStringFields).every(
      (value) => value && value.trim() !== ""
    );

    if (!isFormValid) {
      Swal.fire({
        icon: "warning",
        text: "Por favor, complete todos los campos",
      });
      return;
    }

    try {
      setLoading(true);
      if (session?.user?.aud) {
        await setDoc(doc(db, "users", session.user.aud), formData);
      } else {
        throw new Error("User ID is undefined");
      }
      await updateReviewName(session?.user?.aud, `${formData.name}`);
      await updateCommetsName(session?.user?.aud, `${formData.name}`);
      await Swal.fire({
        icon: "success",
        text: "Perfil actualizado correctamente",
      });
      router.push("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Ocurrió un error al actualizar el perfil",
      });
      console.error("Error updating profile: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-t-4 border-primary-300 border-solid rounded-full animate-spin"></div>
          <p className="text-white text-lg">Cargando...</p>
        </div>
      </div>
    );

  return (
    // <div className="p-8 max-w-md mx-auto">
    //   <h1 className="text-2xl font-bold mb-6 text-white/90">Mi Perfil</h1>
    //   <form onSubmit={handleSubmit} className="space-y-6">
    //     <div>
    //       <div className="flex items-center gap-4 mb-6">
    //         <span className="text-sm text-gray-400">Suscripción:</span>
    //         <span
    //           className={
    //             session?.user?.isPremium
    //               ? "bg-blue-500 text-white px-2 py-1 rounded-lg"
    //               : "bg-green-500 text-white px-2 py-1 rounded-lg"
    //           }
    //         >
    //           {session?.user?.isPremium ? "Pro" : "Gratuita"}
    //         </span>
    //         {!session?.user?.isPremium && (
    //           <Link
    //             href="/pro"
    //             className="text-indigo-500 underline underline-offset-4"
    //           >
    //             Ser Pro
    //           </Link>
    //         )}
    //       </div>
    //       <label className="block text-sm font-medium text-gray-400 mb-2">
    //         Nombre
    //       </label>
    //       <input
    //         type="text"
    //         name="name"
    //         maxLength={50}
    //         value={formData.name}
    //         onChange={handleChange}
    //         className="w-full px-3 py-2 text-white bg-[#3a3f45] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
    //       />
    //     </div>
    //     <div>
    //       <label className="block text-sm font-medium text-gray-400 mb-2">
    //         GitHub
    //       </label>
    //       <input
    //         type="url"
    //         name="github"
    //         maxLength={100}
    //         value={formData.github}
    //         onChange={handleChange}
    //         className="w-full px-3 py-2 text-white bg-[#3a3f45] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
    //       />
    //     </div>
    //     <button
    //       type="submit"
    //       className="w-full bg-primary-300 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-400 transition-colors"
    //     >
    //       Guardar Perfil
    //     </button>
    //   </form>
    // </div>
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center mb-6">
                <Image
                  src={session?.user.image || "/default-avatar.png"}
                  alt={session?.user.name || "User avatar"}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  width={128}
                  height={128}
                />
                <h1 className="text-2xl font-bold text-gray-900">
                  {session?.user.name}
                </h1>
                <p className="text-gray-600">{session?.user.email}</p>
              </div>

              <div className="space-y-4 text-gray-600">
                {/* <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  {userProfile.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  Joined {new Date(userProfile.joinDate).toLocaleDateString()}
                </div> */}
              </div>

              <div className="border-t border-gray-200 my-6 pt-6">
                {/* <p className="text-gray-600 mb-4">{userProfile.bio}</p> */}
                {/* <div className="flex space-x-4">
                  <a
                    href={userProfile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                  <a
                    href={userProfile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a
                    href={userProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Globe className="h-6 w-6" />
                  </a>
                </div> */}
              </div>

              <Link
                href="/pro"
                className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Crown className="h-5 w-5 mr-2" />
                {session?.user.isPremium ? "Eres Pro" : "Upgrade to Pro"}
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Cursos en progreso
                    </p>
                    {/* <p className="text-2xl font-semibold text-gray-900">
                      {inProgressCourses.filter((c) => !c.completed).length}
                    </p> */}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Cursos Completados
                    </p>
                    {/* <p className="text-2xl font-semibold text-gray-900">
                      {inProgressCourses.filter((c) => c.completed).length}
                    </p> */}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center">
                  <Crown className="h-8 w-8 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Membresía
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {session?.user.isPremium ? "Pro" : "Gratuita"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                          to={`/course/${course.id}`}
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
                    href={`/course/${course.id}`}
                    className="group"
                  >
                    <div className="aspect-video w-full rounded-lg overflow-hidden mb-3">
                      <Image
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        width={150}
                        height={150}
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
