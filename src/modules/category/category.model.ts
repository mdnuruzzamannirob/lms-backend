import { model, Query, Schema } from 'mongoose'
import { CategoryModel, ICategory } from './category.interface'

const categorySchema = new Schema<ICategory, CategoryModel>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

categorySchema.pre(/^find/, function (this: Query<any, ICategory>) {
  this.where({ isDeleted: { $ne: true } })
})

const Category = model<ICategory, CategoryModel>('Category', categorySchema)

export default Category
