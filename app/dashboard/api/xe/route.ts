import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import xeSchema from "../../zodschema/route";



// export async function GET () {
//   const xe = await prisma.xe.findMany();
//   return NextResponse.json(xe);
// }

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    // nếu trên url không cớ search page param thì gán bằng 1
    const page:number = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit_size:number = searchParams.get('limit_size') ? Number(searchParams.get('limit_size')) : 10;

    const skip = (page - 1) * limit_size;
    // tính tổng số trang
    // 1. đếm xem có bao nhiêu bản ghi hiện tại trong cở sở dữ liệu
    const totalRecords = await prisma.xe.count();
     
    const totalPage = Math.ceil(totalRecords/limit_size)

    const data = await prisma.xe.findMany({
        skip: skip,
        take: limit_size,
        include: {
          loaiXe: true
        }
    })
    
    return NextResponse.json(
        {
            data,
            meta: 
            {
                totalRecords,
                totalPage, 
                page, 
                limit_size, 
                skip,
            }},
                
            {status:200});
          } catch (error) {
            return NextResponse.json(
                { error: 'Failed to fetch data' },
                { status: 500 }
            );
        }
  }
export async function POST (req: NextRequest,) {
    try {
      const body = await req.json();
      const checkTenXe = await prisma.xe.findFirst({
        where: {
          TenXe: body.TenXe
        }
      })
  
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
      }else {
        if (checkTenXe) {
          return NextResponse.json({checkTenXe, message: "Tên xe đã tồn tại"},{status: 400});
      }
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

