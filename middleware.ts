
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log(token, "token in middleware");
  
  const pathname = req.nextUrl.pathname;
  console.log(pathname, "pathname in middleware");

  // Define route groups
  const authRoutes = ["/auth/signin", "/auth/signup"];
  const adminRoutes = ["/admin", "/admin/portfolios", "/admin/users", "/admin/register", "/admin/stocks"];
  const userRoutes = ["/dashboard"];

  // If accessing auth routes while already logged in, redirect to appropriate page
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    // Redirect to appropriate dashboard based on role
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // If no token and not on auth routes, redirect to login
  if (!token && !authRoutes.some(route => pathname === route)) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Handle admin routes - only admins can access
  if (adminRoutes.some(route => pathname.startsWith(route)) && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Handle user routes - only visitors can access
  if (userRoutes.some(route => pathname.startsWith(route)) && token?.role !== "visitor") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next(); // Allow the request
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/dashboard/:path*",
    "/auth/:path*" // Added auth routes to the matcher
  ],
};