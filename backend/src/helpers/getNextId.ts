import type { IdPrefix } from '../constants/index.js';
import { prisma } from '../db/db.js';

export const getNextId = async (storeId: string, prefix: IdPrefix) => {
  const counter = await prisma.counter.upsert({
    where: {
      storeId_name: {
        storeId,
        name: prefix,
      },
    },
    update: {
      value: {
        increment: 1,
      },
    },
    create: {
      storeId,
      name: prefix,
      value: 1,
    },
  });

  return `${prefix}_${String(counter.value).padStart(3, '0')}`;
};
