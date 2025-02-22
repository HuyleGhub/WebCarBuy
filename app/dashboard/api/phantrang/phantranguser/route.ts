import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
      const searchParams = request.nextUrl.searchParams
      // nếu trên url không cớ search page param thì gán bằng 1
      const page:number = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
      const limit_size:number = searchParams.get('limit_size') ? Number(searchParams.get('limit_size')) : 10;
  
      const skip = (page - 1) * limit_size;

      const searchText = searchParams.get('searchText') || '';

      const whereClause = searchText ? {
        OR: [
          { Hoten: { contains: searchText } },
          { Sdt: { contains: searchText } },
          { Diachi: { contains: searchText } },
          { Email: { contains: searchText } },
          {
            role:{
                TenNguoiDung: { contains: searchText }
            }
          },
           {
            Ngaydangky: {
                gte: isNaN(Date.parse(searchText)) ? undefined : new Date(searchText), // Parse date if valid
              },
           }
        ]
      } : {};
      // tính tổng số trang
      // 1. đếm xem có bao nhiêu bản ghi hiện tại trong cở sở dữ liệu
      const totalRecords = await prisma.users.count({
        where: whereClause
      });
       
      const totalPage = Math.ceil(totalRecords/limit_size)
  
      const data = await prisma.users.findMany({
          skip: skip,
          take: limit_size,
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