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
export async function DELETE(req: NextRequest, {params}: {params: {id:string}}) {
  try {
    const idDonHang = parseInt(params.id);
    await prisma.chiTietDonHang.deleteMany({
        where: {
          idDonHang: parseInt(params.id)
        }
      });
    await prisma.donHang.delete({
      where: { idDonHang: idDonHang },
    });

    return NextResponse.json({ message: "Xóa đơn hàng thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message});
  }
}