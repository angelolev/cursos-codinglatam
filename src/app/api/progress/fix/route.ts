import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import {
  fixCourseProgressTotalLessons,
  getCourseProgress,
} from "@/utils/progress";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, totalLessons } = await request.json();

    if (!courseId || !totalLessons) {
      return NextResponse.json(
        { error: "courseId and totalLessons are required" },
        { status: 400 }
      );
    }

    const userId = session.user.email;

    // Get current progress
    const currentProgress = await getCourseProgress(userId, courseId);

    // Fix the progress
    const success = await fixCourseProgressTotalLessons(
      userId,
      courseId,
      totalLessons
    );

    if (success) {
      // Get updated progress
      const updatedProgress = await getCourseProgress(userId, courseId);

      return NextResponse.json({
        success: true,
        before: currentProgress,
        after: updatedProgress,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to fix progress" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ API: Fix progress failed:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
