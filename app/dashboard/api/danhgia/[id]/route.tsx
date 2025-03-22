import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, {params}:{params:{id:string}}) {
  try {
    const idDanhGia = parseInt(params.id);
    const xe = await prisma.danhGiaTraiNghiem.delete({
      where: {
        idDanhGia: idDanhGia,
      },
    });
  
    return NextResponse.json({xe, message: 'Đánh giá đã được xóa' }, {status:200});
  } catch (e:any) {
    return NextResponse.json({ error: 'Lổi khi xóa Đánh giá' },{ status: 500 });
  }
}

// File: app/api/danhgia/xe/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idXe = parseInt(params.id);

    if (isNaN(idXe)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const reviews = await prisma.danhGiaTraiNghiem.findMany({
      where: {
        idXe: idXe,
      },
      include: {
        user: {
          select: {
            Hoten: true,
          },
        },
      },
      orderBy: {
        NgayDanhGia: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}