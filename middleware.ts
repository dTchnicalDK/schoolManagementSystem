import { auth } from "@/auth";
import { NextResponse } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  "/dashboard": ["PARENT"],
  "/admin": ["ADMIN"],
  "/reviewer": ["REVIEWER"],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  // If not logged in and trying to access a protected route → /login
  const isProtected = Object.keys(ROLE_ROUTES).some((base) =>
    pathname.startsWith(base),
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If logged in and trying to access /login → redirect to their home
  if (session && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL(roleHome(role), req.url));
  }

  // If logged in but wrong role for this route → redirect to their home
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
  matcher: ["/dashboard/:path*", "/admin/:path*", "/reviewer/:path*", "/login"],
};
