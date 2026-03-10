import { Schema, model } from "mongoose";
import { CategoryModel, ICategory } from "./category.interface";

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

categorySchema.pre(/^find/, function (this: any, next: () => void) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

const Category = model<ICategory, CategoryModel>("Category", categorySchema);

export default Category;
