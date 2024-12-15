/*
  Warnings:

  - You are about to alter the column `DonGia` on the `chitietdonhang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(19,4)`.
  - You are about to alter the column `DonGia` on the `chitietnhap` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(19,4)`.
  - You are about to alter the column `GiaXe` on the `xe` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(19,4)`.

*/
-- AlterTable
ALTER TABLE `chitietdonhang` MODIFY `DonGia` DECIMAL(19, 4) NULL;

-- AlterTable
ALTER TABLE `chitietnhap` MODIFY `DonGia` DECIMAL(19, 4) NULL;

-- AlterTable
ALTER TABLE `xe` MODIFY `GiaXe` DECIMAL(19, 4) NULL;
