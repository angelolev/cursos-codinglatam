import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.email;
    const testDocRef = doc(db, "test", `test-${Date.now()}`);

    // Test data
    const testData = {
      userId,
      timestamp: new Date().toISOString(),
      message: "Firebase write test",
    };

    // Try to write to Firebase
    await setDoc(testDocRef, testData);

    // Try to read it back
    const testDoc = await getDoc(testDocRef);
    const readData = testDoc.data();

    return NextResponse.json({
      success: true,
      message: "Firebase connection working",
      testData,
      readData,
    });
  } catch (error) {
    console.error("❌ API: Firebase test failed:", error);

    if (error instanceof Error) {
      console.error("❌ API: Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: "Firebase test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
