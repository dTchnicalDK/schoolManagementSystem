import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome, {session.user?.name ?? "Parent"}
      </h1>
      <p className="mt-2 text-muted-foreground">Email: {session.user?.email}</p>
    </div>
  );
}
