import { InferSelectModel } from "drizzle-orm";
import { comments, groupMemberships, groups, tasks, users } from "./schema";

export type TaskT = InferSelectModel<typeof tasks> & {
  assignedUser?: UserT;
  assignedGroup?: GroupT;
  comments?: CommentsT[];
};

export type GroupMembershipT = InferSelectModel<typeof groupMemberships> & {
  group?: GroupT;
};

type SelectUser = InferSelectModel<typeof users> & {
  groupMemberships?: GroupMembershipT[];
};

export type UserT = Omit<SelectUser, "password">;

export type GroupT = InferSelectModel<typeof groups>;

export type CommentsT = InferSelectModel<typeof comments> & {
  user?: UserT;
};
