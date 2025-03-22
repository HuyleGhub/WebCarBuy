-- AlterTable
ALTER TABLE `lichhen` ADD COLUMN `idUser` INTEGER NULL;

-- CreateTable
CREATE TABLE `DanhGiaTraiNghiem` (
    `idDanhGia` INTEGER NOT NULL AUTO_INCREMENT,
    `idLichHen` INTEGER NOT NULL,
    `idUser` INTEGER NOT NULL,
    `idXe` INTEGER NOT NULL,
    `SoSao` INTEGER NULL,
    `NoiDung` LONGTEXT NULL,
    `NgayDanhGia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idDanhGia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DanhGiaTraiNghiem` ADD CONSTRAINT `DanhGiaTraiNghiem_idLichHen_fkey` FOREIGN KEY (`idLichHen`) REFERENCES `LichHen`(`idLichHen`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DanhGiaTraiNghiem` ADD CONSTRAINT `DanhGiaTraiNghiem_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `Users`(`idUsers`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DanhGiaTraiNghiem` ADD CONSTRAINT `DanhGiaTraiNghiem_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHen` ADD CONSTRAINT `LichHen_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;
