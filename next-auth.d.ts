import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    role: "admin" | "paid_user" | "visitor"; // ✅ Ensure role is always present
  }

  interface Session {
    user: User; // ✅ Ensures session always has user and role
  }
}
