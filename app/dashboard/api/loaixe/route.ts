import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import loaiXeSchema from "../../zodschema/loaixezod/route";

export async function GET() {
    const loaiXe = await prisma.loaiXe.findMany();
    return NextResponse.json(loaiXe);
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    try {
        const checkXe = loaiXeSchema.safeParse({
            TenLoai: body.TenLoai,
            NhanHieu: body.NhanHieu, // Convert to number if it's coming as string
          });
      
          if (!checkXe.success) {
            return NextResponse.json({
              errors: checkXe.error.errors,
            }, { status: 400 });
          }
    const newLoaiXe = await prisma.loaiXe.create({
        data: {
            TenLoai: body.TenLoai,
            NhanHieu: body.NhanHieu,
            HinhAnh: body.HinhAnh,
        },
    
    })
    return NextResponse.json({newLoaiXe,message:"thêm loại xe thành công"}, {status: 200});
} catch (err:any) {
    return NextResponse.json({error: err.message}, {status: 500});
}
}