import express from 'express';
import { prisma } from '../db/db.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import storeRoutes from './store.routes.js';

const rootRoutes = express.Router();

rootRoutes.use('/auth', authRoutes);
rootRoutes.use('/user', userRoutes);
rootRoutes.use('/store', storeRoutes);

// dynamic auto query
rootRoutes.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok' });
});

export default rootRoutes;
