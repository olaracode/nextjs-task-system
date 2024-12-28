import { z } from "zod";

export const createUser = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(20, { message: "Your name should be less than 20 characters" }),

  email: z
    .string()
    .min(5, { message: "Email is required" })
    .max(30, { message: "Your email should be 30 characters or less" })
    .email(),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters long" })
    .max(30, { message: "Password should be 30 characters or less" }),
  image: z.string().url(),
});

export type CreateUserInput = z.infer<typeof createUser>;

export const loginUser = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters long" })
    .max(30, { message: "Password should be 30 characters or less" }),
});

export type LoginUserInput = z.infer<typeof loginUser>;
