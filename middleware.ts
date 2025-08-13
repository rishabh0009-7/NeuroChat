// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in", "/sign-up"]);
const isIgnoredRoute = createRouteMatcher(["/api/webhook"]);

export default clerkMiddleware((auth, req) => {
  // Allow public and ignored routes to pass through
  if (isPublicRoute(req) || isIgnoredRoute(req)) {
    return;
  }

  // For now, allow all routes to pass through without authentication
  // This will let you see the landing page
  return;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
