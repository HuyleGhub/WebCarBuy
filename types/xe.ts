export interface Xe {
    idXe: number;
    TenXe: string | null;
    GiaXe: number | null;
    MauSac: string | null;
    DongCo: string | null;
    TrangThai: string | null;
    HinhAnh: string | null;
    NamSanXuat: string | null;
    loaiXe?: {
      idLoaiXe: number;
      TenLoai: string | null;
      NhanHieu: string | null;
    };
  }