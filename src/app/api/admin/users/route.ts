// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { adminAuth, adminDb, admin } from "@/utils/firebaseAdmin";
import { auth } from "@/app/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "angelokta7@gmail.com";

// Get all users
export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    // Get users from Firebase Auth
    const userRecords = await adminAuth.listUsers();

    // Get premium status from custom claims
    const users = await Promise.all(
      userRecords.users.map(async (user) => {
        const { customClaims } = await adminAuth.getUser(user.uid);
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isPremium: customClaims?.isPremium || false,
          createdAt: user.metadata.creationTime,
        };
      })
    );

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Update premium status
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    const { uid, isPremium } = await request.json();

    if (typeof uid !== "string" || uid.trim() === "") {
      return NextResponse.json(
        { error: "Invalid uid" },
        { status: 400 }
      );
    }

    if (typeof isPremium !== "boolean") {
      return NextResponse.json(
        { error: "isPremium must be a boolean" },
        { status: 400 }
      );
    }

    await adminAuth.setCustomUserClaims(uid, { isPremium });

    // Update Firestore
    await adminDb.collection("users").doc(uid).set(
      {
        isPremium,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: `User premium status updated to ${isPremium}`,
    });
  } catch (error) {
    console.error("Error updating premium status:", error);
    return NextResponse.json(
      { error: "Failed to update premium status" },
      { status: 500 }
    );
  }
}
