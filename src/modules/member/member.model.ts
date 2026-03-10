import { Schema, model } from "mongoose";
import { IMember, MemberModel } from "./member.interface";

const memberSchema = new Schema<IMember, MemberModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    membershipId: { type: String, required: true, unique: true },
    membershipType: {
      type: String,
      enum: ["standard", "premium", "student"],
      default: "standard",
    },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    maxBooksAllowed: { type: Number, default: 3 },
    currentBorrowed: { type: Number, default: 0 },
    membershipExpiry: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

memberSchema.pre(/^find/, function (this: any, next: () => void) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

const Member = model<IMember, MemberModel>("Member", memberSchema);

export default Member;
