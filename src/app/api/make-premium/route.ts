import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
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

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();

    // Verify the request (add your own authentication logic here)
    // For example, verify an admin token or API key

    // Get the user
    const user = await admin.auth().getUser(uid);

    // Set custom claims
    await admin.auth().setCustomUserClaims(uid, {
      isPremium: true,
      premiumSince: new Date().toISOString(),
    });

    // Optionally store in Firestore
    await admin.firestore().collection("users").doc(uid).set(
      {
        isPremium: true,
        premiumSince: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: "Successfully upgraded to premium",
      user: {
        uid: user.uid,
        email: user.email,
        isPremium: true,
      },
    });
  } catch (error) {
    console.error("Error upgrading to premium:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upgrade to premium" },
      { status: 500 }
    );
  }
}
