import { auth } from "./lib/auth";
import OAuth from "./components/auth/oauth";
import { redirect } from "next/navigation";
import AuthCard from "./components/auth/auth-card";
export default async function Home() {
  const session = await auth();
  console.log(session);
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <AuthCard />
    </div>
  );
}
