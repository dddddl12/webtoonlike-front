import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";


const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "creator/(.*)", "buyer/(.*)", "admin/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ko)/:path*"]
};
