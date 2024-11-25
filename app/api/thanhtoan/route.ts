
import { getSession } from '@/app/lib/auth';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    // if (!session) 
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { cartItems, paymentMethod } = await req.json();

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Create new DonHang
      const donHang = await prisma.donHang.create({
        data: {
          idKhachHang: session.idUsers,
          NgayDatHang: new Date(),
          TrangThaiDonHang: 'Chờ xác nhận',
          TongTien: cartItems.reduce((total: number, item: any) => {
            return total + (Number(item.xe.GiaXe) * item.SoLuong);
          }, 0),
        },
      });

      // 2. Create ChiTietDonHang for each cart item
      await Promise.all(
        cartItems.map((item: any) =>
          prisma.chiTietDonHang.create({
            data: {
              idDonHang: donHang.idDonHang,
              idXe: item.idXe,
              SoLuong: item.SoLuong,
              DonGia: item.xe.GiaXe,
            },
          })
        )
      );

      // 3. Create ThanhToan record
      const thanhToan = await prisma.thanhToan.create({
        data: {
          idDonHang: donHang.idDonHang,
          PhuongThuc: paymentMethod,
          NgayThanhToan: new Date(),
        },
      });

      // 4. Delete all items from GioHang
      await prisma.gioHang.deleteMany({
        where: {
          idKhachHang: session.idUsers,
        },
      });

      // 5. Update Xe inventory status if needed
      await Promise.all(
        cartItems.map((item: any) =>
          prisma.xe.update({
            where: {
              idXe: item.idXe,
            },
            data: {
              TrangThai: 'Đã đặt hàng',
            },
          })
        )
      );

      return {
        donHang,
        thanhToan,
      };
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error during checkout' },
      { status: 500 }
    );
  }
}