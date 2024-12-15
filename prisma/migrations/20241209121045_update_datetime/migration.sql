/*
  Warnings:

  - You are about to alter the column `GioHenLayXe` on the `lichhenlayxe` table. The data in that column could be lost. The data in that column will be cast from `Time(0)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `lichhenlayxe` MODIFY `NgayLayXe` DATETIME(3) NULL,
    MODIFY `GioHenLayXe` DATETIME(3) NULL;
