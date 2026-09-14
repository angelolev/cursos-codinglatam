import { auth } from "./app/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "angelokta7@gmail.com";

export default auth((req) => {
  // Get the current pathname
  const pathname = req.nextUrl.pathname;

  // First check: If user is not authenticated and trying to access any protected route
  if (!req.auth) {
    // Allow access to login page
    if (pathname === "/login") {
      return;
    }
    // Redirect to login for all other protected routes
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  } else {
    // Define routes that require premium access
    const isProjectRoute = pathname.startsWith("/proyectos/");
    const isGuideRoute = pathname.startsWith("/guias/");
    const isLiveEventRoute = pathname.startsWith("/en-vivo/");
    
    // Routes that need premium (workshops and lessons will have component-level access control)
    const requiresPremium = isProjectRoute || 
                           isGuideRoute || 
                           isLiveEventRoute;
    
    // For individual lessons, let component-level freemium logic handle access control
    // Middleware only blocks premium-only sections
    if (requiresPremium && !req.auth?.user?.isPremium) {
      // Redirect non-premium users to upgrade page
      return Response.redirect(new URL("/pro", req.nextUrl.origin));
    }
  }

  // Second check: Special handling for admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth?.user?.email || req.auth.user.email !== ADMIN_EMAIL) {
      // Redirect non-admin users to home
      return Response.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  // User is authenticated and has proper permissions
  return;
});

export const config = {
  matcher: [
    "/admin/:path*",
    // Only detail pages are premium-gated; listing pages (/proyectos, /guias,
    // /en-vivo) stay public so the catalog remains browsable/SEO-visible.
    "/proyectos/:path+",
    "/guias/:path+",
    "/en-vivo/:path+",
  ],
};
