import { defineConfig } from "drizzle-kit";
import { config } from "@/lib/utils";

export default defineConfig({
  out: "./drizzle",
  schema: "./app/db/schema.ts",
  dialect: (config.dialect as "postgresql" | "mysql" | "sqlite")!,
  dbCredentials: {
    url: config.dbUrl!,
  },
});
