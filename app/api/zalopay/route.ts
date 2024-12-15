import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth';
import prisma from '@/prisma/client';

// Định nghĩa interface để đảm bảo type safety
interface CartItem {
  idXe: number;
  SoLuong: number;
  xe: {
    TenXe: string;
    GiaXe: number;
  };
}

export async function POST(req: Request) {
  try {
    // Lấy thông tin phiên người dùng
    const session = await getSession();
    
    // Lấy dữ liệu từ request body
    const { cartItems, totalAmount }: { cartItems: CartItem[], totalAmount: number } = await req.json();

    // Tạo đơn hàng mới
    const donHang = await prisma.donHang.create({
      data: {
        idKhachHang: session.idUsers,
        NgayDatHang: new Date(),
        TrangThaiDonHang: 'Đã thanh toán', // Trạng thái đã thanh toán
        TongTien: totalAmount,
      }
    });

    // Tạo chi tiết đơn hàng
    await Promise.all(cartItems.map(async (item) => {
      await prisma.chiTietDonHang.create({
        data: {
          idDonHang: donHang.idDonHang,
          idXe: item.idXe,
          SoLuong: item.SoLuong,
          DonGia: item.xe.GiaXe,
        }
      });
    }));

    // Tạo bản ghi thanh toán
    await prisma.thanhToan.create({
      data: {
        idDonHang: donHang.idDonHang,
        PhuongThuc: 'QR_CA_NHAN', // Phương thức thanh toán QR cá nhân
        NgayThanhToan: new Date(),
        TrangThai: 'THANH_CONG', // Trạng thái thanh toán thành công
      }
    });

    // Xóa các mục trong giỏ hàng sau khi thanh toán thành công
    await prisma.gioHang.deleteMany({
      where: {
        idKhachHang: session.idUsers
      }
    });

    // Trả về thông tin đơn hàng
    return NextResponse.json({
      message: 'Thanh toán thành công',
      donHangId: donHang.idDonHang
    });

  } catch (error) {
    console.error('Lỗi thanh toán QR cá nhân:', error);
    return NextResponse.json(
      { error: 'Thanh toán không thành công' },
      { status: 500 }
    );
  }
}