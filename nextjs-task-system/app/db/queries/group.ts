import { eq, and } from "drizzle-orm";
import { isUserAdmin, queryErrors } from ".";
import { db } from "..";
import { groupMemberships, groups, users } from "../schema";

export async function createGroup(userId: string, name: string) {
  await isUserAdmin(userId);
  return await db.insert(groups).values({ name }).returning();
}

export async function deleteGroup(userId: string, groupId: string) {
  await isUserAdmin(userId);

  return db.delete(groups).where(eq(groups.id, groupId)).returning();
}

export async function createUserMembership(
  userId: string,
  targetId: string,
  groupId: string,
) {
  await isUserAdmin(userId);

  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, targetId),
  });
  const targetGroup = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });
  if (!targetUser || !targetGroup) throw new Error(queryErrors.notFound);

  const userInGroup = await userMembership(targetId, groupId);
  if (userInGroup) throw new Error(queryErrors.duplicate);

  return await db
    .insert(groupMemberships)
    .values({ userId: targetId, groupId })
    .returning();
}

export async function removeUserMembership(
  userId: string,
  membershipId: string,
) {
  await isUserAdmin(userId);
  return await db
    .delete(groupMemberships)
    .where(eq(groupMemberships.id, membershipId));
}

export async function userMembership(userId: string, groupId: string) {
  return await db.query.groupMemberships.findFirst({
    where: and(
      eq(groupMemberships.userId, userId),
      eq(groupMemberships.id, groupId),
    ),
  });
}
