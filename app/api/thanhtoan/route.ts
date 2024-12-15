
import { getSession } from '@/app/lib/auth';
import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const { cartItems, paymentMethod } = await req.json();

    const result = await prisma.$transaction(async (prisma) => {
      const allOrders: any[] = [];
      const allPayments: any[] = [];
      const allDeliverySchedules: any[] = [];
      const allOrderDetails: any[] = [];

      for (const item of cartItems) {
        // 1. Tạo đơn hàng mới
        const order = await prisma.donHang.create({
          data: {
            idKhachHang: session.idUsers,
            NgayDatHang: new Date(),
            TrangThaiDonHang: 'Chờ xác nhận',
            TongTien: Number(item.xe.GiaXe) * item.SoLuong,
          },
        });
        allOrders.push(order);

        // 2. Tạo chi tiết đơn hàng
        const orderDetail = await prisma.chiTietDonHang.create({
          data: {
            idDonHang: order.idDonHang,
            idXe: item.idXe,
            SoLuong: item.SoLuong,
            DonGia: item.xe?.GiaXe || 0,
          },
        });
        allOrderDetails.push(orderDetail);

        // 3. Tạo bản ghi thanh toán
        const payment = await prisma.thanhToan.create({
          data: {
            idDonHang: order.idDonHang,
            PhuongThuc: paymentMethod,
            NgayThanhToan: new Date(),
          },
        });
        allPayments.push(payment);

        // 4. Xóa mặt hàng khỏi giỏ hàng
        await prisma.gioHang.delete({
          where: {
            idGioHang: item.idGioHang,
          },
        });

        // 5. Cập nhật trạng thái xe
        await prisma.xe.update({
          where: {
            idXe: item.idXe,
          },
          data: {
            TrangThai: 'Đã đặt hàng',
          },
        });

        // 6. Tạo lịch giao hàng
        const deliverySchedule = await prisma.lichGiaoXe.create({
          data: {
            idDonHang: order.idDonHang,
            idXe: item.idXe,
            idKhachHang: session.idUsers,
            NgayGiao: await calculateDeliveryDate(),
            TrangThai: 'Chờ giao',
          },
        });
        allDeliverySchedules.push(deliverySchedule);
      }

      return {
        orders: allOrders,
        orderDetails: allOrderDetails,
        payments: allPayments,
        deliverySchedules: allDeliverySchedules,
      };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error during checkout' },
      { status: 500 }
    );
  }
}

async function calculateDeliveryDate(): Promise<Date> {
  // Logic để tính ngày giao hàng dự kiến
  const orderDate = new Date();
  const earliestDeliveryDate = new Date(orderDate);
  earliestDeliveryDate.setDate(orderDate.getDate() + 3);

  const maxDeliveryDate = new Date(orderDate);
  maxDeliveryDate.setDate(orderDate.getDate() + 6);

  const deliveryDate = new Date(
    earliestDeliveryDate.getTime() +
      Math.random() * (maxDeliveryDate.getTime() - earliestDeliveryDate.getTime())
  );

  deliveryDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);

  return deliveryDate;
}