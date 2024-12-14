import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function Dashboard() {
  const session = await auth();
  if (!session) return redirect("/");
  return (
    <div>
      <p>Dashboard</p>
    </div>
  );
}
