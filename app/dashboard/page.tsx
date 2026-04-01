import { auth } from "@/auth";
import { Component } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  // // for client Component
  // "use client";
  // import { useSession } from "next-auth/react";
  // const { data: session } = useSession();

  if (!session) redirect("/login");

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}
