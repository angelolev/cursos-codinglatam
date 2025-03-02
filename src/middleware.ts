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
    "/cursos/web/clases/f2d153f5-7fbd-4ac8-92b3-f3620ef25f18",
    "/cursos/web/clases/34f9eca3-b66c-40fc-8ef8-b7f6439fd477",
    "/cursos/web/clases/a0e76c1b-52c3-4e48-ae96-3e309cac1f00",
    "/cursos/web/clases/6646fe2d-2629-4f95-a048-4fe577652ebe",
    "/cursos/web/clases/0eb916d4-5559-4142-89a6-b3353877b7c6",
    "/cursos/web/clases/93728491-76a0-47ea-bd74-0f3996147776",
    "/cursos/web/clases/1a2fa76b-890a-4c09-87a0-4ccefcf96ac3",
    "/cursos/web/clases/e8658eb0-d310-4076-bc25-9438a78ddb0a",
    "/cursos/web/clases/e7cbc1fa-69b4-4d6c-8e41-9336a4042828",
    "/cursos/web/clases/0a329ad5-2984-468e-9408-a0030b33623d",
    "/cursos/web/clases/c78e1a77-b802-464a-abe8-1f65a2655eb1",
    "/cursos/web/clases/924e3abf-fad8-4a02-a48c-007fd9267db0",
    "/cursos/web/clases/6c64b1ee-0036-48f4-896b-1c73980b922e",
    "/cursos/web/clases/9dfb6aed-2713-402d-b47f-6e59181254c5",
    "/cursos/web/clases/21798c79-8766-46c2-b8a2-5853c936b074",
    "/cursos/web/clases/cdcd27bb-abe6-4d6d-b4bf-355f084171ee",
    "/cursos/web/clases/ab163c3c-536f-42d1-83fc-b05f7ac8093a",
    "/cursos/web/clases/717df949-1d03-462a-b209-a13ca0d00e8a",
    "/cursos/web/clases/98ca6456-7611-4ac2-a07b-031097160a8a",
    "/cursos/web/clases/b349daf7-e33d-40d2-a3a8-4b9a10a45b8c",
    "/cursos/web/clases/f9b40c7c-695d-4575-befb-5a69886fd1db",
  ],
};
