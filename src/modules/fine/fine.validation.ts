import { z } from "zod";

const payFine = z.object({
  params: z.object({ id: z.string() }),
});

const waiveFine = z.object({
  params: z.object({ id: z.string() }),
});

const getById = z.object({
  params: z.object({ id: z.string() }),
});

export const FineValidation = {
  payFine,
  waiveFine,
  getById,
};
