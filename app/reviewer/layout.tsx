import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ReviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/login");
  if (session.user?.role !== "REVIEWER") redirect("/login");

  return <main className="min-h-screen bg-background">{children}</main>;
}
