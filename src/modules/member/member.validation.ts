import { z } from "zod";

const createMember = z.object({
  body: z.object({
    user: z.string({ error: "User ID is required" }),
    membershipType: z.enum(["standard", "premium", "student"]).optional(),
    phone: z.string().max(20).trim().optional(),
    address: z.string().max(300).trim().optional(),
    membershipExpiry: z.string({ error: "Membership expiry is required" }),
  }),
});

const updateMember = z.object({
  body: z.object({
    membershipType: z.enum(["standard", "premium", "student"]).optional(),
    phone: z.string().max(20).trim().optional(),
    address: z.string().max(300).trim().optional(),
    maxBooksAllowed: z.number().int().min(1).max(20).optional(),
    membershipExpiry: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({ id: z.string() }),
});

const getById = z.object({
  params: z.object({ id: z.string() }),
});

export const MemberValidation = {
  createMember,
  updateMember,
  getById,
};
