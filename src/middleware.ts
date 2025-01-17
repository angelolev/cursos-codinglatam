import { auth } from "./app/auth";

const ADMIN_EMAIL = "angelokta7@gmail.com";

export default auth((req) => {
  // Check if user is not authenticated and trying to access protected routes
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // Check for admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Check if user's email matches the admin email
    if (!req.auth?.user?.email || req.auth.user.email !== ADMIN_EMAIL) {
      // Return 403 for unauthorized access
      return new Response("Unauthorized", { status: 403 });
      // Alternative: redirect to homepage
      // return Response.redirect(new URL("/", req.nextUrl.origin))
    }
  }

  return null;
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/admin/:path*",
  ],
};
