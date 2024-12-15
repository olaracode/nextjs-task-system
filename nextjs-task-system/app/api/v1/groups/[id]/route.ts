import { NextRequest, NextResponse } from "next/server";
import {
  createUserMembership,
  deleteGroup,
  updateGroup,
} from "@/db/queries/group";
import { auth, unauthorized } from "@/lib/auth";
import { ApiError } from "@/lib/errors";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET() {
  const session = await auth();
  if (!session) return unauthorized();
  return NextResponse.json({
    group: "",
  });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();

  const id = (await params).id;
  try {
    const body = await request.json();
    if (!body.userId) return ApiError.badRequest("User id is required");

    const newMembership = await createUserMembership(
      session.user.id,
      body.userId,
      id,
    );
    if (!newMembership) return ApiError.server();
    return NextResponse.json(
      {
        membership: newMembership,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      return ApiError.miscError("Bad request", error.message, 400);
    }
    console.error(error);
    return ApiError.server();
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();

  const body = await request.json();
  if (!body.name) {
    return ApiError.badRequest("Name is required");
  }

  const id = (await params).id;
  try {
    const updatedGroup = await updateGroup(session.user.id, id, body.name);
    return NextResponse.json(
      {
        group: updatedGroup,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return ApiError.server();
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiError.unauthorized();

  const id = (await params).id;
  try {
    const response = await deleteGroup(session.user.id, id);
    if (!response) throw new Error("unkwown");
    return NextResponse.json(
      {
        message: "Deleted successfuly",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return ApiError.server();
  }
}
