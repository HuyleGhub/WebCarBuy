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
    const body = await request.json();
    const idLoaiXe = parseInt(params.id);
    const xe = await prisma.loaiXe.findFirst({
      where: {
        TenLoai: body.TenLoai,    
        NOT: {
          idLoaiXe: idLoaiXe, // Loại trừ xe hiện tại đang được cập nhật
      },
      },
    });
    try {
      const checkXe = loaiXeSchema.safeParse({
        TenLoai: body.TenLoai,
        NhanHieu: body.NhanHieu, // Convert to number if it's coming as string
      });
  
      if (!checkXe.success) {
        return NextResponse.json({
          errors: checkXe.error.errors,
        }, { status: 400 });
      }else
    if (xe !== null) {
      return NextResponse.json({xe, message: "Tên loại xe đã tồn tại"},{status: 400});
    }else {
      const updateXe = await prisma.loaiXe.update({
        where: {
          idLoaiXe: idLoaiXe,
        },
        data: {
          TenLoai: body.TenLoai,
          NhanHieu: body.NhanHieu,
          HinhAnh: body.HinhAnh,
        },
      })
      return NextResponse.json({updateXe, message: `Cập nhật loại xe từ id ${params.id} thành công` }, {status:200});
    }
    } catch (e:any) {
      return NextResponse.json({ error: 'Lỗi khi cập nhật loại xe' },{ status: 500 });
    }

}