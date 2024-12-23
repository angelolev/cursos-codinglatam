import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  console.log(token, "tokencillo");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the token using Firebase Admin
    // await auth().verifyIdToken(token);
    return NextResponse.next();
  } catch {
    // Token is invalid or expired
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth-token");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/clases/:path*"],
};
