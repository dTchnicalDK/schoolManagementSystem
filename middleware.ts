import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const ROLE_ROUTES: Record<string, string[]> = {
  "/dashboard": ["PARENT"],
  "/admin": ["ADMIN"],
  "/reviewer": ["REVIEWER"],
  "/apply": ["PARENT"],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  console.log("middleware role:", role);

  const isProtected = Object.keys(ROLE_ROUTES).some((base) =>
    pathname.startsWith(base),
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL(roleHome(role), req.url));
  }

  for (const [base, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(base) && !allowedRoles.includes(role ?? "")) {
      return NextResponse.redirect(new URL(roleHome(role), req.url));
    }
  }

  return NextResponse.next();
});

function roleHome(role?: string) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "REVIEWER":
      return "/reviewer";
    default:
      return "/dashboard";
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/reviewer/:path*",
    "/apply/:path*",
    "/login",
    /*
     * Exclude: api, _next/static, _next/image, favicon
     */
  ],
};
