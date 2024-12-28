import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";
import { createUser } from "@/db/queries/user";
import { createUser as zodCreateUser } from "@/db/z-users";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsedBody = zodCreateUser.safeParse(body);
  if (!parsedBody.success) return ApiError.zodError(parsedBody.error);
  const newUser = await createUser(parsedBody.data);
  if (!newUser) return ApiError.server();
  return NextResponse.json({ user: newUser }, { status: 201 });
}
