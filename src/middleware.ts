import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/stories(.*)",
  "/category(.*)",
  "/company(.*)",
  "/submit",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/stories(.*)",
  "/api/search(.*)",
  "/api/companies(.*)",
  "/api/categories(.*)",
  "/api/submissions(.*)",
  "/api/newsletter(.*)",
  "/api/contact(.*)",
  "/api/settings(.*)",
  "/api/webhooks(.*)",
  "/sitemap.xml",
  "/robots.txt",
]);

const isProtectedRoute = createRouteMatcher(["/profile(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
