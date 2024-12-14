import { CreateTaskInput } from "./z-tasks";
import { db } from ".";
import { tasks } from "./schema";

export async function createTask(
  input: CreateTaskInput,
  currentUserId: string,
) {
  try {
    const newTask = await db
      .insert(tasks)
      .values({
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        priority: input.priority,
        creatorId: currentUserId,
      })
      .returning();
    return newTask[0];
  } catch (error) {
    throw error;
  }
}
