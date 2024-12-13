import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { createTaskSchema } from "@/db/z-tasks";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return ApiError.unauthorized();
  //? Should pagination be added?
  //? Or perhaps add a archived enum to limit query sizes
  const tasks = await db.query.tasks.findMany();
  return NextResponse.json({ tasks }, { status: 200 });
}

// Should be a formAction? Or a API?
// Is this going to integrate with other
// Apps?
export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const parsedBody = createTaskSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) return ApiError.zodError(err);
  }
}
