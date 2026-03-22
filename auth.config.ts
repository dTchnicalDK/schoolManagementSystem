import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

export const authConfig = {
  providers: [GitHub],
  pages: { signIn: "/login" },
  callbacks: {
    authorized() {
      return true; // let everything through, handle auth in pages
    },
  },
} satisfies NextAuthConfig;
