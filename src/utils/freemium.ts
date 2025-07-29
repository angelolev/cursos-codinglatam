/**
 * Freemium access utilities for course content
 */

export const FREE_LESSON_LIMIT = 4;

/**
 * Check if a lesson is free based on its index (0-based)
 */
export function isLessonFree(lessonIndex: number): boolean {
  return lessonIndex < FREE_LESSON_LIMIT;
}

/**
 * Get the number of free lessons available
 */
export function getFreeLessonLimit(): number {
  return FREE_LESSON_LIMIT;
}

/**
 * Check if a user can access a specific lesson
 */
export function canAccessLesson(lessonIndex: number, isPremium: boolean): boolean {
  // Premium users can access all lessons
  if (isPremium) {
    return true;
  }
  
  // Non-premium users can only access first 4 lessons
  return isLessonFree(lessonIndex);
}

/**
 * Get the lesson index from a GUID in an ordered lesson list
 */
export function getLessonIndex(lessons: Array<{ guid: string }>, currentGuid: string): number {
  return lessons.findIndex(lesson => lesson.guid === currentGuid);
}

/**
 * Get access status for a lesson
 */
export function getLessonAccessStatus(lessonIndex: number, isPremium: boolean): {
  canAccess: boolean;
  isFree: boolean;
  requiresUpgrade: boolean;
} {
  const isFree = isLessonFree(lessonIndex);
  const canAccess = canAccessLesson(lessonIndex, isPremium);
  
  return {
    canAccess,
    isFree,
    requiresUpgrade: !canAccess && !isPremium
  };
}

/**
 * Get freemium status message for UI
 */
export function getFreemiumMessage(lessonIndex: number, isPremium: boolean): string {
  if (isPremium) {
    return "Disponible con tu suscripción Pro";
  }
  
  if (isLessonFree(lessonIndex)) {
    return "Lección gratuita";
  }
  
  return `Lección ${lessonIndex + 1} - Requiere suscripción Pro`;
}