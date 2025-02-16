

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
console.log(token,"token in middlewareeeeeeeeeee")
  // If there's no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Get the user role from token
  const userRole = token.role; // role is stored in token from NextAuth
console.log(userRole,"user role in middlewareeeeeeeeeeee")
  const pathname = req.nextUrl.pathname;
console.log(pathname,"pathname in middlewareeeee")
  // Define role-based access rules
  const adminRoutes = ["/admin", "/admin/portfolios","/admin/users","/admin/register"];
  const userRoutes = ["/dashboard"];

  if (adminRoutes.includes(pathname) && userRole !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (userRoutes.includes(pathname) && userRole === "visitor") {
    if (pathname !== "/dashboard") {  // Prevent infinite redirect
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  
  return NextResponse.next(); // Allow the request
}

export const config = {
  matcher: ["/admin/:path*", "/paid-content/:path*", "/dashboard/:path*"], // Protect these routes
};
