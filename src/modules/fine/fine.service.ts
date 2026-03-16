import { StatusCodes } from 'http-status-codes'
import { ClientSession, Types } from 'mongoose'
import AppError from '../../errors/AppError'
import Member from '../member/member.model'
import Fine from './fine.model'

interface CreateFinePayload {
  member: string
  borrowRecord: string
  amount: number
  reason: string
}

interface FineQueryOptions {
  page?: number
  limit?: number
  status?: string
  member?: string
}

const createFine = async (
  payload: CreateFinePayload,
  session?: ClientSession,
) => {
  const opts = session ? { session } : {}
  const [fine] = await Fine.create([payload], opts)
  return fine
}

const getAllFines = async (options: FineQueryOptions) => {
  const { page = 1, limit = 10, status, member } = options

  const filter: Record<string, unknown> = {}
  if (status) filter.status = status
  if (member) filter.member = member

  const skip = (page - 1) * limit

  const [fines, total] = await Promise.all([
    Fine.find(filter)
      .populate('member', 'membershipId')
      .populate('borrowRecord', 'borrowDate dueDate returnDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Fine.countDocuments(filter),
  ])

  return {
    data: fines,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  }
}

const getFineById = async (id: string) => {
  const fine = await Fine.findById(id)
    .populate('member')
    .populate('borrowRecord')
    .lean()
  if (!fine) {
    throw new AppError('Fine not found', StatusCodes.NOT_FOUND)
  }
  return fine
}

const getMyFines = async (userId: string, options: FineQueryOptions) => {
  const { page = 1, limit = 10, status } = options

  const member = await Member.findOne({ user: userId })
  if (!member) {
    throw new AppError('You are not a library member', StatusCodes.NOT_FOUND)
  }

  const filter: Record<string, unknown> = { member: member._id }
  if (status) filter.status = status

  const skip = (page - 1) * limit

  const [fines, total] = await Promise.all([
    Fine.find(filter)
      .populate('borrowRecord', 'borrowDate dueDate returnDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Fine.countDocuments(filter),
  ])

  return {
    data: fines,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  }
}

const payFine = async (id: string) => {
  const fine = await Fine.findById(id)
  if (!fine) {
    throw new AppError('Fine not found', StatusCodes.NOT_FOUND)
  }
  if (fine.status === 'paid') {
    throw new AppError('Fine already paid', StatusCodes.BAD_REQUEST)
  }
  if (fine.status === 'waived') {
    throw new AppError('Fine was waived', StatusCodes.BAD_REQUEST)
  }

  fine.status = 'paid'
  fine.paidAt = new Date()
  await fine.save()

  return Fine.findById(id).populate('member').populate('borrowRecord').lean()
}

const waiveFine = async (id: string) => {
  const fine = await Fine.findById(id)
  if (!fine) {
    throw new AppError('Fine not found', StatusCodes.NOT_FOUND)
  }
  if (fine.status === 'paid') {
    throw new AppError('Cannot waive a paid fine', StatusCodes.BAD_REQUEST)
  }

  fine.status = 'waived'
  await fine.save()

  return Fine.findById(id).populate('member').populate('borrowRecord').lean()
}

const getMemberFinesSummary = async (memberId: string) => {
  const result = await Fine.aggregate([
    { $match: { member: new Types.ObjectId(memberId) } },
    {
      $group: {
        _id: '$status',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ])

  const summary: Record<string, { total: number; count: number }> = {}
  result.forEach(
    (r: { _id: string; total: number; count: number }) =>
      (summary[r._id] = { total: r.total, count: r.count }),
  )
  return summary
}

export const FineService = {
  createFine,
  getAllFines,
  getFineById,
  getMyFines,
  payFine,
  waiveFine,
  getMemberFinesSummary,
}
