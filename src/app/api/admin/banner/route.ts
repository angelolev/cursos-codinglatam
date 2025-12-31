import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { auth } from "@/app/auth";
import sanitizeHtml from 'sanitize-html';

const ADMIN_EMAIL = "angelokta7@gmail.com";
const BANNER_DOC_PATH = "config/banner";

// GET - Fetch banner config (public)
export async function GET() {
  try {
    const docRef = doc(db, BANNER_DOC_PATH);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({
        banner: {
          message: "",
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    const data = docSnap.data();
    return NextResponse.json({
      banner: {
        id: docSnap.id,
        message: data.message,
        isActive: data.isActive,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      },
    });
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// PUT - Update banner config (admin only)
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    const { message, isActive } = await request.json();

    // Sanitize HTML on backend (security layer)
    const sanitizedMessage = sanitizeHtml(message, {
      allowedTags: ['p', 'strong', 'em', 'b', 'i', 'span'],
      allowedAttributes: {}
    });

    if (typeof sanitizedMessage !== "string" || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Invalid fields - message must be string and isActive must be boolean" },
        { status: 400 }
      );
    }

    const docRef = doc(db, BANNER_DOC_PATH);
    const now = new Date();

    await setDoc(
      docRef,
      {
        message: sanitizedMessage,
        isActive,
        updatedAt: now,
        createdAt: now,
      },
      { merge: true }
    );

    return NextResponse.json({
      message: "Banner updated successfully",
      banner: { message: sanitizedMessage, isActive, updatedAt: now },
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}
