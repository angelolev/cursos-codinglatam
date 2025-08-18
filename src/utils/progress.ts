import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  LessonProgress,
  CourseProgress,
  ProgressStats,
} from "@/types/progress";
import { CourseProps } from "@/types/course";

interface RecentCourseActivity extends CourseProgress {
  course: CourseProps | null;
}

// Get user's progress for a specific course
export async function getCourseProgress(
  userId: string,
  courseId: string
): Promise<CourseProgress | null> {
  try {
    const progressRef = doc(db, "users", userId, "progress", courseId);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      return progressSnap.data() as CourseProgress;
    }
    return null;
  } catch (error) {
    console.error("Error getting course progress:", error);
    return null;
  }
}

// Get user's progress for a specific lesson
export async function getLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string
): Promise<LessonProgress | null> {
  try {
    const lessonRef = doc(
      db,
      "users",
      userId,
      "progress",
      courseId,
      "lessons",
      lessonId
    );
    const lessonSnap = await getDoc(lessonRef);

    if (lessonSnap.exists()) {
      return lessonSnap.data() as LessonProgress;
    }
    return null;
  } catch (error) {
    console.error("Error getting lesson progress:", error);
    return null;
  }
}

// Update lesson progress
export async function updateLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  update: Partial<LessonProgress>,
  totalCourseLessons?: number
): Promise<boolean> {
  console.log('🔧 updateLessonProgress called:', {
    userId,
    courseId,
    lessonId,
    update,
    totalCourseLessons
  });

  try {
    const now = new Date().toISOString();

    // First, update the lesson progress individually to ensure it's saved
    const lessonRef = doc(
      db,
      "users",
      userId,
      "progress",
      courseId,
      "lessons",
      lessonId
    );
    
    const lessonData: Partial<LessonProgress> = {
      ...update,
      lessonId,
      courseId,
      lastAccessedAt: now,
    };

    console.log('📝 Saving lesson data first:', lessonData);
    await setDoc(lessonRef, lessonData, { merge: true });
    console.log('✅ Lesson progress saved successfully');

    // Now get all lessons including the just-updated one to calculate course progress
    const lessonsQuery = query(
      collection(db, "users", userId, "progress", courseId, "lessons")
    );
    const lessonsSnap = await getDocs(lessonsQuery);
    const lessons = lessonsSnap.docs.map((doc) => doc.data() as LessonProgress);
    
    console.log('📊 All lessons after update:', lessons.map(l => ({ 
      id: l.lessonId, 
      completed: l.completed,
      progressPercentage: l.progressPercentage 
    })));

    // Count completed lessons from the fresh data
    const completedLessons = lessons.filter((lesson) => lesson.completed).length;
    
    console.log('🔢 Lesson count details:', {
      totalLessonsInDB: lessons.length,
      completedLessons,
      providedTotalCourseLessons: totalCourseLessons
    });

    // Get existing course progress to use its totalLessons if available
    const currentCourseProgress = await getCourseProgress(userId, courseId);
    
    // Priority order for determining total lessons:
    // 1. Provided totalCourseLessons (most reliable)
    // 2. Current course progress totalLessons
    // 3. Number of lessons in Firebase (least reliable as fallback)
    const totalLessons =
      totalCourseLessons ||
      currentCourseProgress?.totalLessons ||
      lessons.length;

    // Use the determined totalLessons, but ensure it's at least the number of lessons we have in Firebase
    const actualTotalLessons = Math.max(totalLessons, lessons.length);

    console.log('🧮 Total lessons calculation:', {
      providedTotalCourseLessons: totalCourseLessons,
      currentProgressTotalLessons: currentCourseProgress?.totalLessons,
      lessonsInFirebase: lessons.length,
      finalTotalLessons: actualTotalLessons
    });

    console.log('🧮 Progress calculation input:', {
      completedLessons,
      totalLessons,
      actualTotalLessons,
      currentCourseProgress: currentCourseProgress?.progressPercentage
    });

    const progressPercentage =
      actualTotalLessons > 0
        ? Math.round((completedLessons / actualTotalLessons) * 100)
        : 0;

    console.log('📊 Final progress calculation:', {
      completedLessons,
      actualTotalLessons,
      progressPercentage
    });

    // Update course progress
    const courseRef = doc(db, "users", userId, "progress", courseId);
    const courseData: Partial<CourseProgress> = {
      courseId,
      userId,
      totalLessons: actualTotalLessons,
      completedLessons,
      progressPercentage,
      lastAccessedAt: now,
      currentLessonId: lessonId,
    };

    console.log('📈 Course progress data to save:', {
      courseId,
      totalLessons: actualTotalLessons,
      completedLessons,
      progressPercentage,
      calculation: `${completedLessons}/${actualTotalLessons} = ${progressPercentage}%`
    });

    if (progressPercentage === 100) {
      courseData.completedAt = now;
    }

    // Check if this is the first lesson progress for this course
    if (!currentCourseProgress) {
      courseData.startedAt = now;
    }

    console.log('📈 Saving course data:', courseData);
    await setDoc(courseRef, courseData, { merge: true });
    console.log('✅ Course progress saved successfully');

    // Add a small delay to ensure Firebase has processed the updates before returning
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  } catch (error) {
    console.error("❌ Error updating lesson progress:", error);
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error("❌ Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    // Attempt a simple retry for network-related errors
    if (error instanceof Error && (
      error.message.includes('network') || 
      error.message.includes('timeout') ||
      error.message.includes('fetch')
    )) {
      console.log("🔄 Attempting retry due to network error...");
      try {
        // Simple retry - just try to save the lesson progress again
        const retryLessonRef = doc(db, "users", userId, "progress", courseId, "lessons", lessonId);
        const retryLessonData: Partial<LessonProgress> = {
          ...update,
          lessonId,
          courseId,
          lastAccessedAt: new Date().toISOString(),
        };
        await setDoc(retryLessonRef, retryLessonData, { merge: true });
        console.log("✅ Retry successful - lesson progress saved");
        return true;
      } catch (retryError) {
        console.error("❌ Retry failed:", retryError);
      }
    }
    
    return false;
  }
}

// Mark lesson as completed
export async function markLessonCompleted(
  userId: string,
  courseId: string,
  lessonId: string,
  totalDuration?: number,
  totalCourseLessons?: number
): Promise<boolean> {
  console.log("🎯 markLessonCompleted called:", {
    userId,
    courseId,
    lessonId,
    totalDuration,
    totalCourseLessons
  });
  
  const update: Partial<LessonProgress> = {
    completed: true,
    completedAt: new Date().toISOString(),
    progressPercentage: 100,
  };

  if (totalDuration) {
    update.totalDuration = totalDuration;
    update.watchTime = totalDuration;
  }

  console.log("🎯 Lesson completion update data:", update);

  const result = await updateLessonProgress(
    userId,
    courseId,
    lessonId,
    update,
    totalCourseLessons
  );

  console.log("🎯 markLessonCompleted result:", result);
  return result;
}

// Update watch time for a lesson
export async function updateWatchTime(
  userId: string,
  courseId: string,
  lessonId: string,
  watchTime: number,
  totalDuration?: number,
  totalCourseLessons?: number
): Promise<boolean> {
  console.log("🕐 Updating watch time:", {
    userId,
    courseId,
    lessonId,
    watchTime,
    totalDuration,
    totalCourseLessons
  });
  
  const progressPercentage = totalDuration
    ? Math.min(Math.round((watchTime / totalDuration) * 100), 100)
    : 0;
  const completed = progressPercentage >= 90; // Consider completed if 90% watched

  console.log("🕐 Watch time progress check:", {
    watchTime,
    totalDuration,
    progressPercentage,
    completed,
    autoCompleteThreshold: 90
  });

  const update: Partial<LessonProgress> = {
    watchTime,
    progressPercentage,
    completed,
  };

  if (totalDuration) {
    update.totalDuration = totalDuration;
  }

  if (completed) {
    update.completedAt = new Date().toISOString();
    console.log("✅ Auto-marking lesson as completed (90% watched)");
  }

  console.log("📝 Watch time update data:", update);

  return updateLessonProgress(
    userId,
    courseId,
    lessonId,
    update,
    totalCourseLessons
  );
}

// Initialize course progress with correct total lessons
export async function initializeCourseProgress(
  userId: string,
  courseId: string,
  totalLessons: number
): Promise<boolean> {
  try {
    const courseRef = doc(db, "users", userId, "progress", courseId);
    const now = new Date().toISOString();

    const courseData: Partial<CourseProgress> = {
      courseId,
      userId,
      totalLessons,
      completedLessons: 0,
      progressPercentage: 0,
      startedAt: now,
      lastAccessedAt: now,
    };

    await setDoc(courseRef, courseData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error initializing course progress:", error);
    return false;
  }
}

// Fix course progress with correct total lessons count
export async function fixCourseProgressTotalLessons(
  userId: string,
  courseId: string,
  correctTotalLessons: number
): Promise<boolean> {
  try {
    // Get current course progress
    const courseProgress = await getCourseProgress(userId, courseId);
    if (!courseProgress) return false;

    // Get all completed lessons to recalculate percentage
    const lessonsQuery = query(
      collection(db, "users", userId, "progress", courseId, "lessons")
    );
    const lessonsSnap = await getDocs(lessonsQuery);
    const lessons = lessonsSnap.docs.map((doc) => doc.data() as LessonProgress);
    const completedLessons = lessons.filter(
      (lesson) => lesson.completed
    ).length;

    const progressPercentage =
      correctTotalLessons > 0
        ? Math.round((completedLessons / correctTotalLessons) * 100)
        : 0;

    // Update course progress with correct values
    const courseRef = doc(db, "users", userId, "progress", courseId);
    const updateData: Partial<CourseProgress> = {
      totalLessons: correctTotalLessons,
      completedLessons,
      progressPercentage,
      lastAccessedAt: new Date().toISOString(),
    };

    if (progressPercentage === 100 && !courseProgress.completedAt) {
      updateData.completedAt = new Date().toISOString();
    }

    await updateDoc(courseRef, updateData);
    return true;
  } catch (error) {
    console.error("Error fixing course progress:", error);
    return false;
  }
}

// Get all course progress for a user
export async function getUserCourseProgress(
  userId: string
): Promise<CourseProgress[]> {
  try {
    const progressQuery = query(collection(db, "users", userId, "progress"));
    const progressSnap = await getDocs(progressQuery);

    return progressSnap.docs.map((doc) => doc.data() as CourseProgress);
  } catch (error) {
    console.error("Error getting user course progress:", error);
    return [];
  }
}

// Get user progress statistics
export async function getUserProgressStats(
  userId: string
): Promise<ProgressStats> {
  try {
    const courseProgressList = await getUserCourseProgress(userId);

    const totalCourses = courseProgressList.length;
    const completedCourses = courseProgressList.filter(
      (course) => course.progressPercentage === 100
    ).length;
    const coursesInProgress = totalCourses - completedCourses;

    const totalLessons = courseProgressList.reduce(
      (sum, course) => sum + course.totalLessons,
      0
    );
    const completedLessons = courseProgressList.reduce(
      (sum, course) => sum + course.completedLessons,
      0
    );

    const averageProgressPercentage =
      totalCourses > 0
        ? Math.round(
            courseProgressList.reduce(
              (sum, course) => sum + course.progressPercentage,
              0
            ) / totalCourses
          )
        : 0;

    // Calculate total watch time from all lessons
    let totalWatchTime = 0;
    for (const courseProgress of courseProgressList) {
      const lessonsQuery = query(
        collection(
          db,
          "users",
          userId,
          "progress",
          courseProgress.courseId,
          "lessons"
        )
      );
      const lessonsSnap = await getDocs(lessonsQuery);
      const lessons = lessonsSnap.docs.map(
        (doc) => doc.data() as LessonProgress
      );
      totalWatchTime += lessons.reduce(
        (sum, lesson) => sum + (lesson.watchTime || 0),
        0
      );
    }

    return {
      totalLessons,
      completedLessons,
      totalWatchTime,
      averageProgressPercentage,
      coursesInProgress,
      coursesCompleted: completedCourses,
    };
  } catch (error) {
    console.error("Error getting user progress stats:", error);
    return {
      totalLessons: 0,
      completedLessons: 0,
      totalWatchTime: 0,
      averageProgressPercentage: 0,
      coursesInProgress: 0,
      coursesCompleted: 0,
    };
  }
}

// Subscribe to real-time course progress updates
export function subscribeToCourseProgress(
  userId: string,
  courseId: string,
  callback: (progress: CourseProgress | null) => void
) {
  const progressRef = doc(db, "users", userId, "progress", courseId);

  return onSnapshot(
    progressRef,
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as CourseProgress);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error listening to course progress:", error);
      callback(null);
    }
  );
}

// Check if user has started any course
export async function hasStartedAnyCourse(userId: string): Promise<boolean> {
  try {
    const progressQuery = query(collection(db, "users", userId, "progress"));
    const progressSnap = await getDocs(progressQuery);
    
    // Return true if user has any course progress records
    return !progressSnap.empty;
  } catch (error) {
    console.error("Error checking if user started any course:", error);
    return false;
  }
}

// Get recent course activity for a user (server-side)
export async function getRecentCourseActivity(userId: string): Promise<RecentCourseActivity[]> {
  try {
    // Get all course progress for the user
    const allProgress = await getUserCourseProgress(userId);
    
    if (allProgress.length === 0) {
      return [];
    }
    
    // Filter courses accessed in the last 3 days with progress > 0
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const recentActivity = allProgress.filter(progress => {
      const lastAccessed = new Date(progress.lastAccessedAt);
      return lastAccessed > threeDaysAgo && progress.progressPercentage > 0;
    });

    if (recentActivity.length === 0) {
      return [];
    }

    // Sort by most recently accessed
    recentActivity.sort((a, b) => 
      new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
    );

    // Get course details for each recent activity (limit to top 3)
    const { getCourseBySlug } = await import("./common");
    
    const coursesWithDetails = await Promise.all(
      recentActivity.slice(0, 3).map(async (progress) => {
        try {
          const course = await getCourseBySlug(progress.courseId);
          return { ...progress, course };
        } catch (error) {
          console.error(`Error fetching course ${progress.courseId}:`, error);
          return { ...progress, course: null };
        }
      })
    );

    // Filter out courses that couldn't be found
    return coursesWithDetails.filter(course => course.course !== null);
  } catch (error) {
    console.error("Error fetching recent course activity:", error);
    return [];
  }
}

// Subscribe to real-time lesson progress updates
export function subscribeToLessonProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  callback: (progress: LessonProgress | null) => void
) {
  const lessonRef = doc(
    db,
    "users",
    userId,
    "progress",
    courseId,
    "lessons",
    lessonId
  );

  return onSnapshot(
    lessonRef,
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as LessonProgress);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error listening to lesson progress:", error);
      callback(null);
    }
  );
}
