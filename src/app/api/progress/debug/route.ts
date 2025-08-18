import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    const userId = session.user.email;

    // Get all lessons for this course
    const lessonsQuery = query(
      collection(db, "users", userId, "progress", courseId, "lessons")
    );
    const lessonsSnap = await getDocs(lessonsQuery);
    const lessons = lessonsSnap.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    // Count completed lessons
    const completedLessons = lessons.filter(
      (lesson) => lesson.data.completed
    ).length;

    return NextResponse.json({
      success: true,
      courseId,
      userId,
      totalLessons: lessons.length,
      completedLessons,
      lessons: lessons.map((lesson) => ({
        id: lesson.id,
        completed: lesson.data.completed || false,
        progressPercentage: lesson.data.progressPercentage || 0,
        watchTime: lesson.data.watchTime || 0,
        completedAt: lesson.data.completedAt || null,
        lastAccessedAt: lesson.data.lastAccessedAt || null,
      })),
    });
  } catch (error) {
    console.error("❌ API: Debug progress failed:", error);

    if (error instanceof Error) {
      console.error("❌ API: Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
