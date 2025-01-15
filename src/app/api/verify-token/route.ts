import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";
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

interface VerifyTokenRequest {
  token: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (request.headers.get("x-internal-request") !== "true") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { token }: VerifyTokenRequest = await request.json();

  try {
    const decodedToken = await getAuth().verifySessionCookie(token);

    // If the user is not premium, return a redirection status and URL
    if (!decodedToken.isPremium) {
      return NextResponse.json({ redirectUrl: "/pro" }, { status: 302 });
    }

    return NextResponse.json(decodedToken, { status: 200 });
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
