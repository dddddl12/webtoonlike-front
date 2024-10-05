import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";
import createMiddleware from "next-intl/middleware";
import { locales, localePrefix } from "./navigation";


export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)", "/(ko|en)/:path*", "/"],
};

const intlMiddleware = createMiddleware({
  defaultLocale: "ko",
  localePrefix,
  locales
});

export default authMiddleware({
  beforeAuth(request) {
    return intlMiddleware(request);
  },
  afterAuth: (auth, req) => {
    const { origin, pathname } = req.nextUrl;

    if (pathname == "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", origin));
    }
    return NextResponse.next();
  },
  publicRoutes: ["/", "/sign-in", "/sign-up", "/:locale", "/:locale/sign-in", "/:locale/sign-up"],
});

