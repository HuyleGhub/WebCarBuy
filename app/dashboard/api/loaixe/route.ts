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
        const existingLoaiXe = await prisma.loaiXe.findFirst({
            where: {
                TenLoai: body.TenLoai,
            },
        });
        if (existingLoaiXe) {
            return NextResponse.json(
                { message: "Tên loại xe đã tồn tại" },
                { status: 400 }
            );
        }

          const imageUrls = Array.isArray(body.HinhAnh) ? body.HinhAnh : [body.HinhAnh].filter(Boolean);

          const newLoaiXe = await prisma.loaiXe.create({
        data: {
            TenLoai: body.TenLoai,
            NhanHieu: body.NhanHieu,
            HinhAnh: imageUrls.join('|'),
        },
    
    })
    return NextResponse.json({newLoaiXe,message:"thêm loại xe thành công"}, {status: 200});
} catch (err:any) {
    return NextResponse.json({error: err.message}, {status: 500});
}
}