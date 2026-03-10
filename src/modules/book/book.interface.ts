import { Document, Model, Types } from "mongoose";

export interface IBook extends Document {
  title: string;
  isbn: string;
  authors: string[];
  publisher?: string;
  publishedYear?: number;
  category: Types.ObjectId;
  language: string;
  pages?: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation?: string;
  coverImage?: string;
  description?: string;
  isDeleted: boolean;
}

export type BookModel = Model<IBook>;
