import { Document, Model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  isDeleted: boolean;
}

export type CategoryModel = Model<ICategory>;
