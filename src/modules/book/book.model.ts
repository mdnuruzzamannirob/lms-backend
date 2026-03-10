import { Schema, model } from "mongoose";
import { BookModel, IBook } from "./book.interface";

const bookSchema = new Schema<IBook, BookModel>(
  {
    title: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    authors: { type: [String], required: true },
    publisher: { type: String, trim: true },
    publishedYear: { type: Number },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    language: { type: String, default: "English", trim: true },
    pages: { type: Number },
    totalCopies: { type: Number, required: true, min: 0 },
    availableCopies: { type: Number, required: true, min: 0 },
    shelfLocation: { type: String, trim: true },
    coverImage: { type: String },
    description: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

bookSchema.pre(/^find/, function (this: any, next: () => void) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

const Book = model<IBook, BookModel>("Book", bookSchema);

export default Book;
