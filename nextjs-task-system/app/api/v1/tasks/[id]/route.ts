import { NextRequest, NextResponse } from "next/server";
import { auth, unauthorized } from "@/lib/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      id: string;
    };
  },
) {
  const session = await auth();
  if (!session) return unauthorized();
  // TODO
  const task = await db.query.tasks.findFirst({
    where: eq(users.id, params.id),
  });
  if (!task) {
    return NextResponse.json(
      { message: "Not found" },
      {
        status: 404,
      },
    );
  }
  return NextResponse.json({ task }, { status: 200 });
}
