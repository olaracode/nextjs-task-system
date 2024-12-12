import { NextRequest, NextResponse } from "next/server";
import { auth, unauthorized } from "@/lib/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return unauthorized();

  const taskList = await db.select().from(tasks);
  return NextResponse.json(
    {
      tasks: taskList || [],
    },
    {
      status: 200,
    },
  );
}
