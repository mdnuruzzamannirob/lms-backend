import { z } from "zod";

const borrowBook = z.object({
  body: z.object({
    book: z.string({ error: "Book ID is required" }),
    member: z.string({ error: "Member ID is required" }),
    dueDate: z.string({ error: "Due date is required" }),
    notes: z.string().max(500).trim().optional(),
  }),
});

const returnBook = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    notes: z.string().max(500).trim().optional(),
  }),
});

const renewBook = z.object({
  params: z.object({ id: z.string() }),
  body: z.object({
    newDueDate: z.string({ error: "New due date is required" }),
  }),
});

const markLost = z.object({
  params: z.object({ id: z.string() }),
});

const getById = z.object({
  params: z.object({ id: z.string() }),
});

export const BorrowValidation = {
  borrowBook,
  returnBook,
  renewBook,
  markLost,
  getById,
};
