import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user?.role !== "PARENT") redirect("/login");

  return <main className="min-h-screen bg-background">{children}</main>;
}
