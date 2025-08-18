import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import { db } from "@/utils/firebase";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await request.json();

    const userId = session.user.email;
    let deletedItems = 0;

    try {
      // If courseId is provided, delete only that course's progress
      if (courseId) {
        // Delete all lessons progress for this course
        const lessonsQuery = query(
          collection(db, "users", userId, "progress", courseId, "lessons")
        );
        const lessonsSnap = await getDocs(lessonsQuery);

        for (const lessonDoc of lessonsSnap.docs) {
          await deleteDoc(lessonDoc.ref);
          deletedItems++;
        }

        // Delete course progress
        const courseRef = doc(db, "users", userId, "progress", courseId);
        await deleteDoc(courseRef);
        deletedItems++;
      } else {
        // Delete ALL progress for user

        const progressQuery = query(
          collection(db, "users", userId, "progress")
        );
        const progressSnap = await getDocs(progressQuery);

        for (const courseDoc of progressSnap.docs) {
          // Delete all lessons for this course
          const lessonsQuery = query(
            collection(db, "users", userId, "progress", courseDoc.id, "lessons")
          );
          const lessonsSnap = await getDocs(lessonsQuery);

          for (const lessonDoc of lessonsSnap.docs) {
            await deleteDoc(lessonDoc.ref);
            deletedItems++;
          }

          // Delete course progress
          await deleteDoc(courseDoc.ref);
          deletedItems++;
        }
      }

      return NextResponse.json({
        success: true,
        message: courseId
          ? `Progress reset for course: ${courseId}`
          : "All progress reset",
        deletedItems,
      });
    } catch (deleteError) {
      console.error("❌ Error during deletion:", deleteError);
      throw deleteError;
    }
  } catch (error) {
    console.error("❌ API: Reset progress failed:", error);

    return NextResponse.json(
      {
        error: "Failed to reset progress",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
