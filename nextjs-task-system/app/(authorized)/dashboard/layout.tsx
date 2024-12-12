import React, { PropsWithChildren } from "react";
import Nav from "@/components/dashboard/nav";
export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Nav />
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
