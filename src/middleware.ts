import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ClerkUserMetadataSchema } from "@/resources/userMetadata/userMetadata.types";


const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "(.*)/creator/(.*)", "(.*)/buyer/(.*)", "(.*)/admin/(.*)"]);
// TODO 성분 검토 검토
const isAuthRelatedRoute = createRouteMatcher([
  "(.*)/sign-in(.*)", "(.*)/sign-up(.*)", "(.*)/sign-up-complete"]);

export default clerkMiddleware(async (auth, req) => {
  // if (isProtectedRoute(req)) {
  //   req.nextUrl.pathname = "/sign-in";
  //   return intlMiddleware(req);
  // }

  const { sessionClaims } = await auth();
  if (sessionClaims) {
    const { success } = ClerkUserMetadataSchema.safeParse(sessionClaims.metadata);
    if (!success && !isAuthRelatedRoute(req)) {
      // 회원가입을 마치지 않았는데 일반 페이지에 있는 경우
      req.nextUrl.pathname = "/sign-up-complete";
    }
  }

  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ko)/:path*"]
};
