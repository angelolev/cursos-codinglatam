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

// Update a user's premium status (manual admin toggle).
// Writes the Firestore `users` doc via the Admin SDK — auth.ts reads isPremium
// from here — so client writes to `users` can be denied by Firestore rules.
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access only" },
        { status: 403 }
      );
    }

    const { aud, isPremium } = await request.json();

    if (typeof aud !== "string" || aud.trim() === "") {
      return NextResponse.json({ error: "Invalid aud" }, { status: 400 });
    }

    if (typeof isPremium !== "boolean") {
      return NextResponse.json(
        { error: "isPremium must be a boolean" },
        { status: 400 }
      );
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const update = isPremium
      ? {
          isPremium: true,
          premiumSince: now,
          updatedAt: now,
          subscriptionStatus: "active",
        }
      : {
          isPremium: false,
          premiumSince: null,
          updatedAt: now,
          subscriptionStatus: "cancelled",
          subscriptionId: null,
          endsAt: null,
        };

    await adminDb.collection("users").doc(aud).set(update, { merge: true });

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
