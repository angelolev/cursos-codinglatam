"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { CourseProgress } from "@/types/progress";
import ProgressBar from "./ProgressBar";
import { BookOpen, Clock, CheckCircle, RefreshCw } from "lucide-react";
import { subscribeToCourseProgress } from "@/utils/progress";

interface CourseProgressCardProps {
  courseId: string;
  courseTitle: string;
  className?: string;
}

export default function CourseProgressCard({
  courseId,
  courseTitle,
  className = "",
}: CourseProgressCardProps) {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const fetchProgress = useCallback(async (showRefreshLoader = false) => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    if (showRefreshLoader) setRefreshing(true);

    try {
      const response = await fetch(`/api/progress/course/${courseId}`);

      if (response.ok) {
        const data = await response.json();

        if (data.progress) {
          setProgress(data.progress);
        } else {
          setProgress(null);
        }
        setError(null);
      } else {
        console.error("❌ Progress fetch failed:", response.status);
        setError(`Failed to fetch progress: ${response.status}`);
      }
    } catch (error) {
      console.error("❌ Error fetching course progress:", error);
      setError("Network error while fetching progress");
    } finally {
      setLoading(false);
      if (showRefreshLoader) setRefreshing(false);
    }
  }, [session?.user?.email, courseId]);

  const setupRealtimeListener = useCallback(() => {
    if (!session?.user?.email) {
      return;
    }

    // Clean up existing listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Set up new listener with enhanced error handling
    const unsubscribe = subscribeToCourseProgress(
      session.user.email,
      courseId,
      (updatedProgress) => {
        setProgress(updatedProgress);
        setError(null);
        if (loading) setLoading(false);

        // If we received an update, also update the lesson progress indicators
        // by dispatching a custom event
        if (updatedProgress) {
          window.dispatchEvent(
            new CustomEvent("courseProgressUpdated", {
              detail: { courseId, progress: updatedProgress },
            })
          );
        }
      }
    );

    unsubscribeRef.current = unsubscribe;

    // Set up a fallback refresh mechanism in case real-time updates fail
    const fallbackInterval = setInterval(() => {
      fetchProgress();
    }, 30000); // Refresh every 30 seconds as fallback

    // Clean up fallback interval when component unmounts or listener changes
    const originalUnsubscribe = unsubscribeRef.current;
    unsubscribeRef.current = () => {
      originalUnsubscribe?.();
      clearInterval(fallbackInterval);
    };
  }, [session?.user?.email, courseId, fetchProgress, loading]);

  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchProgress();

    // Setup real-time listener
    setupRealtimeListener();

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [session, courseId, fetchProgress, setupRealtimeListener]);

  // Handle page focus to refresh data
  useEffect(() => {
    const handleFocus = () => {
      fetchProgress(true);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProgress(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [courseId, fetchProgress]);

  const handleManualRefresh = () => {
    fetchProgress(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Don't render if user is not logged in
  if (!session?.user?.email) {
    return null;
  }

  if (loading) {
    return (
      <div
        className={`bg-gray-800/50 rounded-lg p-4 animate-pulse ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-gray-700 rounded flex-1"></div>
          <div className="w-4 h-4 bg-gray-700 rounded ml-2"></div>
        </div>
        <div className="h-2 bg-gray-700 rounded mb-4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-900/20 border border-red-600/30 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white">{courseTitle}</h3>
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="p-1 text-red-400 hover:text-red-300 disabled:opacity-50"
            title="Retry loading progress"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <div className="text-red-400 text-sm">❌ {error}</div>
        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="mt-2 text-xs text-red-300 hover:text-red-200 disabled:opacity-50"
        >
          Click to retry
        </button>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className={`bg-gray-800/50 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white">{courseTitle}</h3>
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="p-1 text-gray-400 hover:text-gray-300 disabled:opacity-50"
            title="Refresh progress"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <BookOpen className="w-4 h-4" />
          <span>Curso no iniciado</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white">{courseTitle}</h3>
        <div className="flex items-center gap-2">
          {progress.progressPercentage === 100 && (
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          )}
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="p-1 text-gray-400 hover:text-gray-300 disabled:opacity-50"
            title="Refresh progress"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <ProgressBar
        progress={progress.progressPercentage}
        className="mb-3"
        showPercentage
        color={progress.progressPercentage === 100 ? "success" : "primary"}
      />

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>
              {progress.completedLessons}/{progress.totalLessons} clases
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Última vez: {formatDate(progress.lastAccessedAt)}</span>
          </div>
        </div>
      </div>

      {progress.progressPercentage === 100 && progress.completedAt && (
        <div className="mt-2 text-xs text-green-400">
          ✓ Completado el {formatDate(progress.completedAt)}
        </div>
      )}
    </div>
  );
}
