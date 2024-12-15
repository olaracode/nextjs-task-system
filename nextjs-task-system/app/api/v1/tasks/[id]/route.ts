import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
import { updateTask, UpdateTaskT } from "@/db/queries/task";
import { deleteTask, getTaskById } from "@/db/queries/task";

// params are now async and need to be waited:
// https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

type RouteParams = {
  params: Promise<{ id: string }>;
};

// ? Is it required a details endpoint?
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return ApiError.unauthorized();

  const id = (await params).id;
  const task = await getTaskById(id);
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

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session) return ApiError.unauthorized();
  const id = (await params).id;

  try {
    const { status, priority } = (await request.json()) as UpdateTaskT;
    if (!status && !priority) {
      return ApiError.miscError(
        "Bad Request",
        "Status or priority is required",
        400,
      );
    }
    const [updatedTask] = await updateTask(
      id,
      status ? { status } : { priority },
    );
    return NextResponse.json(
      {
        task: updatedTask,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return ApiError.server();
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session || !session.user || !session.user.id)
    return ApiError.unauthorized();

  const id = (await params).id;

  try {
    const deletedTask = await deleteTask(id, session.user?.id);
    if (!deletedTask) throw new Error("Unkown Error");
    return NextResponse.json(
      {
        message: "Task deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return ApiError.server();
  }
}
