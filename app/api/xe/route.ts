import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest,) {
      const body = await req.json();
     
      try{
      const xe = await prisma.xe.create({
        data: {
           TenXe: body.TenXe, 
           idLoaiXe: body.IdLoaiXe, 
           GiaXe: body.GiaXe,
           MauSac: body.MauSac,
           DongCo: body.DongCo,
           TrangThai: body.TrangThai,
           HinhAnh: body.HinhAnh,
           NamSanXuat: body.NamSanXuat
        } 
      })
      return NextResponse.json({xe, message:"Thêm mới thành công"},{status: 200});
    }catch (e:any) {
      return NextResponse.json({message: e.message}, {status: 500});   
    }
}
export async function DELETE(request: NextRequest) {
  const xe = await prisma.xe.deleteMany()
  return NextResponse.json({xe, message:"Xóa hết dữ liệu thành công"},{status: 200});
}
export async function GET (req: NextRequest) {
        const xe = await prisma.xe.findMany();
       return NextResponse.json(xe);
}
