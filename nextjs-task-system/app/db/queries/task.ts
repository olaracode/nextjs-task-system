import { eq, not } from "drizzle-orm";
import { CreateTaskInput } from "../z-tasks";
import { db } from "..";
import { TaskPriority, tasks, TaskStatus } from "../schema";
import { isUserAdmin, queryErrors } from ".";

export type UpdateTaskT = {
  status?: TaskStatus;
  priority?: TaskPriority;
};

export async function createTask(
  input: CreateTaskInput,
  currentUserId: string,
) {
  await isUserAdmin(currentUserId);

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
}

export async function deleteTask(taskId: string, userId: string) {
  await isUserAdmin(userId);
  const task = await getTaskById(taskId);

  if (!task) throw new Error(queryErrors.notFound);

  return await db.delete(tasks).where(eq(tasks.id, taskId));
}

export async function updateTask(taskId: string, updateValues: UpdateTaskT) {
  const task = await getTaskById(taskId);
  if (!task) throw new Error(queryErrors.notFound);
  return await db
    .update(tasks)
    .set(
      updateValues.status
        ? { status: updateValues.status }
        : { priority: updateValues.priority },
    )
    .where(eq(tasks.id, taskId))
    .returning();
}

export async function getTaskById(taskId: string) {
  return await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });
}

// returns the tasks that are not archived
export async function getActiveTasks() {
  // TODO -> Should receive the user id and check its role
  // TODO -> IF it's an admin it returns all the active tasks
  // TODO -> IF it's an user it returns only the tasks assigned to them or a group they belong to
  const allTasks = await db.query.tasks.findMany({
    where: not(eq(tasks.status, "ARCHIVED")),
  });
  return allTasks;
}
