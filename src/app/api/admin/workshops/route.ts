import { NextResponse } from "next/server";
import { adminDb } from "@/utils/firebaseAdmin";
import { auth } from "@/app/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "angelokta7@gmail.com";

// PUT - Update a workshop's "about" paragraphs.
// Server-side (Admin SDK) so client writes to `workshops` can be denied by rules.
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    const { id, about } = await request.json();

    if (typeof id !== "string" || id.trim() === "") {
      return NextResponse.json(
        { error: "Workshop id is required" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(about) ||
      !about.every((p) => typeof p === "string")
    ) {
      return NextResponse.json(
        { error: "about must be an array of strings" },
        { status: 400 }
      );
    }

    await adminDb.collection("workshops").doc(id).update({ about });

    return NextResponse.json(
      { message: "Workshop updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating workshop:", error);
    return NextResponse.json(
      { error: "Failed to update workshop" },
      { status: 500 }
    );
  }
}
