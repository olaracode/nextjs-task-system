import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { ApiError } from "@/lib/errors";
export async function GET() {
  const session = await auth();
  if (!session) return ApiError.unauthorized();
  const users = await db.query.users.findMany();
  return NextResponse.json({ users }, { status: 200 });
}
