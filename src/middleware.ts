import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { TokenInfoSchema } from "@/resources/tokens/token.types";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

// TODO 성분 검토 검토
const isAuthRelatedRoute = createRouteMatcher([
  "(.*)/sign-in(.*)", "(.*)/sign-up(.*)", "(.*)/sign-up-complete"]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.protocol === "blob:") {
    return NextResponse.next();
  }

  const { sessionClaims } = await auth();
  if (sessionClaims) {
    const { success } = TokenInfoSchema.safeParse(sessionClaims.serviceInfo);
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
