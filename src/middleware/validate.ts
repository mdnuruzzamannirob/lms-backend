import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import AppError from "../errors/AppError";

const validateRequest = (schema: ZodType) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues
          .map((e) => `${e.path.slice(1).join(".")}: ${e.message}`)
          .join("; ");
        next(new AppError(messages, StatusCodes.BAD_REQUEST));
      } else {
        next(error);
      }
    }
  };
};

export default validateRequest;
