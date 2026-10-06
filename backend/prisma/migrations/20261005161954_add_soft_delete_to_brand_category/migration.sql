-- AlterTable
ALTER TABLE `Brand` ADD COLUMN `deletedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `deletedAt` DATETIME(3) NULL;
