
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  const router = useRouter();

  // Redirect based on role once session is loaded
  useEffect(() => {
    if (status === "authenticated") {
      // Don't redirect if we're already on the correct page
      const currentPath = window.location.pathname;
      const dashboardPath = userRole === "admin" ? "/admin" : "/dashboard";
      
      // Only redirect if we're on the home page
      if (currentPath === "/") {
        router.push(dashboardPath);
      }
    }
  }, [status, userRole, router]);

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            StockRec
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/portfolios">
              <Button variant="ghost" className="text-base">
                Standard Portfolios
              </Button>
            </Link>

            {/* User Menu Section */}
            {status === "loading" ? (
              <div className="h-6 w-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            ) : status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-7 w-7" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="text-sm opacity-70">
                    Signed in as {session.user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={userRole === "admin" ? "/admin" : "/dashboard"}>
                      {userRole === "admin" ? "Admin Dashboard" : "Dashboard"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}