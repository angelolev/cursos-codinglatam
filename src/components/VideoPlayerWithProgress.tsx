"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

interface VideoPlayerWithProgressProps {
  guid: string;
  courseSlug: string;
  videoDuration?: number;
  libraryId: string;
  totalCourseLessons?: number;
}

export default function VideoPlayerWithProgress({
  guid,
  courseSlug,
  videoDuration,
  libraryId,
  totalCourseLessons,
}: VideoPlayerWithProgressProps) {
  const { data: session } = useSession();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [watchTime, setWatchTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [origin, setOrigin] = useState('');
  const progressUpdateInterval = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastProgressUpdate = useRef(0);
  const timerFallbackInterval = useRef<NodeJS.Timeout | undefined>(undefined);
  const safetyCompletionInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  // Set origin on client-side only to avoid hydration mismatch
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Update progress every 10 seconds
  const updateProgress = useCallback(async (currentTime: number, completed = false) => {
    // Prevent duplicate completions
    if (completed && lessonCompleted) {
      return;
    }

    if (!session?.user?.email) {
      return;
    }

    const requestData = {
      courseId: courseSlug,
      lessonId: guid,
      watchTime: Math.floor(currentTime),
      totalDuration: videoDuration,
      totalCourseLessons: totalCourseLessons,
      action: completed ? "complete" : "updateWatchTime",
    };

    try {
      const response = await fetch("/api/progress/lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok && completed) {
        setLessonCompleted(true);

        // Clear safety timeout since lesson is now completed
        if (safetyCompletionInterval.current) {
          clearTimeout(safetyCompletionInterval.current);
        }

        // Trigger a course progress refresh by dispatching an event
        window.dispatchEvent(
          new CustomEvent("lessonCompleted", {
            detail: { courseId: courseSlug, lessonId: guid },
          })
        );

        // Also trigger a more aggressive refresh after a delay
        setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent("courseProgressUpdated", {
              detail: { courseId: courseSlug },
            })
          );
        }, 1000);
      }
    } catch {
      // Silent error handling for production
    }
  }, [session, courseSlug, guid, videoDuration, totalCourseLessons, lessonCompleted, safetyCompletionInterval]);

  // Timer-based fallback watch time tracking
  const startTimerFallback = useCallback(() => {
    setIsVideoPlaying(true);

    timerFallbackInterval.current = setInterval(() => {
      if (isVideoPlaying) {
        setWatchTime((prev) => {
          const newTime = prev + 1; // Increment by 1 second

          // Update progress every 30 seconds
          if (newTime % 30 === 0 && newTime > 0) {
            updateProgress(newTime);
          }

          // Check for auto-completion based on video duration or reasonable watch time
          if (videoDuration && newTime >= videoDuration * 0.9) {
            updateProgress(newTime, true);
          } else if (!videoDuration && newTime >= 90) {
            // Auto-complete after 90 seconds when duration is unknown
            updateProgress(newTime, true);
          }

          return newTime;
        });
      }
    }, 1000); // Update every second
  }, [isVideoPlaying, videoDuration, updateProgress]);

  // Listen for iframe messages to track video progress
  useEffect(() => {
    let hasReceivedEvents = false;

    const handleMessage = (event: MessageEvent) => {
      // Check if message is from bunny.net iframe
      const isFromBunny =
        event.origin.includes("mediadelivery.net") ||
        event.origin.includes("bunnycdn.com") ||
        event.origin.includes("b-cdn.net");

      const isFromLocalhost =
        event.origin.includes("localhost") ||
        event.origin.includes("127.0.0.1");

      if (!isFromBunny && !isFromLocalhost) {
        return;
      }

      hasReceivedEvents = true;

      try {
        let data = event.data;

        // Handle string data (some players send JSON strings)
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch {
            // If it's not JSON, treat as plain string
          }
        }

        // Handle different message formats
        const eventType = data?.type || data?.event || data?.action || data;
        let currentTime =
          data?.currentTime || data?.time || data?.position || 0;

        // Convert time to number if it's a string
        if (typeof currentTime === "string") {
          currentTime = parseFloat(currentTime) || 0;
        }

        // Handle ready event - start aggressive completion timer
        if (eventType === "ready") {
          // Start a more aggressive completion timer since timeupdate events may not work
          setTimeout(() => {
            if (!lessonCompleted) {
              updateProgress(videoDuration || 60, true);
            }
          }, 60000); // Complete after 1 minute of video being ready
        }

        if (
          eventType === "timeupdate" ||
          eventType === "progress" ||
          eventType === "time"
        ) {
          setWatchTime(currentTime);

          // Update progress every 10 seconds or if significant jump
          if (
            currentTime - lastProgressUpdate.current >= 10 ||
            Math.abs(currentTime - lastProgressUpdate.current) > 30
          ) {
            updateProgress(currentTime);
            lastProgressUpdate.current = currentTime;
          }

          // Auto-complete when near end (even with video events)
          if (videoDuration && currentTime >= videoDuration * 0.75) {
            updateProgress(currentTime, true);
          } else if (!videoDuration && currentTime >= 90) {
            updateProgress(currentTime, true);
          }
        }

        if (
          eventType === "ended" ||
          eventType === "end" ||
          eventType === "finish"
        ) {
          updateProgress(currentTime || watchTime, true);
        }

        if (
          eventType === "play" ||
          eventType === "playing" ||
          eventType === "start"
        ) {
          setIsTracking(true);
        }

        if (eventType === "pause" || eventType === "paused") {
          updateProgress(currentTime || watchTime);
        }
      } catch {
        // Silent error handling for production
      }
    };

    window.addEventListener("message", handleMessage);

    // Set a timer to check for event detection
    const eventDetectionTimer = setTimeout(() => {
      if (!hasReceivedEvents) {
        startTimerFallback();
      }
    }, 15000); // Wait 15 seconds to give more time for events

    // Try to communicate with iframe after it loads
    const iframeCommunicationTimer = setTimeout(() => {
      if (iframeRef.current?.contentWindow) {
        try {
          // Try to request player state
          iframeRef.current.contentWindow.postMessage({ type: "ping" }, "*");
          iframeRef.current.contentWindow.postMessage(
            { type: "getPlayerState" },
            "*"
          );
          iframeRef.current.contentWindow.postMessage(
            { type: "getCurrentTime" },
            "*"
          );
        } catch {
          // Silent error handling
        }
      }
    }, 3000); // Try communication after 3 seconds

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(eventDetectionTimer);
      clearTimeout(iframeCommunicationTimer);
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
      if (timerFallbackInterval.current) {
        clearInterval(timerFallbackInterval.current);
      }
      if (safetyCompletionInterval.current) {
        clearTimeout(safetyCompletionInterval.current);
      }
    };
  }, [guid, courseSlug, videoDuration, watchTime, session, lessonCompleted, updateProgress, startTimerFallback]);

  // Track lesson access when component mounts and initialize course progress
  useEffect(() => {
    const initializeProgress = async () => {
      if (session?.user?.email && totalCourseLessons) {
        try {
          const initData = {
            courseId: courseSlug,
            lessonId: guid,
            watchTime: 0,
            totalCourseLessons: totalCourseLessons,
            action: "updateProgress",
          };

          await fetch("/api/progress/lesson", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(initData),
          });
        } catch {
          // Silent error handling
        }
      }
    };

    initializeProgress();

    // Safety completion mechanism - ensures lesson gets completed after reasonable time
    safetyCompletionInterval.current = setTimeout(() => {
      if (!lessonCompleted) {
        updateProgress(videoDuration || 30, true);
      }
    }, 120000); // 2 minutes safety timeout
  }, [session, guid, courseSlug, totalCourseLessons, lessonCompleted, videoDuration, updateProgress]);

  // Periodic progress updates while playing
  useEffect(() => {
    if (isTracking) {
      progressUpdateInterval.current = setInterval(() => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          // Request current time from iframe
          iframe.contentWindow.postMessage({ type: "getCurrentTime" }, "*");
        }
      }, 30000); // Update every 30 seconds while playing
    } else {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    }

    return () => {
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    };
  }, [isTracking]);

  return (
    <div className="w-full mb-8">
      <div className="w-full relative overflow-hidden bg-gray-800 rounded aspect-video">
        <iframe
          ref={iframeRef}
          src={`https://iframe.mediadelivery.net/embed/${libraryId}/${guid}?autoplay=false&loop=false&muted=false&preload=false&responsive=true&postMessage=true&controls=true&origin=${encodeURIComponent(origin)}`}
          loading="lazy"
          style={{
            border: 0,
            position: "absolute",
            top: 0,
            height: "100%",
            width: "100%",
          }}
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
          allowFullScreen
        />
      </div>

    </div>
  );
}
