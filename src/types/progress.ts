export interface LessonProgress {
  lessonId: string;
  courseId: string;
  completed: boolean;
  watchTime: number; // in seconds
  totalDuration?: number; // in seconds
  completedAt?: string; // ISO date string
  lastAccessedAt: string; // ISO date string
  progressPercentage: number; // 0-100
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number; // 0-100
  startedAt: string; // ISO date string
  lastAccessedAt: string; // ISO date string
  completedAt?: string; // ISO date string when 100% complete
  currentLessonId?: string; // last watched lesson
}

export interface UserProgress {
  userId: string;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalWatchTime: number; // in seconds
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ProgressUpdate {
  courseId: string;
  lessonId: string;
  watchTime?: number;
  completed?: boolean;
  progressPercentage?: number;
}

export interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  totalWatchTime: number;
  averageProgressPercentage: number;
  coursesInProgress: number;
  coursesCompleted: number;
}