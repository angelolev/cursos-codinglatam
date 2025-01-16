import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const response = await fetch(`${request.nextUrl.origin}/api/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-request": "true",
      },
      body: JSON.stringify({ token }),
    });

    // If the response status is 302 (redirect), handle the redirection manually
    if (response.status === 302) {
      const jsonResponse = await response.json();

      const redirectUrl = jsonResponse.redirectUrl; // Get the redirect URL from the JSON response
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (!response.ok) {
      throw new Error("Token verification failed");
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    // "/cursos/:path*",
    // "/cursos/javascript/clases/4cb5503f-f301-451e-8685-ff9f71fba360",
    // "/cursos/javascript/clases/fc471469-809d-408d-8458-2101fce22325",
    // "/cursos/javascript/clases/3d144ef7-8b64-4a62-84d2-98d5c88d5e4a",
    // "/cursos/javascript/clases/b8d507ef-3959-4792-9b0b-6265fb0eb8c9",
    // "/cursos/javascript/clases/beaf7168-0aff-4d37-8a51-c6decd40ea57",
    // "/cursos/javascript/clases/ee037b5a-b54f-4900-aaca-f3e631348d1a",
    // "/cursos/javascript/clases/746e55e4-ec66-4ce2-892c-96be13dab68d",
    // "/cursos/javascript/clases/6591232b-2f59-4ef3-a135-7acd85ad0e1e",
    // "/cursos/javascript/clases/7a055f43-bf63-41b1-86f3-b628049eb27e",
  ],
};
