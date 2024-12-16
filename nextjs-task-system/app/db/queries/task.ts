import { and, eq, not } from "drizzle-orm";
import { CreateTaskInput, UpdateTaskInput } from "../z-tasks";
import { db } from "..";
import {
  comments,
  groups,
  TaskPriority,
  tasks,
  TaskStatus,
  users,
} from "../schema";
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

export async function updateTask(
  userId: string,
  taskId: string,
  data: UpdateTaskInput,
) {
  await isUserAdmin(userId);

  const task = await getTaskById(taskId);
  if (!task) throw new Error(queryErrors.notFound);
  console.log(data);
  const res = await db
    .update(tasks)
    .set({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
    })
    .where(eq(tasks.id, taskId))
    .returning();

  return res;
}

export async function updateTaskPriorityStatus(
  taskId: string,
  updateValues: UpdateTaskT,
) {
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
  console.log(taskId);
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

export async function assignTask(
  userId: string,
  targetId: string,
  taskId: string,
  isUser: boolean = true,
) {
  await isUserAdmin(userId);
  const targetExists = isUser
    ? await db.query.users.findFirst({
        where: eq(users.id, targetId),
      })
    : await db.query.users.findFirst({
        where: eq(groups.id, targetId),
      });

  const taskExists = await getTaskById(taskId);
  if (!targetExists || !taskExists) throw new Error(queryErrors.notFound);

  return await db
    .update(tasks)
    .set({
      assignedToGroupId: isUser ? null : targetId,
      assignedToUserId: isUser ? targetId : null,
    })
    .where(eq(tasks.id, taskId))
    .returning();
}

export async function removeAssigned(userId: string, taskId: string) {
  await isUserAdmin(userId);

  const taskExists = await getTaskById(taskId);
  if (!taskExists) throw new Error(queryErrors.notFound);

  return await db
    .update(tasks)
    .set({ assignedToGroupId: null, assignedToUserId: null })
    .where(eq(tasks.id, taskId))
    .returning();
}

export async function createComment(
  userId: string,
  taskId: string,
  content: string,
) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  const task = await getTaskById(taskId);

  if (!task || !user) throw new Error(queryErrors.notFound);

  // should add extra validation for checking if:
  // ? if the user is not an admin
  // ? the user should be assigned to the task
  // ? the user should be included to the group that's assigned
  // ? Only if this conditions are met then the user can create a new comment on the task

  return await db
    .insert(comments)
    .values({ userId, content, taskId })
    .returning();
}

export async function deleteComment(userId: string, commentId: string) {
  const comment = await db.query.comments.findFirst({
    where: and(eq(comments.id, commentId), eq(comments.userId, userId)),
  });
  if (!comment) throw new Error(queryErrors.notFound);
  return await db
    .delete(comments)
    .where(eq(comments.id, commentId))
    .returning();
}
