import { Document, Model, Types } from "mongoose";

export type TMembershipType = "standard" | "premium" | "student";

export interface IMember extends Document {
  user: Types.ObjectId;
  membershipId: string;
  membershipType: TMembershipType;
  phone?: string;
  address?: string;
  maxBooksAllowed: number;
  currentBorrowed: number;
  membershipExpiry: Date;
  isActive: boolean;
  isDeleted: boolean;
}

export type MemberModel = Model<IMember>;
