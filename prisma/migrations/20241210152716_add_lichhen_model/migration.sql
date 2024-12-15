-- CreateTable
CREATE TABLE `LichHen` (
    `idLichHen` INTEGER NOT NULL AUTO_INCREMENT,
    `TenKhachHang` VARCHAR(225) NULL,
    `Sdt` VARCHAR(15) NULL,
    `Email` VARCHAR(225) NULL,
    `idXe` INTEGER NULL,
    `idLoaiXe` INTEGER NULL,
    `GioHen` DATETIME(3) NULL,
    `NgayHen` DATETIME(3) NULL,
    `DiaDiem` VARCHAR(225) NULL,

    PRIMARY KEY (`idLichHen`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LichHen` ADD CONSTRAINT `LichHen_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHen` ADD CONSTRAINT `LichHen_idLoaiXe_fkey` FOREIGN KEY (`idLoaiXe`) REFERENCES `LoaiXe`(`idLoaiXe`) ON DELETE SET NULL ON UPDATE CASCADE;
