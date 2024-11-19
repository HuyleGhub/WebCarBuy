
import nhaCungCapSchema from "@/app/dashboard/zodschema/nhacungcapzod/route";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const idLoaiXe = parseInt(params.id);

  try {
    const xe = await prisma.nhaCungCap.findMany({
      where: {
        idNhaCungCap: idLoaiXe,
      },
    });

    return NextResponse.json(xe);

  } catch (error) {
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách nhà cung cấp' }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest, {params}:{params:{id:string}}) {
  try {
    const idxe = parseInt(params.id);
    const xe = await prisma.nhaCungCap.delete({
      where: {
        idNhaCungCap: idxe,
      },
    });
  
    return NextResponse.json({xe, message: 'Nhà cung cấp đã được xóa' }, {status:200});
  } catch (e:any) {
    return NextResponse.json({ error: 'Lổi khi xóa nhà cung cấp' },{ status: 500 });
  }
}
export async function PUT(request: NextRequest, {params}: {params: {id:string}}) {
    const body = await request.json();
    const idLoaiXe = parseInt(params.id);
    const xe = await prisma.nhaCungCap.findFirst({
      where: {
        TenNhaCungCap: body.TenNhaCungCap,    
        NOT: {
          idNhaCungCap: idLoaiXe, // Loại trừ xe hiện tại đang được cập nhật
      },
      },
    });
    try {
      const checkXe = nhaCungCapSchema.safeParse({
        TenNhaCungCap: body.TenNhaCungCap,
        Sdt: body.Sdt,
        Email: body.Email // Convert to number if it's coming as string
      });
  
      if (!checkXe.success) {
        return NextResponse.json({
          errors: checkXe.error.errors,
        }, { status: 400 });
      }else
    if (xe !== null) {
      return NextResponse.json({xe, message: "Tên Nhà cung cấp đã tồn tại"},{status: 400});
    }else {
      const updateXe = await prisma.nhaCungCap.update({
        where: {
          idNhaCungCap: idLoaiXe,
        },
        data: {
          TenNhaCungCap: body.TenNhaCungCap,
          Sdt: body.Sdt,
          Email: body.Email,
        },
      })
      return NextResponse.json({updateXe, message: `Cập nhật Nhà cung cấp từ id ${params.id} thành công` }, {status:200});
    }
    } catch (e:any) {
      return NextResponse.json({ error: 'Lỗi khi cập nhật nhà cung cấp' },{ status: 500 });
    }

}