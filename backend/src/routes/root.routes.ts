import express from 'express';
import { prisma } from '../db/db.js';
import authRoutes from './auth.routes.js';

const rootRoutes = express.Router();

rootRoutes.use('/auth', authRoutes);

// dynamic auto query
rootRoutes.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok' });
});

export default rootRoutes;
