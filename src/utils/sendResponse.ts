import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const sendResponse = <T>(res: Response, payload: ApiResponse<T>): void => {
  res.status(payload.statusCode).json({
    success: payload.success,
    statusCode: payload.statusCode,
    message: payload.message,
    ...(payload.meta && { meta: payload.meta }),
    data: payload.data ?? null,
  });
};

export default sendResponse;
