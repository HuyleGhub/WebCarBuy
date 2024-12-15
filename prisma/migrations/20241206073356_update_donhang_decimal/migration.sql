/*
  Warnings:

  - You are about to alter the column `TongTien` on the `donhang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(19,4)`.

*/
-- AlterTable
ALTER TABLE `donhang` MODIFY `TongTien` DECIMAL(19, 4) NULL;
