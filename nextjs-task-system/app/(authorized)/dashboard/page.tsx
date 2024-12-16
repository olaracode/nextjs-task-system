import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import TaskForm from "@/components/dashboard/task-form";
import Dashboard from "@/components/dashboard/dashboard";
import { TaskProvider } from "@/contexts/TaskContext";
export default async function DashboardPage() {
  const session = await auth();
  if (!session) return redirect("/");
  return (
    <TaskProvider>
      <Dashboard />
    </TaskProvider>
  );
}
