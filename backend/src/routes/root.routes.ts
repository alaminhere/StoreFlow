import express from 'express';
import { prisma } from '../db/db.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import storeRoutes from './store.routes.js';
import brandRouters from './brand.routes.js';
import categoryRouters from './category.routes.js';
import customerRouters from './customer.routes.js';
import supplierRouters from './supplier.routes.js';
import storeMemberRouters from './storeMember.routes.js';
import productRouters from './product.routes.js';
import saleRouters from './sale.routes.js';
import purchaseRouters from './purchase.routes.js';
import movementRouters from './movement.routes.js';
import paymentRouters from './payment.routes.js';
import returnRouters from './return.routes.js';
import dashboardRouters from './dashboard.routes.js';
import { cleanupExpiredTempData } from '../controllers/cleanup.controller.js';
import invoiceRoute from './invoice.routes.js';
import { generalLimiter } from '../middlewares/rateLimit.js';

const rootRoutes = express.Router();

rootRoutes.use(generalLimiter);

rootRoutes.use('/auth', authRoutes);
rootRoutes.use('/user', userRoutes);
rootRoutes.use('/store', storeRoutes);
rootRoutes.use('/brand', brandRouters);
rootRoutes.use('/category', categoryRouters);
rootRoutes.use('/customer', customerRouters);
rootRoutes.use('/supplier', supplierRouters);
rootRoutes.use('/member', storeMemberRouters);
rootRoutes.use('/product', productRouters);
rootRoutes.use('/sale', saleRouters);
rootRoutes.use('/purchase', purchaseRouters);
rootRoutes.use('/movement', movementRouters);
rootRoutes.use('/payment', paymentRouters);
rootRoutes.use('/return', returnRouters);
rootRoutes.use('/dashboard', dashboardRouters);
rootRoutes.use('/invoices', invoiceRoute);

// dynamic auto query
rootRoutes.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ok' });
});
rootRoutes.get('/cleanUp', cleanupExpiredTempData);

export default rootRoutes;
