import { Document, Model, Types } from "mongoose";

export type TFineStatus = "pending" | "paid" | "waived";

export interface IFine extends Document {
  member: Types.ObjectId;
  borrowRecord: Types.ObjectId;
  amount: number;
  reason: string;
  status: TFineStatus;
  paidAt?: Date;
}

export type FineModel = Model<IFine>;
