import loaiXeSchema from "@/app/dashboard/zodschema/loaixezod/route";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const idLoaiXe = parseInt(params.id);

  try {
    const xe = await prisma.xe.findMany({
      where: {
        idLoaiXe: idLoaiXe,
      },
      include: {
        loaiXe: true,
      },
    });

    return NextResponse.json(xe);

  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách loại xe' }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest, {params}:{params:{id:string}}) {
  try {
    const idxe = parseInt(params.id);
    const xe = await prisma.loaiXe.delete({
      where: {
        idLoaiXe: idxe,
      },
    });
  
    return NextResponse.json({xe, message: 'Loại xe đã được xóa' }, {status:200});
  } catch (e:any) {
    return NextResponse.json({ error: 'Lổi khi xóa loại xe' },{ status: 500 });
  }
}
export async function PUT(request: NextRequest, {params}: {params: {id:string}}) {
  try {
    const body = await request.json();
    const idLoaiXe = parseInt(params.id);
    const imageUrls = Array.isArray(body.HinhAnh) ? body.HinhAnh : [body.HinhAnh].filter(Boolean);
          console.log('Image URLs to be saved:', imageUrls);
    
      const updateXe = await prisma.loaiXe.update({
        where: {
          idLoaiXe: idLoaiXe,
        },
        data: {
          TenLoai: body.TenLoai,
          NhanHieu: body.NhanHieu,
          HinhAnh: imageUrls.join('|'),
        },
      })

      return NextResponse.json({updateXe, message: `Cập nhật loại xe từ id ${params.id} thành công` }, {status:200});
    } catch (e:any) {
      return NextResponse.json({ error: 'Lỗi khi cập nhật loại xe' },{ status: 500 });
    }

}