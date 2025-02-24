// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { auth } from "./app/auth";

const ADMIN_EMAIL = "angelokta7@gmail.com";

export default auth((req) => {
  // Get the current pathname
  const pathname = req.nextUrl.pathname;

  // First check: If user is not authenticated and trying to access any protected route
  if (!req.auth) {
    // Allow access to login page
    if (pathname === "/login") {
      return null;
    }
    // Redirect to login for all other protected routes

    return Response.redirect(new URL("/login", req.nextUrl.origin));
  } else {
    if (!req.auth?.user?.isPremium) {
      // Redirect non-premium users to upgrade page or show premium required message
      return Response.redirect(new URL("/pro", req.nextUrl.origin));
    }
  }

  // Second check: Special handling for admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth?.user?.email || req.auth.user.email !== ADMIN_EMAIL) {
      // Redirect non-admin users to login
      return Response.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  // User is authenticated and has proper permissions
  return null;
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/cursos/javascript/clases/fc471469-809d-408d-8458-2101fce22325",
    "/cursos/javascript/clases/3d144ef7-8b64-4a62-84d2-98d5c88d5e4a",
    "/cursos/javascript/clases/b8d507ef-3959-4792-9b0b-6265fb0eb8c9",
    "/cursos/javascript/clases/beaf7168-0aff-4d37-8a51-c6decd40ea57",
    "/cursos/javascript/clases/ee037b5a-b54f-4900-aaca-f3e631348d1a",
    "/cursos/javascript/clases/746e55e4-ec66-4ce2-892c-96be13dab68d",
    "/cursos/javascript/clases/6591232b-2f59-4ef3-a135-7acd85ad0e1e",
    "/cursos/javascript/clases/7a055f43-bf63-41b1-86f3-b628049eb27e",
    "/cursos/react/clases/b3cd4275-c0c1-4a08-9b5d-4714bd1bea94",
    "/cursos/react/clases/37569d6f-d411-46e6-8a7a-43a0d6508300",
    "/cursos/react/clases/29ab078a-42ad-4080-a40f-2b067bdad59c",
    "/cursos/react/clases/063980e7-0587-4da1-9773-836335359b75",
    "/cursos/react/clases/61c222b9-782b-4c27-bcee-ed611cf8e5a5",
    "/cursos/react/clases/c91307b2-f4e6-401c-be65-25164e8e53af",
    "/cursos/react/clases/8218d354-5b82-46a9-a269-91f98abad117",
    "/cursos/react/clases/fa1eb407-5320-4990-b701-86d31fabdd39",
    "/cursos/react/clases/c2cfc7ba-2bc6-4497-981a-1d83f7e4afcd",
    "/cursos/react/clases/fca17b5f-d46b-4a5a-a564-358b5462b2a2",
    "/cursos/react/clases/1e96a24a-ce5f-46a5-8b8c-4ce524a49dfa",
  ],
};
