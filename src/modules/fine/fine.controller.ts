import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { FineService } from './fine.service'

const getAllFines = catchAsync(async (req: Request, res: Response) => {
  const options = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    status: req.query.status as string | undefined,
    member: req.query.member as string | undefined,
  }
  const result = await FineService.getAllFines(options)
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Fines retrieved successfully',
    data: result.data,
    meta: result.meta,
  })
})

const getFineById = catchAsync(async (req: Request, res: Response) => {
  const fine = await FineService.getFineById(req.params.id as string)
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Fine retrieved successfully',
    data: fine,
  })
})

const getMyFines = catchAsync(async (req: Request, res: Response) => {
  const options = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    status: req.query.status as string | undefined,
  }
  const result = await FineService.getMyFines(req.user!.userId, options)
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Your fines retrieved successfully',
    data: result.data,
    meta: result.meta,
  })
})

const payFine = catchAsync(async (req: Request, res: Response) => {
  const fine = await FineService.payFine(req.params.id as string)
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Fine paid successfully',
    data: fine,
  })
})

const waiveFine = catchAsync(async (req: Request, res: Response) => {
  const fine = await FineService.waiveFine(req.params.id as string)
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Fine waived successfully',
    data: fine,
  })
})

const getMemberFinesSummary = catchAsync(
  async (req: Request, res: Response) => {
    const summary = await FineService.getMemberFinesSummary(
      req.params.memberId as string,
    )
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Member fine summary retrieved',
      data: summary,
    })
  },
)

export const FineController = {
  getAllFines,
  getFineById,
  getMyFines,
  payFine,
  waiveFine,
  getMemberFinesSummary,
}
