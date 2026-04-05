import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  pages: { signIn: "/login" },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔥 JWT CALLBACK FIRED", {
        user: user?.id,
        sub: token.sub,
        role: token.role,
      });

      if (user?.id) {
        token.id = user.id;
      }

      const id = (token.id ?? token.sub) as string | undefined;

      if (id && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id },
          select: { role: true },
        });
        token.id = id;
        token.role = dbUser?.role ?? "PARENT";
        console.log("✅ Role fetched from DB:", token.role);
      }

      return token;
    },

    async session({ session, token }) {
      console.log("🔥 SESSION CALLBACK FIRED", {
        tokenId: token.id,
        tokenRole: token.role,
      });
      if (token.id) session.user.id = token.id as string;
      if (token.role) session.user.role = token.role as string;
      return session;
    },
  },
});
