import { StatusCodes } from "http-status-codes";
import { randomBytes } from "crypto";
import Member from "./member.model";
import { IMember, TMembershipType } from "./member.interface";
import AppError from "../../errors/AppError";

const MAX_BOOKS: Record<TMembershipType, number> = {
  student: 3,
  standard: 5,
  premium: 10,
};

const generateMembershipId = (): string => {
  const hex = randomBytes(4).toString("hex").toUpperCase();
  return `LIB-${hex}`;
};

interface MemberQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  membershipType?: string;
  isActive?: boolean;
}

const createMember = async (payload: any) => {
  const existing = await Member.findOne({ user: payload.user });
  if (existing) {
    throw new AppError("User already has a membership", StatusCodes.CONFLICT);
  }

  const membershipType = (payload.membershipType ||
    "standard") as TMembershipType;
  const data: Partial<IMember> = {
    ...payload,
    membershipId: generateMembershipId(),
    membershipType,
    maxBooksAllowed: MAX_BOOKS[membershipType],
    membershipExpiry: new Date(payload.membershipExpiry),
  };

  const member = await Member.create(data);
  return Member.findById(member._id).populate("user", "-password").lean();
};

const getAllMembers = async (options: MemberQueryOptions) => {
  const { page = 1, limit = 10, search, membershipType, isActive } = options;

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [{ membershipId: { $regex: search, $options: "i" } }];
  }
  if (membershipType) filter.membershipType = membershipType;
  if (typeof isActive !== "undefined") filter.isActive = isActive;

  const skip = (page - 1) * limit;

  const [members, total] = await Promise.all([
    Member.find(filter)
      .populate("user", "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Member.countDocuments(filter),
  ]);

  return {
    data: members,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getMemberById = async (id: string) => {
  const member = await Member.findById(id).populate("user", "-password").lean();
  if (!member) {
    throw new AppError("Member not found", StatusCodes.NOT_FOUND);
  }
  return member;
};

const getMemberByUserId = async (userId: string) => {
  const member = await Member.findOne({ user: userId })
    .populate("user", "-password")
    .lean();
  if (!member) {
    throw new AppError("Member not found", StatusCodes.NOT_FOUND);
  }
  return member;
};

const updateMember = async (id: string, payload: Partial<IMember>) => {
  if (payload.membershipType) {
    payload.maxBooksAllowed = MAX_BOOKS[payload.membershipType];
  }
  if ((payload as any).membershipExpiry) {
    (payload as any).membershipExpiry = new Date(
      (payload as any).membershipExpiry,
    );
  }

  const member = await Member.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("user", "-password")
    .lean();
  if (!member) {
    throw new AppError("Member not found", StatusCodes.NOT_FOUND);
  }
  return member;
};

const deleteMember = async (id: string) => {
  const member = await Member.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!member) {
    throw new AppError("Member not found", StatusCodes.NOT_FOUND);
  }
  return null;
};

export const MemberService = {
  createMember,
  getAllMembers,
  getMemberById,
  getMemberByUserId,
  updateMember,
  deleteMember,
};
