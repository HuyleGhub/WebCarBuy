import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import xeSchema from "../zodschema/route";


export async function GET () {
  const xe = await prisma.xe.findMany()
  return NextResponse.json(xe)
}


export async function POST (req: NextRequest,) {
    try {
      const body = await req.json();
  
      // Validate the input data using zod schema
      const checkXe = xeSchema.safeParse({
        TenXe: body.TenXe,
        idLoaiXe: parseInt(body.idLoaiXe), // Convert to number if it's coming as string
        GiaXe: parseFloat(body.GiaXe),     // Convert to number for Decimal
        MauSac: body.MauSac,
        DongCo: body.DongCo,
        TrangThai: body.TrangThai,
        HinhAnh: body.HinhAnh,
        NamSanXuat: body.NamSanXuat
      });
  
      if (!checkXe.success) {
        return NextResponse.json({
          errors: checkXe.error.errors,
          message: "Dữ liệu không hợp lệ"
        }, { status: 400 });
      }
  
      // Check if LoaiXe exists
      const loaiXeExists = await prisma.loaiXe.findUnique({
        where: {
          idLoaiXe: parseInt(body.idLoaiXe)
        }
      });
  
      if (!loaiXeExists) {
        return NextResponse.json({
          message: "Loại xe không tồn tại",
          code: "invalid_loai_xe"
        }, { status: 400 });
      }
  
      // Create new Xe record
      const xe = await prisma.xe.create({
        data: {
          TenXe: body.TenXe,
          idLoaiXe: parseInt(body.idLoaiXe),
          GiaXe: parseFloat(body.GiaXe),
          MauSac: body.MauSac,
          DongCo: body.DongCo,
          TrangThai: body.TrangThai,
          HinhAnh: body.HinhAnh,
          NamSanXuat: body.NamSanXuat
        },
        include: {
          loaiXe: true  // Include the related LoaiXe data
        }
      });
  
      return NextResponse.json({
        data: xe,
        message: "Thêm mới xe thành công"
      }, { status: 201 });
  
    } catch (error: any) {
      console.error("Error creating xe:", error);
      
      if (error.code === 'P2003') {
        return NextResponse.json({
          message: "Loại xe không tồn tại trong hệ thống",
          code: "foreign_key_violation"
        }, { status: 400 });
      }
  
      return NextResponse.json({
        message: "Lỗi server: " + error.message
      }, { status: 500 });
    }
}
export async function DELETE(request: NextRequest) {
  const xe = await prisma.xe.deleteMany()
  return NextResponse.json({xe, message:"Xóa hết dữ liệu thành công"},{status: 200});
}

