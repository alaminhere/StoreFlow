import { z } from 'zod';
import { StoreMemberRole } from '../generated/prisma/enums.js';

export const createStoreMemberSchema = z.object({
  userId: z.string({ message: 'User Id is required' }),
  role: z.nativeEnum(StoreMemberRole, {
    message: 'Role must be OWNER, ADMIN, MANAGER, or SALESMAN',
  }),
});
export const updateStoreMemberSchema = z.object({
  role: z.nativeEnum(StoreMemberRole, {
    message: 'Role must be OWNER, ADMIN, MANAGER, or SALESMAN',
  }),
});
export const deleteStoreMemberSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one member ID is required'),
});
