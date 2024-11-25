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
  // POST route for creating new xe
  export async function POST(request: NextRequest) {
      try {
          const body = await request.json();
  
          // Check if xe already exists
          const existingXe = await prisma.xe.findFirst({
              where: {
                  TenXe: body.TenXe,
              },
          });
          if (existingXe) {
              return NextResponse.json(
                  { message: "Tên xe đã tồn tại" },
                  { status: 400 }
              );
          }
          // Ensure HinhAnh is properly handled as an array
          const imageUrls = Array.isArray(body.HinhAnh) ? body.HinhAnh : [body.HinhAnh].filter(Boolean);
  
          const newXe = await prisma.xe.create({
              data: {
                  TenXe: body.TenXe,
                  idLoaiXe: parseInt(body.idLoaiXe),
                  GiaXe: parseFloat(body.GiaXe),
                  MauSac: body.MauSac,
                  DongCo: body.DongCo,
                  TrangThai: body.TrangThai,
                  HinhAnh: imageUrls.join('|'), // Use a separator that won't appear in URLs
                  NamSanXuat: body.NamSanXuat
              },
          });
          return NextResponse.json({
              newXe,
              message: "Thêm xe thành công"
          }, { status: 201 });
      } catch (error) {
          console.error("Error creating xe:", error);
          return NextResponse.json(
              { message: "Lỗi khi thêm xe" },
              { status: 500 }
          );
      }
  }


