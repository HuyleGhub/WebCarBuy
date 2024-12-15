/*
  Warnings:

  - The `SotienDat` column on the `datcoc` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `datcoc` DROP COLUMN `SotienDat`,
    ADD COLUMN `SotienDat` DECIMAL(19, 4) NULL;
