// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
    }),
  });
}

// Get all users
export async function GET() {
  try {
    // Get users from Firebase Auth
    const userRecords = await admin.auth().listUsers();

    // Get premium status from custom claims
    const users = await Promise.all(
      userRecords.users.map(async (user) => {
        const { customClaims } = await admin.auth().getUser(user.uid);
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
    const { uid, isPremium } = await request.json();

    await admin.auth().setCustomUserClaims(uid, { isPremium });

    // Update Firestore
    await admin.firestore().collection("users").doc(uid).set(
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
