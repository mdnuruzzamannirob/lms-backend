import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const notFound = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    statusCode: StatusCodes.NOT_FOUND,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export default notFound;
