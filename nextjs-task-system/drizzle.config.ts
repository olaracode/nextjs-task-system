import "dotenv/config";
import { defineConfig } from "drizzle-kit";
const { DATABASE_URL, DATABASE_DIALECT } = process.env;
export default defineConfig({
  out: "./drizzle",
  schema: "./app/db/schema.ts",
  dialect: (DATABASE_DIALECT as "postgresql" | "mysql" | "sqlite")!,
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
