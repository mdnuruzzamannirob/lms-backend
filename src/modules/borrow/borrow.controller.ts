import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BorrowService } from "./borrow.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const borrowBook = catchAsync(async (req: Request, res: Response) => {
  const record = await BorrowService.borrowBook(req.body, req.user!.userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Book borrowed successfully",
    data: record,
  });
});

const returnBook = catchAsync(async (req: Request, res: Response) => {
  const record = await BorrowService.returnBook(
    req.params.id as string,
    req.user!.userId,
    req.body.notes,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Book returned successfully",
    data: record,
  });
});

const renewBook = catchAsync(async (req: Request, res: Response) => {
  const record = await BorrowService.renewBook(
    req.params.id as string,
    req.body.newDueDate,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Book renewed successfully",
    data: record,
  });
});

const markLost = catchAsync(async (req: Request, res: Response) => {
  const record = await BorrowService.markLost(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Book marked as lost",
    data: record,
  });
});

const getAllBorrowRecords = catchAsync(async (req: Request, res: Response) => {
  const options = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    status: req.query.status as string | undefined,
    member: req.query.member as string | undefined,
    book: req.query.book as string | undefined,
  };
  const result = await BorrowService.getAllBorrowRecords(options);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Borrow records retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getBorrowRecordById = catchAsync(async (req: Request, res: Response) => {
  const record = await BorrowService.getBorrowRecordById(
    req.params.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Borrow record retrieved successfully",
    data: record,
  });
});

const getMyBorrowHistory = catchAsync(async (req: Request, res: Response) => {
  const options = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    status: req.query.status as string | undefined,
  };
  const result = await BorrowService.getMyBorrowHistory(
    req.user!.userId,
    options,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Borrow history retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getOverdueRecords = catchAsync(async (_req: Request, res: Response) => {
  const records = await BorrowService.getOverdueRecords();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Overdue records retrieved successfully",
    data: records,
  });
});

export const BorrowController = {
  borrowBook,
  returnBook,
  renewBook,
  markLost,
  getAllBorrowRecords,
  getBorrowRecordById,
  getMyBorrowHistory,
  getOverdueRecords,
};
