// app/api/phantrang/phantrangdanhgia/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit_size = searchParams.get('limit_size') ? Number(searchParams.get('limit_size')) : 10;
    const search = searchParams.get('search') || "";
    
    // Get session to check user role
    const session = await getSession();
    const skip = (page - 1) * limit_size;

    // Base query conditions
    let whereCondition: any = {};
    
    // If user is not admin, filter by user ID
    if (session?.user?.id && session?.role?.TenNguoiDung !== 'Admin') {
      whereCondition.idUser = Number(session.user.id);
    }

    // Add search condition if provided
    if (search) {
      whereCondition.OR = [
        {
          lichHen: {
            TenKhachHang: {
              contains: search,
            },
          }
        },
        {
          lichHen: {
            Sdt: {
              contains: search,
            },
          }
        },
        {
          xe: {
            TenXe: {
              contains: search,
            },
          }
        },
        {
          NoiDung: {
            contains: search,
          }
        }
      ];
    }

    // Get total count with filters applied
    const totalRecords = await prisma.danhGiaTraiNghiem.count({
      where: whereCondition,
    });

    const totalPage = Math.ceil(totalRecords / limit_size);

    // Get paginated data with filters and include related details
    const data = await prisma.danhGiaTraiNghiem.findMany({
      where: whereCondition,
      skip: skip,
      take: limit_size,
      include: {
        lichHen: {
          select: {
            TenKhachHang: true,
            Sdt: true,
            Email: true,
          }
        },
        xe: {
          select: {
            TenXe: true,
            GiaXe: true,
          }
        },
      },
      orderBy: {
        NgayDanhGia: 'desc', // Most recent ratings first
      },
    });

    return NextResponse.json({
      data,
      meta: {
        page,
        limit_size,
        totalRecords,
        totalPage,
        skip,
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error in rating pagination API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}