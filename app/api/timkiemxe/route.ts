import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import xeSchema from "../zodschema/route";


export async function GET(request: NextRequest) {
    try {
      const searchParams = request.nextUrl.searchParams;
      const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
      const limit_size = searchParams.get('limit_size') ? Number(searchParams.get('limit_size')) : 10;
      const tenXe = searchParams.get('tenXe');
      const gia = searchParams.get('gia') ? Number(searchParams.get('gia')) : undefined;
      const namSanXuat = searchParams.get('namSanXuat');
      const dongCo = searchParams.get('dongCo');
      const idLoaiXe = searchParams.get('idLoaiXe') ? Number(searchParams.get('idLoaiXe')) : undefined;
  
      const skip = (page - 1) * limit_size;
  
      // Xây dựng điều kiện tìm kiếm
      const whereClause: any = {};
      
      if (tenXe) {
        whereClause.TenXe = {
           contains: tenXe,   
        }
      }
  
      if (gia !== undefined) {
        whereClause.GiaXe = {
          lte: gia
        };
      }
  
      if (namSanXuat ) {
        whereClause.NamSanXuat = namSanXuat;
      }
  
      if (dongCo) {
        whereClause.DongCo = {
          contains: dongCo,
        };
      }
  
      if (idLoaiXe) {
        whereClause.idLoaiXe = idLoaiXe;
      }
  
      // Đếm tổng số bản ghi theo điều kiện tìm kiếm
      const totalRecords = await prisma.xe.count({
        where: whereClause
      });
       
      const totalPage = Math.ceil(totalRecords / limit_size);
  
      // Lấy dữ liệu theo điều kiện tìm kiếm
      const data = await prisma.xe.findMany({
        where: whereClause,
        skip: skip,
        take: limit_size,
        include: {
          loaiXe: true
        }
      });
      
      return NextResponse.json(
        {
          data,
          meta: {
            totalRecords,
            totalPage, 
            page, 
            limit_size, 
            skip,
          }
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }
  }