import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ClerkUserMetadataSchema } from "@/utils/auth/base";


const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/creator/(.*)", "/buyer/(.*)", "/admin/(.*)"]);
const isAuthRelatedRoute = createRouteMatcher([
  "/sign-in(.*)", "/sign-up(.*)", "/(.*)/sign-up-complete"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
  // TODO 필요한지 검토

  const { userId, sessionClaims } = await auth();
  if (!isAuthRelatedRoute(req) && userId) {
    const { data: userInfo } = await ClerkUserMetadataSchema.safeParseAsync(sessionClaims.metadata);
    if (!userInfo || !userInfo.signUpComplete) {
      req.nextUrl.pathname = "/sign-up-complete";
    }
  }

  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ko)/:path*"]
};
