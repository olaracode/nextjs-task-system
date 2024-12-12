import { auth, unauthorized } from "@/lib/auth";
import { NextResponse } from "next/server";
export async function GET() {
  const session = await auth();
  if (!session) return unauthorized();
  return NextResponse.json({ groups: [] });
}
