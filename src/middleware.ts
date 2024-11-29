import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.protocol === "blob:") {
    return NextResponse.next();
  }
  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ko)/:path*"]
};
