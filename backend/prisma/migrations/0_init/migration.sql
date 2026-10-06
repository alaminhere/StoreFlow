-- CreateTable
CREATE TABLE `Brand` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Brand_id_storeId_key`(`id` ASC, `storeId` ASC),
    INDEX `Brand_storeId_idx`(`storeId` ASC),
    UNIQUE INDEX `Brand_storeId_name_key`(`storeId` ASC, `name` ASC),
    UNIQUE INDEX `Brand_storeId_slug_key`(`storeId` ASC, `slug` ASC),
    PRIMARY KEY (`storeId` ASC, `id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Category_id_storeId_key`(`id` ASC, `storeId` ASC),
    INDEX `Category_storeId_idx`(`storeId` ASC),
    UNIQUE INDEX `Category_storeId_name_key`(`storeId` ASC, `name` ASC),
    UNIQUE INDEX `Category_storeId_slug_key`(`storeId` ASC, `slug` ASC),
    PRIMARY KEY (`storeId` ASC, `id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Counter` (
    `name` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL DEFAULT 0,
    `storeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`storeId` ASC, `name` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Customer_id_storeId_key`(`id` ASC, `storeId` ASC),
    INDEX `Customer_storeId_idx`(`storeId` ASC),
    INDEX `Customer_storeId_name_idx`(`storeId` ASC, `name` ASC),
    UNIQUE INDEX `Customer_storeId_phone_key`(`storeId` ASC, `phone` ASC),
    PRIMARY KEY (`storeId` ASC, `id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` JSON NULL,
    `sku` VARCHAR(191) NOT NULL,
    `barcode` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `brandId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `sellingPrice` DECIMAL(12, 2) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `minimumStockLevel` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `Product_brandId_storeId_fkey`(`brandId` ASC, `storeId` ASC),
    INDEX `Product_categoryId_storeId_fkey`(`categoryId` ASC, `storeId` ASC),
    UNIQUE INDEX `Product_id_storeId_key`(`id` ASC, `storeId` ASC),
    UNIQUE INDEX `Product_storeId_barcode_key`(`storeId` ASC, `barcode` ASC),
    INDEX `Product_storeId_brandId_idx`(`storeId` ASC, `brandId` ASC),
    INDEX `Product_storeId_categoryId_idx`(`storeId` ASC, `categoryId` ASC),
    INDEX `Product_storeId_deletedAt_idx`(`storeId` ASC, `deletedAt` ASC),
    INDEX `Product_storeId_idx`(`storeId` ASC),
    UNIQUE INDEX `Product_storeId_sku_key`(`storeId` ASC, `sku` ASC),
    UNIQUE INDEX `Product_storeId_slug_key`(`storeId` ASC, `slug` ASC),
    PRIMARY KEY (`storeId` ASC, `id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductSupplier` (
    `storeId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,

    INDEX `ProductSupplier_productId_storeId_fkey`(`productId` ASC, `storeId` ASC),
    INDEX `ProductSupplier_storeId_idx`(`storeId` ASC),
    INDEX `ProductSupplier_supplierId_storeId_fkey`(`supplierId` ASC, `storeId` ASC),
    PRIMARY KEY (`storeId` ASC, `productId` ASC, `supplierId` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NULL,
    `dueDate` DATETIME(3) NULL,
    `paymentMethod` ENUM('CASH', 'BANK_TRANSFER', 'BKASH', 'CARD') NOT NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `paid` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `total` DECIMAL(12, 2) NOT NULL,

    UNIQUE INDEX `Purchase_id_storeId_key`(`id` ASC, `storeId` ASC),
    INDEX `Purchase_storeId_idx`(`storeId` ASC),
    INDEX `Purchase_storeId_supplierId_idx`(`storeId` ASC, `supplierId` ASC),
    INDEX `Purchase_supplierId_storeId_fkey`(`supplierId` ASC, `storeId` ASC),
    PRIMARY KEY (`storeId` ASC, `id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseItem` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `purchaseId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `total` DECIMAL(12, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PurchaseItem_productId_storeId_fkey`(`productId` ASC, `storeId` ASC),
    INDEX `PurchaseItem_purchaseId_storeId_fkey`(`purchaseId` ASC, `storeId` ASC),
    INDEX `PurchaseItem_storeId_idx`(`storeId` ASC),
    INDEX `PurchaseItem_storeId_productId_idx`(`storeId` ASC, `productId` ASC),
    INDEX `PurchaseItem_storeId_purchaseId_idx`(`storeId` ASC, `purchaseId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchasePayment` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NULL,
    `purchaseId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `paymentMethod` ENUM('CASH', 'BANK_TRANSFER', 'BKASH', 'CARD') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PurchasePayment_purchaseId_storeId_fkey`(`purchaseId` ASC, `storeId` ASC),
    INDEX `PurchasePayment_storeId_idx`(`storeId` ASC),
    INDEX `PurchasePayment_storeId_purchaseId_idx`(`storeId` ASC, `purchaseId` ASC),
    INDEX `PurchasePayment_storeId_supplierId_idx`(`storeId` ASC, `supplierId` ASC),
    INDEX `PurchasePayment_supplierId_storeId_fkey`(`supplierId` ASC, `storeId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `paid` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `paymentMethod` ENUM('CASH', 'BANK_TRANSFER', 'BKASH', 'CARD') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `total` DECIMAL(12, 2) NOT NULL,

    INDEX `Sale_customerId_storeId_fkey`(`customerId` ASC, `storeId` ASC),
    UNIQUE INDEX `Sale_id_storeId_key`(`id` ASC, `storeId` ASC),
    INDEX `Sale_storeId_customerId_idx`(`storeId` ASC, `customerId` ASC),
    INDEX `Sale_storeId_idx`(`storeId` ASC),
    PRIMARY KEY (`storeId` ASC, `id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleItem` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `saleId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `total` DECIMAL(12, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SaleItem_productId_storeId_fkey`(`productId` ASC, `storeId` ASC),
    INDEX `SaleItem_saleId_storeId_fkey`(`saleId` ASC, `storeId` ASC),
    INDEX `SaleItem_storeId_idx`(`storeId` ASC),
    INDEX `SaleItem_storeId_productId_idx`(`storeId` ASC, `productId` ASC),
    INDEX `SaleItem_storeId_saleId_idx`(`storeId` ASC, `saleId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalePayment` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `saleId` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `paymentMethod` ENUM('CASH', 'BANK_TRANSFER', 'BKASH', 'CARD') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SalePayment_customerId_storeId_fkey`(`customerId` ASC, `storeId` ASC),
    INDEX `SalePayment_saleId_storeId_fkey`(`saleId` ASC, `storeId` ASC),
    INDEX `SalePayment_storeId_customerId_idx`(`storeId` ASC, `customerId` ASC),
    INDEX `SalePayment_storeId_idx`(`storeId` ASC),
    INDEX `SalePayment_storeId_saleId_idx`(`storeId` ASC, `saleId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockMovement` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `type` ENUM('PURCHASE', 'SALE', 'RETURN', 'STOCK_IN', 'STOCK_OUT', 'DAMAGE') NOT NULL,
    `reason` VARCHAR(191) NULL,
    `beforeStock` INTEGER NOT NULL,
    `afterStock` INTEGER NOT NULL,
    `purchaseId` VARCHAR(191) NULL,
    `saleId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StockMovement_productId_storeId_fkey`(`productId` ASC, `storeId` ASC),
    INDEX `StockMovement_purchaseId_storeId_fkey`(`purchaseId` ASC, `storeId` ASC),
    INDEX `StockMovement_saleId_storeId_fkey`(`saleId` ASC, `storeId` ASC),
    INDEX `StockMovement_storeId_idx`(`storeId` ASC),
    INDEX `StockMovement_storeId_productId_idx`(`storeId` ASC, `productId` ASC),
    INDEX `StockMovement_storeId_purchaseId_idx`(`storeId` ASC, `purchaseId` ASC),
    INDEX `StockMovement_storeId_saleId_idx`(`storeId` ASC, `saleId` ASC),
    INDEX `StockMovement_storeId_type_idx`(`storeId` ASC, `type` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Store` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `logo` JSON NULL,
    `tagline` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `invoiceFooterNote` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Store_email_key`(`email` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StoreMember` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `role` ENUM('OWNER', 'ADMIN', 'MANAGER', 'SALESMAN') NOT NULL DEFAULT 'SALESMAN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StoreMember_id_storeId_key`(`id` ASC, `storeId` ASC),
    INDEX `StoreMember_storeId_idx`(`storeId` ASC),
    UNIQUE INDEX `StoreMember_storeId_userId_key`(`storeId` ASC, `userId` ASC),
    INDEX `StoreMember_userId_idx`(`userId` ASC),
    PRIMARY KEY (`storeId` ASC, `id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `storeId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `shopName` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Supplier_id_storeId_key`(`id` ASC, `storeId` ASC),
    INDEX `Supplier_storeId_idx`(`storeId` ASC),
    INDEX `Supplier_storeId_name_idx`(`storeId` ASC, `name` ASC),
    UNIQUE INDEX `Supplier_storeId_phone_key`(`storeId` ASC, `phone` ASC),
    PRIMARY KEY (`storeId` ASC, `id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TempForgotPassData` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `otpExpiresAt` DATETIME(3) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `TempForgotPassData_email_key`(`email` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TempUser` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `otpExpiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TempUser_email_key`(`email` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Brand` ADD CONSTRAINT `Brand_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Counter` ADD CONSTRAINT `Counter_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_brandId_storeId_fkey` FOREIGN KEY (`brandId`, `storeId`) REFERENCES `Brand`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_storeId_fkey` FOREIGN KEY (`categoryId`, `storeId`) REFERENCES `Category`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSupplier` ADD CONSTRAINT `ProductSupplier_productId_storeId_fkey` FOREIGN KEY (`productId`, `storeId`) REFERENCES `Product`(`id`, `storeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSupplier` ADD CONSTRAINT `ProductSupplier_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSupplier` ADD CONSTRAINT `ProductSupplier_supplierId_storeId_fkey` FOREIGN KEY (`supplierId`, `storeId`) REFERENCES `Supplier`(`id`, `storeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_supplierId_storeId_fkey` FOREIGN KEY (`supplierId`, `storeId`) REFERENCES `Supplier`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseItem` ADD CONSTRAINT `PurchaseItem_productId_storeId_fkey` FOREIGN KEY (`productId`, `storeId`) REFERENCES `Product`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseItem` ADD CONSTRAINT `PurchaseItem_purchaseId_storeId_fkey` FOREIGN KEY (`purchaseId`, `storeId`) REFERENCES `Purchase`(`id`, `storeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseItem` ADD CONSTRAINT `PurchaseItem_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePayment` ADD CONSTRAINT `PurchasePayment_purchaseId_storeId_fkey` FOREIGN KEY (`purchaseId`, `storeId`) REFERENCES `Purchase`(`id`, `storeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePayment` ADD CONSTRAINT `PurchasePayment_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchasePayment` ADD CONSTRAINT `PurchasePayment_supplierId_storeId_fkey` FOREIGN KEY (`supplierId`, `storeId`) REFERENCES `Supplier`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_customerId_storeId_fkey` FOREIGN KEY (`customerId`, `storeId`) REFERENCES `Customer`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_productId_storeId_fkey` FOREIGN KEY (`productId`, `storeId`) REFERENCES `Product`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_saleId_storeId_fkey` FOREIGN KEY (`saleId`, `storeId`) REFERENCES `Sale`(`id`, `storeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalePayment` ADD CONSTRAINT `SalePayment_customerId_storeId_fkey` FOREIGN KEY (`customerId`, `storeId`) REFERENCES `Customer`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalePayment` ADD CONSTRAINT `SalePayment_saleId_storeId_fkey` FOREIGN KEY (`saleId`, `storeId`) REFERENCES `Sale`(`id`, `storeId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalePayment` ADD CONSTRAINT `SalePayment_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_productId_storeId_fkey` FOREIGN KEY (`productId`, `storeId`) REFERENCES `Product`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_purchaseId_storeId_fkey` FOREIGN KEY (`purchaseId`, `storeId`) REFERENCES `Purchase`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_saleId_storeId_fkey` FOREIGN KEY (`saleId`, `storeId`) REFERENCES `Sale`(`id`, `storeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StoreMember` ADD CONSTRAINT `StoreMember_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StoreMember` ADD CONSTRAINT `StoreMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `Store`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

