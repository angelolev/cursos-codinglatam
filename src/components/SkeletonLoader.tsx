interface SkeletonLoaderProps {
  className?: string;
}

export function CourseSkeleton({ className = "" }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-800/60 rounded-xl shadow-md overflow-hidden">
        {/* Image skeleton */}
        <div className="h-48 w-full bg-gray-700"></div>
        
        {/* Content skeleton */}
        <div className="p-6">
          {/* Title skeleton */}
          <div className="h-6 bg-gray-700 rounded mb-3 w-3/4"></div>
          
          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
          
          {/* Footer skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CourseGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <CourseSkeleton key={index} />
      ))}
    </div>
  );
}

export function SectionSkeleton({ className = "" }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Section header */}
      <div className="text-center mb-24">
        <div className="h-10 bg-gray-700 rounded mx-auto w-96 mb-4"></div>
        <div className="h-6 bg-gray-700 rounded mx-auto w-2/3"></div>
      </div>
      
      {/* Content grid */}
      <CourseGridSkeleton />
    </div>
  );
}

export function HeroSkeleton({ className = "" }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-3xl p-8 sm:p-16 mb-24 border border-gray-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div>
            <div className="h-12 bg-gray-700 rounded mb-6 w-full"></div>
            <div className="space-y-4 mb-8">
              <div className="h-6 bg-gray-700 rounded w-full"></div>
              <div className="h-6 bg-gray-700 rounded w-5/6"></div>
              <div className="h-6 bg-gray-700 rounded w-4/5"></div>
            </div>
            <div className="h-12 bg-gray-700 rounded w-48"></div>
          </div>
          
          {/* Right column */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-gray-800/60 rounded-xl p-6">
                <div className="w-8 h-8 bg-gray-700 rounded mb-3"></div>
                <div className="h-5 bg-gray-700 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}