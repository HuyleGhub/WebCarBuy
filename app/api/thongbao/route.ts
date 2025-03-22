// app/api/donhang/route.ts
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
      const donhang = await prisma.donHang.findMany({
        include: {
          khachHang: true,
          ThanhToan: true,
          ChiTietDonHang: {
            include: {
              xe: {
                include: {
                  DatCoc: {
                    select: {
                      idDatCoc: true,
                      NgayDat: true,
                      SotienDat: true,
                      TrangThaiDat: true,
                    },
                  }
                }
              }
            }
          }
        },
        orderBy: {
          NgayDatHang: 'desc'
        }
      });

      return NextResponse.json(donhang);
    } catch (error) {
      return NextResponse.json(
        { message: "Error fetching orders", error },
        { status: 500 }
      );
    }
  }

// API endpoint to clear notifications
export async function DELETE() {
  try {
    // Here you might want to mark all notifications as read
    // or delete them depending on your requirements
    await prisma.donHang.updateMany({
      where: {
        TrangThaiDonHang: "Chưa đọc"
      },
      data: {
        TrangThaiDonHang: "Đã đọc"
      }
    });
    
    return NextResponse.json({ message: "All notifications cleared" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error clearing notifications", error },
      { status: 500 }
    );
  }
}