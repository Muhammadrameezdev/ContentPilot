import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  // Public routes
  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/verify-email"];
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isApiRoute = pathname.startsWith("/api/");
  const isAuthApi = pathname.startsWith("/api/auth/");
  const isBillingWebhook = pathname === "/api/billing/webhook";

  // Allow public routes, auth APIs, and billing webhook
  if (isPublicRoute || isAuthApi || isBillingWebhook) {
    return NextResponse.next();
  }

  // Protected dashboard routes - require authentication
  const protectedRoutes = [
    "/dashboard",
    "/library",
    "/calendar",
    "/queue",
    "/scheduler",
    "/pages",
    "/team",
    "/ai",
    "/admin",
    "/notifications",
    "/profile",
    "/help",
    "/settings",
  ];
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));

  // Redirect to login if not authenticated
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect API routes
  if (isApiRoute && !isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
