import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ko)/:path*"]
};

// const requireAuth = createRouteMatcher(
//   ["/", "/sign-in", "/sign-up", "/:locale", "/:locale/sign-in", "/:locale/sign-up"]);
//
const requireAuth = createRouteMatcher(
  ["/aaa"]);
// TODO 로그인 프롬프트 타이밍 확인

export default clerkMiddleware((auth, request) => {
  if (requireAuth(request)) {
    const { origin, pathname } = request.nextUrl;
    if (pathname == "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", origin));
    }
    // TODO auth 사용 여부 확인
    return NextResponse.next();
  }
  return intlMiddleware(request);
});
