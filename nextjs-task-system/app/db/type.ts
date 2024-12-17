import { InferSelectModel } from "drizzle-orm";
import { comments, groups, tasks, users } from "./schema";

export type TaskT = InferSelectModel<typeof tasks> & {
  assignedUser?: UserT;
  assignedGroup?: GroupT;
  comments?: CommentsT[];
};

export type UserT = InferSelectModel<typeof users>;

export type GroupT = InferSelectModel<typeof groups>;

export type CommentsT = InferSelectModel<typeof comments>;
