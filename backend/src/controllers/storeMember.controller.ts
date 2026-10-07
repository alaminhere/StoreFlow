import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../db/db.js';
import ApiError from '../helpers/apiError.js';
import { getNextId } from '../helpers/getNextId.js';
import sendResponse from '../helpers/sendResponse.js';
import { Prisma } from '../generated/prisma/client.js';
import { emitToStore } from '../helpers/socket/socket.js';
import { ID_PREFIX, PAGINATION } from '../constants/index.js';
import {
  createStoreMemberSchema,
  deleteStoreMemberSchema,
  updateStoreMemberSchema,
} from '../validations/storeMember.validation.js';

/*-----------------------------------------*
 * returns a paginated list of store members
 * for the current store, with optional search
 * by user name
 *-----------------------------------------*/
export const getCurrentStoreMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeId = res.locals.storeId;
    const { search, page } = req.query;

    const limit = PAGINATION.DEFAULT_LIMIT;
    const currentPage = Number(page) || PAGINATION.DEFAULT_PAGE;
    const skip = (currentPage - 1) * limit;

    const filter: Prisma.StoreMemberWhereInput = {
      storeId: storeId!,
    };

    if (search) {
      filter.user = {
        name: { contains: String(search).trim() },
      };
    }

    const [members, totalMembers] = await Promise.all([
      prisma.storeMember.findMany({
        where: filter,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              address: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.storeMember.count({ where: filter }),
    ]);

    const formattedMembers = members.map(member => ({
      id: member.id,
      userId: member.userId,
      name: member.user.name,
      email: member.user.email,
      phone: member.user.phone,
      role: member.role,
      address: member.user.address,
      createdAt: member.createdAt,
    }));

    const totalPage = Math.ceil(totalMembers / limit);

    return sendResponse(res, 200, true, 'Members fetched successfully', {
      members: formattedMembers,
      totalPage,
    });
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * creates a new store member. validates that
 * the user exists and is not already a member.
 *-----------------------------------------*/
export const createStoreMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, role } = createStoreMemberSchema.parse(req.body);
    const storeId = res.locals.storeId;

    const existsUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existsUser) {
      throw new ApiError(404, 'User not found');
    }

    const existsMember = await prisma.storeMember.findUnique({
      where: {
        storeId_id: {
          storeId: storeId!,
          id: userId,
        },
      },
    });

    if (existsMember) {
      throw new ApiError(409, 'User is already a member of this store');
    }

    await prisma.storeMember.create({
      data: {
        id: await getNextId(storeId!, ID_PREFIX.MEMBER),
        storeId: storeId!,
        userId,
        role,
      },
    });

    emitToStore(storeId!, 'member:updated');
    return sendResponse(res, 201, true, 'Member created successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * updates a store member role for the
 * current store
 *-----------------------------------------*/
export const updateStoreMember = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const storeId = res.locals.storeId;
    const { role } = updateStoreMemberSchema.parse(req.body);

    const existsMember = await prisma.storeMember.findUnique({
      where: {
        storeId_id: {
          storeId: storeId!,
          id,
        },
      },
    });

    if (!existsMember) {
      throw new ApiError(404, 'Member not found');
    }

    await prisma.storeMember.update({
      where: {
        storeId_id: {
          storeId: storeId!,
          id,
        },
      },
      data: { role },
    });

    emitToStore(storeId!, 'member:updated');
    return sendResponse(res, 200, true, 'Member updated successfully');
  } catch (error) {
    next(error);
  }
};

/*-----------------------------------------*
 * deletes one or more store members from the
 * current store. Hard delete memberships
 * can be removed permanently.
 *-----------------------------------------*/
export const deleteStoreMember = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ids } = deleteStoreMemberSchema.parse(req.body);
    const storeId = res.locals.storeId;

    const existingMembers = await prisma.storeMember.findMany({
      where: {
        storeId: storeId!,
        id: { in: ids },
      },
      select: { id: true },
    });

    if (existingMembers.length !== ids.length) {
      throw new ApiError(404, 'Some members not found');
    }

    const result = await prisma.storeMember.deleteMany({
      where: {
        storeId: storeId!,
        id: { in: ids },
      },
    });

    emitToStore(storeId!, 'member:updated');
    return sendResponse(
      res,
      200,
      true,
      `${result.count} ${result.count > 1 ? 'members' : 'member'} deleted successfully`,
    );
  } catch (error) {
    next(error);
  }
};
