-- AlterTable
ALTER TABLE `Product` ADD COLUMN `isLowStock` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Product_storeId_isLowStock_idx` ON `Product`(`storeId`, `isLowStock`);
