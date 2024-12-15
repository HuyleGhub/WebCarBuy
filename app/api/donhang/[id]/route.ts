import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, {params}:{params: {id: string}}){
        try {
            const body = await req.json();
            const idDonHang = parseInt(params.id);
            const putDonHang = await prisma.donHang.update({
                where: {idDonHang: idDonHang},
                data: {
                    TrangThaiDonHang: body.TrangThaiDonHang,
                    TongTien: parseFloat(body.TongTien),
                },
                
            })
            return NextResponse.json({putDonHang, message:"Cập nhật đơn hàng thành công"})
        } catch (error: any) {
            return NextResponse.json({error: error.message})
        }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = parseInt(params.id);

    // Find the order with its associated car
    const donHang = await prisma.donHang.findUnique({
      where: { idDonHang: orderId },
      include: { 
        ChiTietDonHang: {
          select: { idXe: true }
        },
        LichGiaoXe: true,
        ThanhToan:true,
      }
    });

    // Check if order exists
    if (!donHang) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
    }

    // Start a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {

      if (donHang.LichGiaoXe.length > 0) {
        await tx.lichGiaoXe.deleteMany({
          where: { idDonHang: orderId }
        });
      }
      
      if (donHang.ThanhToan.length > 0) {
        await tx.thanhToan.deleteMany({
          where: { idDonHang: orderId }
        });
      }

      // Delete order details first
      await tx.chiTietDonHang.deleteMany({
        where: { idDonHang: orderId }
      });

      // Delete the order
      await tx.donHang.delete({
        where: { idDonHang: orderId }
      });

      // Update car status 
      // Note: Assuming there's only one car per order based on your current schema
      if (donHang.ChiTietDonHang.length > 0) {
        const carId = donHang.ChiTietDonHang[0].idXe;
        
        if (carId) {
          await tx.xe.update({
            where: { idXe: carId },
            data: { TrangThai: "Còn Hàng" }
          });
        }
      }
    });

    return NextResponse.json({ message: "Xóa đơn hàng thành công" });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ 
      error: error.message || "Không thể xóa đơn hàng" 
    }, { status: 500 });
  }
}