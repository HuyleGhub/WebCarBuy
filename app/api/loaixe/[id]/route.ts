import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const idLoaiXe = parseInt(params.id);

  try {
    const xe = await prisma.xe.findMany({
      where: {
        idLoaiXe: idLoaiXe,
        TrangThai: "Còn Hàng"
      },
      include: {
        loaiXe: true,
      },
    });

    return NextResponse.json(xe);

  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách xe' }, { status: 500 });
  }
}