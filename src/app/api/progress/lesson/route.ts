import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import {
  updateLessonProgress,
  updateWatchTime,
  markLessonCompleted,
} from "@/utils/progress";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      courseId,
      lessonId,
      watchTime,
      totalDuration,
      completed,
      action,
      totalCourseLessons,
    } = body;

    if (!courseId || !lessonId) {
      return NextResponse.json(
        { error: "courseId and lessonId are required" },
        { status: 400 }
      );
    }

    const userId = session.user.email;

    let success = false;

    switch (action) {
      case "complete":
        success = await markLessonCompleted(
          userId,
          courseId,
          lessonId,
          totalDuration,
          totalCourseLessons
        );

        break;

      case "updateWatchTime":
        if (typeof watchTime !== "number") {
          return NextResponse.json(
            { error: "watchTime is required for updateWatchTime action" },
            { status: 400 }
          );
        }

        success = await updateWatchTime(
          userId,
          courseId,
          lessonId,
          watchTime,
          totalDuration,
          totalCourseLessons
        );
        break;

      case "updateProgress":
      default:
        const updateData: Partial<{
          watchTime: number;
          totalDuration: number;
          completed: boolean;
          completedAt: string;
          progressPercentage: number;
        }> = {};
        if (typeof watchTime === "number") updateData.watchTime = watchTime;
        if (typeof totalDuration === "number")
          updateData.totalDuration = totalDuration;
        if (typeof completed === "boolean") {
          updateData.completed = completed;
          if (completed) {
            updateData.completedAt = new Date().toISOString();
            updateData.progressPercentage = 100;
          }
        }

        success = await updateLessonProgress(
          userId,
          courseId,
          lessonId,
          updateData,
          totalCourseLessons
        );
        break;
    }

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to update progress" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ API: Internal server error:", error);

    // Log more details about the error
    if (error instanceof Error) {
      console.error("❌ API: Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const lessonId = searchParams.get("lessonId");

    if (!courseId || !lessonId) {
      return NextResponse.json(
        { error: "courseId and lessonId are required" },
        { status: 400 }
      );
    }

    const userId = session.user.email;
    const { getLessonProgress } = await import("@/utils/progress");
    const progress = await getLessonProgress(userId, courseId, lessonId);

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error getting lesson progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
