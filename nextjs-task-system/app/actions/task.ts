"use server";
import { z } from "zod";
import { createTaskSchema } from "@/db/z-tasks";
import { createTask as createDbTask } from "@/db/queries";
import { auth } from "@/lib/auth";
import { ApiError } from "@/lib/errors";
// PrevState coming from nextjs15 and react-19 useActionState new hook
export async function createTask(prevState: any, formData: FormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return {
      ...prevState,
      error: "Unauthorized access",
    };
  }
  try {
    const parsedTask = createTaskSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      dueDate: formData.get("dueDate"),
      priority: formData.get("priority"),
    });

    if (!parsedTask.success) {
      console.log(parsedTask.error);
      throw parsedTask.error;
    }
    const response = await createDbTask(
      { ...parsedTask.data, dueDate: new Date(parsedTask.data.dueDate) },
      session.user.id,
    );
    // can it be updated from the server?
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return {
      ...prevState,
      error: errorMessage,
    };
  }
}
