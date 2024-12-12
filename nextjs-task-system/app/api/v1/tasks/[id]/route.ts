import { NextRequest, NextResponse } from "next/server";
import { auth, unauthorized } from "@/lib/auth";
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return unauthorized();
  // TODO
  return NextResponse.json({ task: "Example" });
}
