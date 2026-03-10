import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain an uppercase letter, a lowercase letter, and a number",
  );

const createUser = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters")
      .trim(),
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email address")
      .toLowerCase(),
    password: passwordSchema,
    role: z.enum(["user", "admin"]).optional(),
  }),
});

const updateUser = z.object({
  body: z.object({
    name: z.string().min(2).max(50).trim().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

const getUserById = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const UserValidation = {
  createUser,
  updateUser,
  getUserById,
};
