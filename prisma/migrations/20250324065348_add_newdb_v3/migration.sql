-- AlterTable
ALTER TABLE `thanhtoan` ADD COLUMN `idDatCoc` INTEGER NULL;

-- AlterTable
ALTER TABLE `xe` ADD COLUMN `idNhaCungCap` INTEGER NULL;

-- CreateTable
CREATE TABLE `ChiTietDatCoc` (
    `idChiTietDatCoc` INTEGER NOT NULL AUTO_INCREMENT,
    `idDatCoc` INTEGER NULL,
    `idXe` INTEGER NULL,
    `SoLuong` INTEGER NULL,
    `DonGia` DECIMAL(19, 4) NULL,

    UNIQUE INDEX `ChiTietDatCoc_idDatCoc_key`(`idDatCoc`),
    UNIQUE INDEX `ChiTietDatCoc_idXe_key`(`idXe`),
    PRIMARY KEY (`idChiTietDatCoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Xe` ADD CONSTRAINT `Xe_idNhaCungCap_fkey` FOREIGN KEY (`idNhaCungCap`) REFERENCES `NhaCungCap`(`idNhaCungCap`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThanhToan` ADD CONSTRAINT `ThanhToan_idDatCoc_fkey` FOREIGN KEY (`idDatCoc`) REFERENCES `DatCoc`(`idDatCoc`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietDatCoc` ADD CONSTRAINT `ChiTietDatCoc_idDatCoc_fkey` FOREIGN KEY (`idDatCoc`) REFERENCES `DatCoc`(`idDatCoc`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietDatCoc` ADD CONSTRAINT `ChiTietDatCoc_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;
