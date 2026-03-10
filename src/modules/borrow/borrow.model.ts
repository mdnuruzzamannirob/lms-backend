import { Schema, model } from "mongoose";
import { BorrowRecordModel, IBorrowRecord } from "./borrow.interface";

const borrowRecordSchema = new Schema<IBorrowRecord, BorrowRecordModel>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    member: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    issuedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    borrowDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    returnedTo: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue", "lost"],
      default: "borrowed",
    },
    renewCount: { type: Number, default: 0 },
    maxRenewals: { type: Number, default: 2 },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

borrowRecordSchema.index({ book: 1, member: 1, status: 1 });
borrowRecordSchema.index({ dueDate: 1, status: 1 });

const BorrowRecord = model<IBorrowRecord, BorrowRecordModel>(
  "BorrowRecord",
  borrowRecordSchema,
);

export default BorrowRecord;
