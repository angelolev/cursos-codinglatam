import { CourseCard } from "@/components/CourseCard";

const courses = [
  {
    title: "Modern React Development",
    description:
      "Master React 18 with hooks, context, and modern best practices",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    level: "Intermediate",
    duration: "8 weeks",
    slug: "javascript",
  },
  {
    title: "TypeScript Fundamentals",
    description:
      "Build type-safe applications with TypeScript and modern tooling",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
    level: "Beginner",
    duration: "6 weeks",
    slug: "javascript",
  },
  {
    title: "Advanced CSS & Tailwind",
    description: "Create stunning user interfaces with modern CSS and Tailwind",
    image:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800",
    level: "Advanced",
    duration: "10 weeks",
    slug: "javascript",
  },
  {
    title: "JavaScript Performance",
    description:
      "Optimize your JavaScript applications for maximum performance",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=800",
    level: "Advanced",
    duration: "8 weeks",
    slug: "javascript",
  },
  {
    title: "Web Accessibility",
    description: "Learn to build inclusive web applications for all users",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=800",
    level: "Intermediate",
    duration: "4 weeks",
    slug: "javascript",
  },
  {
    title: "Next.js & Full Stack",
    description: "Build full-stack applications with Next.js and modern APIs",
    image:
      "https://images.unsplash.com/photo-1561736778-92e52a7769ef?auto=format&fit=crop&q=80&w=800",
    level: "Advanced",
    duration: "12 weeks",
    slug: "javascript",
  },
];

export default function Home() {
  return (
    <>
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white/90 mb-4">
              Nuestros cursos
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Mejora tus habilidades de desarrollo web con nuestros cursos
              impartidos por expertos de la industria
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
