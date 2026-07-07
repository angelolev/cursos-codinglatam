import { NextResponse } from "next/server";
import { adminDb } from "@/utils/firebaseAdmin";
import { auth } from "@/app/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "angelokta7@gmail.com";

// POST - Create a certificate.
// Server-side (Admin SDK) so client writes to `certificates` can be denied by
// rules. The certificate `code` is generated on the server.
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    const { studentName, courseName, completionDate, certificateUrl } =
      await request.json();

    if (
      typeof studentName !== "string" ||
      studentName.trim() === "" ||
      typeof courseName !== "string" ||
      courseName.trim() === "" ||
      typeof completionDate !== "string" ||
      completionDate.trim() === ""
    ) {
      return NextResponse.json(
        { error: "studentName, courseName and completionDate are required" },
        { status: 400 }
      );
    }

    const code = Math.random().toString(36).substring(2, 10);

    const docRef = await adminDb.collection("certificates").add({
      code,
      studentName: studentName.trim(),
      courseName: courseName.trim(),
      completionDate,
      certificateUrl:
        typeof certificateUrl === "string" && certificateUrl.trim() !== ""
          ? certificateUrl.trim()
          : null,
      isValid: true,
    });

    return NextResponse.json(
      { id: docRef.id, code, message: "Certificate created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json(
      { error: "Failed to create certificate" },
      { status: 500 }
    );
  }
}
