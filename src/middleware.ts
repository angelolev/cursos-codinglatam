// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  try {
    // Get the Firebase ID token from the session cookie
    const sessionCookie = request.cookies.get("session")?.value;

    // If no session cookie, check for Authorization header (for API routes)
    const authHeader = request.headers.get("Authorization");

    let decodedToken;

    if (sessionCookie) {
      // Verify session cookie
      decodedToken = await admin
        .auth()
        .verifySessionCookie(sessionCookie, true);
    } else if (authHeader?.startsWith("Bearer ")) {
      // Verify Firebase ID token from Authorization header
      const idToken = authHeader.split("Bearer ")[1];
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } else {
      // No valid authentication found
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check admin routes
    if (pathname.startsWith("/admin")) {
      const ADMIN_EMAILS = ["your-admin@email.com"];
      if (!ADMIN_EMAILS.includes(decodedToken.email || "")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Check premium routes
    if (pathname.startsWith("/cursos")) {
      const isPremium = decodedToken.customClaims?.isPremium;
      if (!isPremium) {
        return NextResponse.redirect(new URL("/upgrade", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/cursos/:path*",
    // Add other protected routes
  ],
};
