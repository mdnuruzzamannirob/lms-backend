import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { MemberService } from "./member.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const createMember = catchAsync(async (req: Request, res: Response) => {
  const member = await MemberService.createMember(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Member created successfully",
    data: member,
  });
});

const getAllMembers = catchAsync(async (req: Request, res: Response) => {
  const options = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search as string | undefined,
    membershipType: req.query.membershipType as string | undefined,
    isActive:
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined,
  };
  const result = await MemberService.getAllMembers(options);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Members retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getMemberById = catchAsync(async (req: Request, res: Response) => {
  const member = await MemberService.getMemberById(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Member retrieved successfully",
    data: member,
  });
});

const getMyMembership = catchAsync(async (req: Request, res: Response) => {
  const member = await MemberService.getMemberByUserId(req.user!.userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Membership retrieved successfully",
    data: member,
  });
});

const updateMember = catchAsync(async (req: Request, res: Response) => {
  const member = await MemberService.updateMember(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Member updated successfully",
    data: member,
  });
});

const deleteMember = catchAsync(async (req: Request, res: Response) => {
  await MemberService.deleteMember(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Member deleted successfully",
    data: null,
  });
});

export const MemberController = {
  createMember,
  getAllMembers,
  getMemberById,
  getMyMembership,
  updateMember,
  deleteMember,
};
