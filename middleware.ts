import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig); // wrapper for middleware function, works as middleware

const ROLE_ROUTES: Record<string, string[]> = {
  "/dashboard": ["PARENT"],
  "/admin": ["ADMIN"],
  "/reviewer": ["REVIEWER"],
  "/apply": ["PARENT"],
};

export default auth((req) => {
  //extracting needed variables for further use;
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  // logics, what to do when requested path maches
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

//function to create an url based on role
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

//optional: without this above bussiness logic will run on each path
// with this the above bussiness logic will run only on given path in mathere array
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
