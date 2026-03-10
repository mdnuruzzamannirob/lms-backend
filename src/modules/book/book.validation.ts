import { z } from "zod";

const createBook = z.object({
  body: z.object({
    title: z.string({ error: "Title is required" }).min(1).max(300).trim(),
    isbn: z.string({ error: "ISBN is required" }).min(10).max(13).trim(),
    authors: z
      .array(z.string().trim())
      .min(1, "At least one author is required"),
    publisher: z.string().max(200).trim().optional(),
    publishedYear: z.number().int().min(1000).max(2100).optional(),
    category: z.string({ error: "Category is required" }),
    language: z.string().max(50).trim().optional(),
    pages: z.number().int().positive().optional(),
    totalCopies: z.number({ error: "Total copies is required" }).int().min(0),
    availableCopies: z.number().int().min(0).optional(),
    shelfLocation: z.string().max(50).trim().optional(),
    coverImage: z.string().url().optional(),
    description: z.string().max(2000).trim().optional(),
  }),
});

const updateBook = z.object({
  body: z.object({
    title: z.string().min(1).max(300).trim().optional(),
    isbn: z.string().min(10).max(13).trim().optional(),
    authors: z.array(z.string().trim()).min(1).optional(),
    publisher: z.string().max(200).trim().optional(),
    publishedYear: z.number().int().min(1000).max(2100).optional(),
    category: z.string().optional(),
    language: z.string().max(50).trim().optional(),
    pages: z.number().int().positive().optional(),
    totalCopies: z.number().int().min(0).optional(),
    availableCopies: z.number().int().min(0).optional(),
    shelfLocation: z.string().max(50).trim().optional(),
    coverImage: z.string().url().optional(),
    description: z.string().max(2000).trim().optional(),
  }),
  params: z.object({ id: z.string() }),
});

const getById = z.object({
  params: z.object({ id: z.string() }),
});

export const BookValidation = {
  createBook,
  updateBook,
  getById,
};
