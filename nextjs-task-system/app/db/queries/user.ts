import { db } from "..";
import { isUserAdmin, queryErrors } from ".";
import { UserRoles, users } from "../schema";
import { eq } from "drizzle-orm";
import { CreateUserInput } from "../z-users";
import { UserT } from "../type";
import bcrypt from "bcrypt";
export async function getUsers(userId: string) {
  await isUserAdmin(userId);
  return db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
    },
    with: {
      groupMemberships: {
        with: {
          group: true,
        },
      },
    },
  });
}

export async function getUserById(userId: string) {
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (dbUser?.password) {
    const { password, ...user } = dbUser;
    return user;
  }
  return dbUser;
}

export async function updateUserRole(
  userId: string,
  targetUserId: string,
  newRole: UserRoles,
) {
  await isUserAdmin(userId);
  const targetUser = await db.query.users.findFirst({
    where: eq(users.id, targetUserId),
  });
  if (!targetUser) throw new Error(queryErrors.notFound);
  return db
    .update(users)
    .set({ role: newRole })
    .where(eq(users.id, targetUserId))
    .returning();
}

export async function createUser(data: CreateUserInput) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, data.email),
  });
  if (existingUser) throw new Error("Duplicated entry");
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const [user] = await db
    .insert(users) // Use the table reference directly
    .values({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      image: data.image,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
    });

  return user as UserT;
}

export async function getUserForSignin(email: string, pw: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) return null;
  const match = await bcrypt.compare(pw, user.password!);
  if (!match) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
  };
}
