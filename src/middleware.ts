import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

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
  matcher: [
    "/dashboard/:path*",
    "/cursos/javascript/clases/:path*",
    "/workshops/portafolios-que-contratan/videos/:path*",
  ],
};
