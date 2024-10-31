-- CreateTable
CREATE TABLE `Role` (
    `idRole` INTEGER NOT NULL,
    `TenNguoiDung` VARCHAR(45) NULL,

    PRIMARY KEY (`idRole`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `idUsers` INTEGER NOT NULL AUTO_INCREMENT,
    `Tentaikhoan` VARCHAR(225) NULL,
    `Matkhau` VARCHAR(225) NULL,
    `Hoten` VARCHAR(225) NULL,
    `Sdt` VARCHAR(15) NULL,
    `Diachi` VARCHAR(45) NULL,
    `Email` VARCHAR(45) NULL,
    `idRole` INTEGER NULL,
    `Ngaydangky` DATE NULL,

    UNIQUE INDEX `Users_Email_key`(`Email`),
    UNIQUE INDEX `Users_idRole_key`(`idRole`),
    PRIMARY KEY (`idUsers`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoaiXe` (
    `idLoaiXe` INTEGER NOT NULL AUTO_INCREMENT,
    `TenLoai` VARCHAR(225) NULL,
    `NhanHieu` VARCHAR(45) NULL,
    `HinhAnh` VARCHAR(255) NULL,

    PRIMARY KEY (`idLoaiXe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Xe` (
    `idXe` INTEGER NOT NULL AUTO_INCREMENT,
    `TenXe` VARCHAR(225) NULL,
    `idLoaiXe` INTEGER NULL,
    `GiaXe` DECIMAL(10, 2) NULL,
    `MauSac` VARCHAR(50) NULL,
    `DongCo` VARCHAR(225) NULL,
    `TrangThai` VARCHAR(50) NULL,
    `HinhAnh` VARCHAR(225) NULL,
    `NamSanXuat` VARCHAR(45) NULL,

    PRIMARY KEY (`idXe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DonHang` (
    `idDonHang` INTEGER NOT NULL AUTO_INCREMENT,
    `idKhachHang` INTEGER NULL,
    `TrangThaiDonHang` VARCHAR(225) NULL,
    `TongTien` DECIMAL(10, 2) NULL,
    `NgayDatHang` DATE NULL,

    UNIQUE INDEX `DonHang_idKhachHang_key`(`idKhachHang`),
    PRIMARY KEY (`idDonHang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChiTietDonHang` (
    `idChiTietDonHang` INTEGER NOT NULL AUTO_INCREMENT,
    `idDonHang` INTEGER NULL,
    `idXe` INTEGER NULL,
    `SoLuong` INTEGER NULL,
    `DonGia` DECIMAL(10, 2) NULL,

    UNIQUE INDEX `ChiTietDonHang_idDonHang_key`(`idDonHang`),
    UNIQUE INDEX `ChiTietDonHang_idXe_key`(`idXe`),
    PRIMARY KEY (`idChiTietDonHang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NhaCungCap` (
    `idNhaCungCap` INTEGER NOT NULL AUTO_INCREMENT,
    `TenNhaCungCap` VARCHAR(225) NULL,
    `Sdt` VARCHAR(15) NULL,
    `Email` VARCHAR(225) NULL,

    UNIQUE INDEX `NhaCungCap_Email_key`(`Email`),
    PRIMARY KEY (`idNhaCungCap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NhapHang` (
    `idNhapHang` INTEGER NOT NULL AUTO_INCREMENT,
    `idNhaCungCap` INTEGER NULL,
    `TenHang` VARCHAR(45) NULL,

    UNIQUE INDEX `NhapHang_idNhaCungCap_key`(`idNhaCungCap`),
    PRIMARY KEY (`idNhapHang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChiTietNhap` (
    `idChiTietNhap` INTEGER NOT NULL AUTO_INCREMENT,
    `idNhapHang` INTEGER NULL,
    `idXe` INTEGER NULL,
    `SoLuong` INTEGER NULL,
    `DonGia` DECIMAL(10, 2) NULL,

    UNIQUE INDEX `ChiTietNhap_idNhapHang_key`(`idNhapHang`),
    UNIQUE INDEX `ChiTietNhap_idXe_key`(`idXe`),
    PRIMARY KEY (`idChiTietNhap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GioHang` (
    `idGioHang` INTEGER NOT NULL AUTO_INCREMENT,
    `idXe` INTEGER NULL,
    `idKhachHang` INTEGER NULL,
    `SoLuong` INTEGER NULL,

    UNIQUE INDEX `GioHang_idXe_key`(`idXe`),
    UNIQUE INDEX `GioHang_idKhachHang_key`(`idKhachHang`),
    PRIMARY KEY (`idGioHang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichLamViec` (
    `idLichLamViec` INTEGER NOT NULL AUTO_INCREMENT,
    `idNhanVienTuVan` INTEGER NULL,
    `NgayLam` DATE NULL,
    `CaLam` VARCHAR(50) NULL,
    `GioLam` TIME(0) NULL,
    `GioKetThuc` TIME(0) NULL,

    UNIQUE INDEX `LichLamViec_idNhanVienTuVan_key`(`idNhanVienTuVan`),
    PRIMARY KEY (`idLichLamViec`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TuVanKhachHang` (
    `idTuVanKhachHang` INTEGER NOT NULL AUTO_INCREMENT,
    `idKhachHang` INTEGER NULL,
    `idNhanVien` INTEGER NULL,
    `NoiDungTin` LONGTEXT NULL,
    `LoaiHinhTuVan` VARCHAR(45) NULL,

    UNIQUE INDEX `TuVanKhachHang_idKhachHang_key`(`idKhachHang`),
    UNIQUE INDEX `TuVanKhachHang_idNhanVien_key`(`idNhanVien`),
    PRIMARY KEY (`idTuVanKhachHang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThanhToan` (
    `idThanhToan` INTEGER NOT NULL AUTO_INCREMENT,
    `idDonHang` INTEGER NULL,
    `PhuongThuc` VARCHAR(50) NULL,
    `NgayThanhToan` DATE NULL,

    UNIQUE INDEX `ThanhToan_idDonHang_key`(`idDonHang`),
    PRIMARY KEY (`idThanhToan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kho` (
    `idKho` INTEGER NOT NULL AUTO_INCREMENT,
    `TenKho` VARCHAR(225) NULL,
    `DiaChi` VARCHAR(225) NULL,
    `Sdt` VARCHAR(45) NULL,
    `TenNguoiQuanLy` VARCHAR(225) NULL,

    PRIMARY KEY (`idKho`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vung` (
    `idVung` INTEGER NOT NULL AUTO_INCREMENT,
    `idKho` INTEGER NULL,
    `TenVung` VARCHAR(225) NULL,

    UNIQUE INDEX `Vung_idKho_key`(`idKho`),
    PRIMARY KEY (`idVung`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gara` (
    `idGara` INTEGER NOT NULL AUTO_INCREMENT,
    `idVung` INTEGER NULL,
    `Tengara` VARCHAR(225) NULL,
    `Diachi` VARCHAR(225) NULL,
    `Succhua` INTEGER NULL,
    `Sdt` VARCHAR(15) NULL,
    `TenNguoiQuanLy` VARCHAR(225) NULL,

    UNIQUE INDEX `Gara_idVung_key`(`idVung`),
    PRIMARY KEY (`idGara`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChiTietKho` (
    `idChiTietKho` INTEGER NOT NULL AUTO_INCREMENT,
    `idKho` INTEGER NULL,
    `idXe` INTEGER NULL,
    `Soluong` INTEGER NULL,
    `idVung` INTEGER NULL,
    `idGara` INTEGER NULL,

    UNIQUE INDEX `ChiTietKho_idKho_key`(`idKho`),
    UNIQUE INDEX `ChiTietKho_idXe_key`(`idXe`),
    UNIQUE INDEX `ChiTietKho_idVung_key`(`idVung`),
    UNIQUE INDEX `ChiTietKho_idGara_key`(`idGara`),
    PRIMARY KEY (`idChiTietKho`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChamCong` (
    `idChamCong` INTEGER NOT NULL AUTO_INCREMENT,
    `idNhanVienTuVan` INTEGER NULL,
    `Ngay` DATE NULL,
    `GioVao` TIME(0) NULL,
    `GioRa` TIME(0) NULL,
    `TrangThai` VARCHAR(45) NULL,
    `TongGioLam` TIME(0) NULL,

    UNIQUE INDEX `ChamCong_idNhanVienTuVan_key`(`idNhanVienTuVan`),
    PRIMARY KEY (`idChamCong`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DatCoc` (
    `idDatCoc` INTEGER NOT NULL AUTO_INCREMENT,
    `idXe` INTEGER NULL,
    `idKhachHang` INTEGER NULL,
    `NgayDat` DATE NULL,
    `SotienDat` INTEGER NULL,
    `TrangThaiDat` VARCHAR(225) NULL,

    UNIQUE INDEX `DatCoc_idXe_key`(`idXe`),
    UNIQUE INDEX `DatCoc_idKhachHang_key`(`idKhachHang`),
    PRIMARY KEY (`idDatCoc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Luong` (
    `idLuong` INTEGER NOT NULL AUTO_INCREMENT,
    `idNhanVien` INTEGER NULL,
    `LuongCoBan` DECIMAL(15, 2) NULL,
    `TienThuong` DECIMAL(15, 2) NULL,
    `LuongNhan` DECIMAL(15, 2) NULL,
    `TongLuong` INTEGER NULL,

    UNIQUE INDEX `Luong_idNhanVien_key`(`idNhanVien`),
    PRIMARY KEY (`idLuong`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichHenLayXe` (
    `idLichHenLayXe` INTEGER NOT NULL AUTO_INCREMENT,
    `idDatCoc` INTEGER NULL,
    `idXe` INTEGER NULL,
    `idKhachHang` INTEGER NULL,
    `NgayLayXe` DATE NULL,
    `GioHenLayXe` TIME(0) NULL,
    `DiaDiem` VARCHAR(225) NULL,

    UNIQUE INDEX `LichHenLayXe_idDatCoc_key`(`idDatCoc`),
    UNIQUE INDEX `LichHenLayXe_idXe_key`(`idXe`),
    UNIQUE INDEX `LichHenLayXe_idKhachHang_key`(`idKhachHang`),
    PRIMARY KEY (`idLichHenLayXe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LichGiaoXe` (
    `idLichGiaoXe` INTEGER NOT NULL AUTO_INCREMENT,
    `idXe` INTEGER NULL,
    `idKhachHang` INTEGER NULL,
    `NgayGiao` DATE NULL,
    `GioGiao` TIME(0) NULL,
    `TrangThai` VARCHAR(225) NULL,
    `idDatCoc` INTEGER NULL,
    `idDonHang` INTEGER NULL,

    UNIQUE INDEX `LichGiaoXe_idXe_key`(`idXe`),
    UNIQUE INDEX `LichGiaoXe_idKhachHang_key`(`idKhachHang`),
    UNIQUE INDEX `LichGiaoXe_idDatCoc_key`(`idDatCoc`),
    UNIQUE INDEX `LichGiaoXe_idDonHang_key`(`idDonHang`),
    PRIMARY KEY (`idLichGiaoXe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `idPermission` INTEGER NOT NULL AUTO_INCREMENT,
    `TenQuyen` VARCHAR(45) NULL,

    PRIMARY KEY (`idPermission`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `idRolePermission` INTEGER NOT NULL AUTO_INCREMENT,
    `idRole` INTEGER NULL,
    `idPermission` INTEGER NULL,

    UNIQUE INDEX `RolePermission_idRole_key`(`idRole`),
    UNIQUE INDEX `RolePermission_idPermission_key`(`idPermission`),
    PRIMARY KEY (`idRolePermission`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_idRole_fkey` FOREIGN KEY (`idRole`) REFERENCES `Role`(`idRole`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Xe` ADD CONSTRAINT `Xe_idLoaiXe_fkey` FOREIGN KEY (`idLoaiXe`) REFERENCES `LoaiXe`(`idLoaiXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonHang` ADD CONSTRAINT `DonHang_idKhachHang_fkey` FOREIGN KEY (`idKhachHang`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietDonHang` ADD CONSTRAINT `ChiTietDonHang_idDonHang_fkey` FOREIGN KEY (`idDonHang`) REFERENCES `DonHang`(`idDonHang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietDonHang` ADD CONSTRAINT `ChiTietDonHang_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NhapHang` ADD CONSTRAINT `NhapHang_idNhaCungCap_fkey` FOREIGN KEY (`idNhaCungCap`) REFERENCES `NhaCungCap`(`idNhaCungCap`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietNhap` ADD CONSTRAINT `ChiTietNhap_idNhapHang_fkey` FOREIGN KEY (`idNhapHang`) REFERENCES `NhapHang`(`idNhapHang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietNhap` ADD CONSTRAINT `ChiTietNhap_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GioHang` ADD CONSTRAINT `GioHang_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GioHang` ADD CONSTRAINT `GioHang_idKhachHang_fkey` FOREIGN KEY (`idKhachHang`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichLamViec` ADD CONSTRAINT `LichLamViec_idNhanVienTuVan_fkey` FOREIGN KEY (`idNhanVienTuVan`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TuVanKhachHang` ADD CONSTRAINT `TuVanKhachHang_idKhachHang_fkey` FOREIGN KEY (`idKhachHang`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TuVanKhachHang` ADD CONSTRAINT `TuVanKhachHang_idNhanVien_fkey` FOREIGN KEY (`idNhanVien`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThanhToan` ADD CONSTRAINT `ThanhToan_idDonHang_fkey` FOREIGN KEY (`idDonHang`) REFERENCES `DonHang`(`idDonHang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vung` ADD CONSTRAINT `Vung_idKho_fkey` FOREIGN KEY (`idKho`) REFERENCES `Kho`(`idKho`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gara` ADD CONSTRAINT `Gara_idVung_fkey` FOREIGN KEY (`idVung`) REFERENCES `Vung`(`idVung`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietKho` ADD CONSTRAINT `ChiTietKho_idKho_fkey` FOREIGN KEY (`idKho`) REFERENCES `Kho`(`idKho`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietKho` ADD CONSTRAINT `ChiTietKho_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietKho` ADD CONSTRAINT `ChiTietKho_idVung_fkey` FOREIGN KEY (`idVung`) REFERENCES `Vung`(`idVung`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChiTietKho` ADD CONSTRAINT `ChiTietKho_idGara_fkey` FOREIGN KEY (`idGara`) REFERENCES `Gara`(`idGara`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChamCong` ADD CONSTRAINT `ChamCong_idNhanVienTuVan_fkey` FOREIGN KEY (`idNhanVienTuVan`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatCoc` ADD CONSTRAINT `DatCoc_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DatCoc` ADD CONSTRAINT `DatCoc_idKhachHang_fkey` FOREIGN KEY (`idKhachHang`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Luong` ADD CONSTRAINT `Luong_idNhanVien_fkey` FOREIGN KEY (`idNhanVien`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHenLayXe` ADD CONSTRAINT `LichHenLayXe_idDatCoc_fkey` FOREIGN KEY (`idDatCoc`) REFERENCES `DatCoc`(`idDatCoc`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHenLayXe` ADD CONSTRAINT `LichHenLayXe_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichHenLayXe` ADD CONSTRAINT `LichHenLayXe_idKhachHang_fkey` FOREIGN KEY (`idKhachHang`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichGiaoXe` ADD CONSTRAINT `LichGiaoXe_idXe_fkey` FOREIGN KEY (`idXe`) REFERENCES `Xe`(`idXe`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichGiaoXe` ADD CONSTRAINT `LichGiaoXe_idKhachHang_fkey` FOREIGN KEY (`idKhachHang`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichGiaoXe` ADD CONSTRAINT `LichGiaoXe_idDatCoc_fkey` FOREIGN KEY (`idDatCoc`) REFERENCES `DatCoc`(`idDatCoc`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichGiaoXe` ADD CONSTRAINT `LichGiaoXe_idDonHang_fkey` FOREIGN KEY (`idDonHang`) REFERENCES `DonHang`(`idDonHang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_idRole_fkey` FOREIGN KEY (`idRole`) REFERENCES `Role`(`idRole`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_idPermission_fkey` FOREIGN KEY (`idPermission`) REFERENCES `Permission`(`idPermission`) ON DELETE SET NULL ON UPDATE CASCADE;
