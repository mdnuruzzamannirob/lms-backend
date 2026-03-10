import { StatusCodes } from "http-status-codes";
import Book from "./book.model";
import { IBook } from "./book.interface";
import AppError from "../../errors/AppError";

interface BookQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  category?: string;
  language?: string;
  available?: boolean;
}

const createBook = async (payload: Partial<IBook>) => {
  const existing = await Book.findOne({ isbn: payload.isbn });
  if (existing) {
    throw new AppError(
      "A book with this ISBN already exists",
      StatusCodes.CONFLICT,
    );
  }
  if (payload.availableCopies === undefined) {
    payload.availableCopies = payload.totalCopies;
  }
  const book = await Book.create(payload);
  return Book.findById(book._id).populate("category").lean();
};

const getAllBooks = async (options: BookQueryOptions) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search,
    category,
    language,
    available,
  } = options;

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { authors: { $regex: search, $options: "i" } },
      { isbn: { $regex: search, $options: "i" } },
    ];
  }
  if (category) filter.category = category;
  if (language) filter.language = { $regex: language, $options: "i" };
  if (available === true) filter.availableCopies = { $gt: 0 };
  if (available === false) filter.availableCopies = 0;

  const skip = (page - 1) * limit;
  const sortObj: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [books, total] = await Promise.all([
    Book.find(filter)
      .populate("category")
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean(),
    Book.countDocuments(filter),
  ]);

  return {
    data: books,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getBookById = async (id: string) => {
  const book = await Book.findById(id).populate("category").lean();
  if (!book) {
    throw new AppError("Book not found", StatusCodes.NOT_FOUND);
  }
  return book;
};

const updateBook = async (id: string, payload: Partial<IBook>) => {
  const book = await Book.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("category")
    .lean();
  if (!book) {
    throw new AppError("Book not found", StatusCodes.NOT_FOUND);
  }
  return book;
};

const deleteBook = async (id: string) => {
  const book = await Book.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!book) {
    throw new AppError("Book not found", StatusCodes.NOT_FOUND);
  }
  return null;
};

export const BookService = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
