"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  School,
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  ClipboardCheck,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserRole = "PARENT" | "ADMIN" | "REVIEWER" | null;

type NavbarProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: UserRole;
  } | null;
};

type NavItem = {
  label: string;
  href: string;
  icon?: React.ElementType;
};

// export function Navbar({ user }: NavbarProps) {
export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const role: UserRole = isUserRole(user?.role) ? user.role : null;
  console.log("role", role);

  //   console.log("session", session?.user);

  const publicLinks: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Apply", href: "/apply" },
    { label: "Login", href: "/login", icon: LogIn },
    { label: "Register", href: "/register", icon: UserPlus },
  ];

  const parentLinks: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Applications", href: "/dashboard", icon: FileText },
    { label: "Apply", href: "/apply", icon: FileText },
  ];

  const adminLinks: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Applications", href: "/admin/applications", icon: FileText },
    { label: "Reviewers", href: "/admin/reviewers", icon: Users },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const reviewerLinks: NavItem[] = [
    { label: "Dashboard", href: "/reviewer", icon: LayoutDashboard },
    { label: "My Reviews", href: "/reviewer", icon: ClipboardCheck },
  ];

  const navLinks =
    role === "PARENT"
      ? parentLinks
      : role === "ADMIN"
        ? adminLinks
        : role === "REVIEWER"
          ? reviewerLinks
          : publicLinks;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <School className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline-block">School Admission</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.href + item.label}
                href={item.href}
                label={item.label}
                pathname={pathname}
              />
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    // variant="ghost"
                    className="flex items-center gap-2 px-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium leading-none">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled>
                    {user.email || "No email"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={getProfileLink(role)} className="w-full">
                      Go to Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/apply">
                <Button>Apply Now</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger>
              <div className="md:hidden">
                <Menu className="h-5 w-5" />
              </div>
            </SheetTrigger>

            <SheetContent side="right" className="w-70">
              <div className="mt-6 flex flex-col gap-6">
                <div>
                  <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold"
                  >
                    <School className="h-5 w-5 text-primary" />
                    <span>School Admission</span>
                  </Link>
                </div>

                {user && (
                  <div className="rounded-xl border p-3">
                    <p className="font-medium">{user.name || "User"}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs font-medium text-primary">
                      {user.role}
                    </p>
                  </div>
                )}

                <nav className="flex flex-col gap-2">
                  {navLinks.map((item) => (
                    <MobileNavLink
                      key={item.href + item.label}
                      href={item.href}
                      label={item.label}
                      pathname={pathname}
                      icon={item.icon}
                    />
                  ))}
                </nav>

                {user ? (
                  <Button
                    variant="destructive"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full">Register</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
        isActive ? "bg-muted text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  pathname,
  icon: Icon,
}: {
  href: string;
  label: string;
  pathname: string;
  icon?: React.ElementType;
}) {
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
        isActive ? "bg-muted text-foreground" : "text-muted-foreground",
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );
}

function getProfileLink(role: UserRole | null) {
  if (role === "ADMIN") return "/admin";
  if (role === "REVIEWER") return "/reviewer";
  return "/dashboard";
}
// function isUserRole(role: string | undefined) {
//   throw new Error("Function not implemented.");
// }

function isUserRole(role: unknown): role is UserRole {
  return role === "PARENT" || role === "ADMIN" || role === "REVIEWER";
}
