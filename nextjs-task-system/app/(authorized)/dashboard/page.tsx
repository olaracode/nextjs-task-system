import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AddTask from "@/components/dashboard/add-task";

export default async function Dashboard() {
  const session = await auth();

  if (!session) return redirect("/");
  return (
    <div>
      <p>Dashboard</p>
      <AddTask userId={session.user?.id} />
    </div>
  );
}
