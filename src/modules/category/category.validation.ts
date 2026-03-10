import { z } from "zod";

const createCategory = z.object({
  body: z.object({
    name: z.string({ error: "Name is required" }).min(2).max(100).trim(),
    description: z.string().max(500).trim().optional(),
  }),
});

const updateCategory = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    description: z.string().max(500).trim().optional(),
  }),
  params: z.object({ id: z.string() }),
});

const getById = z.object({
  params: z.object({ id: z.string() }),
});

export const CategoryValidation = {
  createCategory,
  updateCategory,
  getById,
};
