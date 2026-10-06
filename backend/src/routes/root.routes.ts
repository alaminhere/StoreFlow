import express from 'express';
import { prisma } from '../db/db.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';

const rootRoutes = express.Router();

rootRoutes.use('/auth', authRoutes);
rootRoutes.use('/user', userRoutes);

// dynamic auto query
rootRoutes.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok' });
});

export default rootRoutes;
