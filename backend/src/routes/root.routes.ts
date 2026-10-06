import express from 'express';
import { prisma } from '../db/db.js';

const rootRoutes = express.Router();

// dynamic auto query
rootRoutes.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok' });
});

export default rootRoutes;
