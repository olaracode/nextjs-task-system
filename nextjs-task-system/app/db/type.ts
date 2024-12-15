import { InferSelectModel } from "drizzle-orm";
import { tasks } from "./schema";
export type TaskT = InferSelectModel<typeof tasks>;
