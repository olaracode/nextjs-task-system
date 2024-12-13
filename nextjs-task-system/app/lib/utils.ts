import "dotenv/config";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const config = {
  dbUrl: process.env.DATABASE_URL || "",
  testUserId: process.env.TEST_USER_ID || "",
};
