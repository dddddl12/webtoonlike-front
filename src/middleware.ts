import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import * as TokenApi from "@/apis/tokens";
import { authCookieName } from "@/utils/authedUser";


const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "creator/(.*)", "buyer/(.*)", "admin/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  const res = intlMiddleware(req);

  const sessionKeyCookie = req.cookies.get("__session");
  if (!req.cookies.has(authCookieName) && sessionKeyCookie) {
    await TokenApi.create({
      clerkToken: sessionKeyCookie.value
    }).then(({ token }) => {
      res.cookies.set({
        name: authCookieName,
        value: token
      });
    }).catch(()=>{
    //   TODO
    });
  }
  return res;
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(en|ko)/:path*"]
};
