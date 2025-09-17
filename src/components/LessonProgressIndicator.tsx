"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Check, Play, Clock } from "lucide-react";
import { LessonProgress } from "@/types/progress";
import { subscribeToLessonProgress } from "@/utils/progress";

interface LessonProgressIndicatorProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  showTitle?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LessonProgressIndicator({
  courseId,
  lessonId,
  lessonTitle,
  showTitle = true,
  size = "md",
  className = "",
}: LessonProgressIndicatorProps) {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-5 h-5 text-sm",
    lg: "w-6 h-6 text-base",
  };

  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    // Clean up existing listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Set up real-time listener
    const unsubscribe = subscribeToLessonProgress(
      session.user.email,
      courseId,
      lessonId,
      (updatedProgress) => {
        setProgress(updatedProgress);
        if (loading) setLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Listen for course progress updates to refresh lesson indicators
    const handleCourseProgressUpdate = (event: CustomEvent) => {
      if (event.detail.courseId === courseId) {
        // Trigger a refresh of this lesson's progress
        setTimeout(() => {
          // The subscription should automatically pick up changes, but we can trigger a manual refresh
          // if needed by re-setting up the listener
          if (session?.user?.email) {
            const refreshUnsubscribe = subscribeToLessonProgress(
              session.user.email,
              courseId,
              lessonId,
              (refreshedProgress) => {
                setProgress(refreshedProgress);
                refreshUnsubscribe(); // Clean up the refresh listener
              }
            );
          }
        }, 500); // Small delay to ensure Firebase has propagated the changes
      }
    };

    window.addEventListener(
      "courseProgressUpdated",
      handleCourseProgressUpdate as EventListener
    );

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      window.removeEventListener(
        "courseProgressUpdated",
        handleCourseProgressUpdate as EventListener
      );
    };
  }, [session, courseId, lessonId, loading]);

  const getProgressIcon = () => {
    if (loading) {
      return (
        <div
          className={`${sizeClasses[size]} animate-pulse bg-gray-400 rounded-full`}
        />
      );
    }

    if (!progress) {
      return <Play className={`${sizeClasses[size]} text-gray-400`} />;
    }

    if (progress.completed) {
      return (
        <div
          className={`${sizeClasses[size]} bg-green-600 rounded-full flex items-center justify-center`}
        >
          <Check className="w-3 h-3 text-white" />
        </div>
      );
    }

    if (progress.progressPercentage > 0) {
      return <Clock className={`${sizeClasses[size]} text-yellow-500`} />;
    }

    return <Play className={`${sizeClasses[size]} text-gray-400`} />;
  };

  const getProgressText = () => {
    if (loading) return "Cargando...";
    if (!progress) return "No iniciado";
    if (progress.completed) return "Completado";
    if (progress.progressPercentage > 0)
      return `${progress.progressPercentage}% visto`;
    return "No iniciado";
  };

  // Don't render if user is not logged in
  if (!session?.user?.email) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getProgressIcon()}
      {showTitle && (
        <div className="flex flex-col">
          <span className="text-white/90 font-medium">{lessonTitle}</span>
          <span className="text-xs text-gray-400">{getProgressText()}</span>
        </div>
      )}
    </div>
  );
}
