import { Document, Model, Types } from "mongoose";

export type TBorrowStatus = "borrowed" | "returned" | "overdue" | "lost";

export interface IBorrowRecord extends Document {
  book: Types.ObjectId;
  member: Types.ObjectId;
  issuedBy: Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  returnedTo?: Types.ObjectId;
  status: TBorrowStatus;
  renewCount: number;
  maxRenewals: number;
  notes?: string;
}

export type BorrowRecordModel = Model<IBorrowRecord>;
