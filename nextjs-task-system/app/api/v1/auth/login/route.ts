import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";
import { createUser } from "@/db/queries/user";
import { loginUser as zodLoginUser } from "@/db/z-users";
import { signIn } from "@/lib/auth";
import { auth } from "@/lib/auth";
export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsedBody = zodLoginUser.safeParse(body);
  if (!parsedBody.success) return ApiError.zodError(parsedBody.error);
  const signInResponse = await signIn("credentials", {
    redirect: false,
    ...parsedBody.data,
  });
  if (!signInResponse) return ApiError.unauthorized();
  const session = await auth();
  return NextResponse.json(session, { status: 201 });
}
