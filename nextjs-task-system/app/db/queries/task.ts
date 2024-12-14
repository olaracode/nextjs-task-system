import { eq, not } from "drizzle-orm";
import { CreateTaskInput } from "../z-tasks";
import { db } from "..";
import { tasks, TaskStatus } from "../schema";
import { isUserAdmin, queryErrors } from ".";

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

export async function changeTaskStatus(taskId: string, status: TaskStatus) {
  const task = await getTaskById(taskId);
  if (!task) throw new Error(queryErrors.notFound);

  return await db.update(tasks).set({ status }).where(eq(tasks.id, taskId));
}

export async function assignTask(
  userId: string,
  taskId: string,
  assigneeId: string,
  isGroup: boolean = false,
) {
  await isUserAdmin(userId);

  const task = await getTaskById(taskId);
  if (!task) throw new Error(queryErrors.notFound);

  //
}

export async function getTaskById(taskId: string) {
  return await db.query.tasks.findFirst({
    where: eq(tasks.id, taskId),
  });
}

// returns the tasks that are not archived
export async function getActiveTasks() {
  const allTasks = await db.query.tasks.findMany({
    where: not(eq(tasks.status, "ARCHIVED")),
  });
  return allTasks;
}
