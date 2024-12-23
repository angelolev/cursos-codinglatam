import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
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

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json();
  const idToken: string = body.idToken;

  if (!idToken) {
    return NextResponse.json(
      { message: "Token not provided" },
      { status: 400 }
    );
  }

  try {
    // Verify the ID token and create a session cookie
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await getAuth().createSessionCookie(idToken, {
      expiresIn,
    });

    // Set the cookie securely
    const response = NextResponse.json({
      message: "Cookie established successfully",
    });
    response.cookies.set("auth-token", sessionCookie, {
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: expiresIn / 1000,
    });

    return response;
  } catch (error) {
    console.error("Error generating cookie:", error);
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
