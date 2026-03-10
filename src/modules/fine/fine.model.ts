import { Schema, model } from "mongoose";
import { FineModel, IFine } from "./fine.interface";

const fineSchema = new Schema<IFine, FineModel>(
  {
    member: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    borrowRecord: {
      type: Schema.Types.ObjectId,
      ref: "BorrowRecord",
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "paid", "waived"],
      default: "pending",
    },
    paidAt: { type: Date },
  },
  { timestamps: true },
);

fineSchema.index({ member: 1, status: 1 });

const Fine = model<IFine, FineModel>("Fine", fineSchema);

export default Fine;
