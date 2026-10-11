/*
  Warnings:

  - The primary key for the `Return` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id,storeId]` on the table `Return` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `ReturnItem` DROP FOREIGN KEY `ReturnItem_returnId_fkey`;

-- DropIndex
DROP INDEX `ReturnItem_returnId_fkey` ON `ReturnItem`;

-- AlterTable
ALTER TABLE `Return` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`storeId`, `id`);

-- CreateIndex
CREATE UNIQUE INDEX `Return_id_storeId_key` ON `Return`(`id`, `storeId`);

-- AddForeignKey
ALTER TABLE `ReturnItem` ADD CONSTRAINT `ReturnItem_returnId_storeId_fkey` FOREIGN KEY (`returnId`, `storeId`) REFERENCES `Return`(`id`, `storeId`) ON DELETE CASCADE ON UPDATE CASCADE;
