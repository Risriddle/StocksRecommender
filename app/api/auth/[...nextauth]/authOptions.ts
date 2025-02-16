import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { User } from "@/lib/db/models/User";
import dbConnect from "@/lib/db/connect";
import { JWT } from "next-auth/jwt";

// Define possible user roles
type UserRole = "admin" | "paid_user" | "visitor";

// Extend NextAuth token type
interface ExtendedJWT extends JWT {
  id: string;
  role: UserRole;
}

// Extend NextAuth session type
interface ExtendedSession extends Session {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect(); // Ensure DB connection

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Ensure role is one of the defined UserRole values
        const role: UserRole = ["admin", "paid_user", "visitor"].includes(user.role)
          ? (user.role as UserRole)
          : "visitor";

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as ExtendedJWT).id = user.id;
        (token as ExtendedJWT).role = user.role as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      (session as ExtendedSession).user.id = (token as ExtendedJWT).id;
      (session as ExtendedSession).user.role = (token as ExtendedJWT).role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
