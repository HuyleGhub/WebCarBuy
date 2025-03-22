// app/api/dashboard/route.ts

import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get total deposits
    const totalDeposits = await prisma.datCoc.count();
    
    // Get pending deposits
    const pendingDeposits = await prisma.datCoc.count({
      where: {
        TrangThaiDat: "Chờ xác nhận"
      }
    });

    // Get total orders
    const totalOrders = await prisma.donHang.count();

    // Get pending orders
    const pendingOrders = await prisma.donHang.count({
      where: {
        TrangThaiDonHang: "Chờ xác nhận"
      }
    });

    // Get total customers
    const totalCustomers = await prisma.users.count({
      where: {
        role: {
          TenNguoiDung: "KhachHang"
        }
      }
    });

    const totalLichhen = await prisma.lichHen.count();

    // Get monthly sales data
    const today = new Date();
    const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
    
    const monthlyData = await prisma.donHang.groupBy({
      by: ['NgayDatHang'],
      _sum: {
        TongTien: true
      },
      where: {
        NgayDatHang: {
          gte: sixMonthsAgo
        },
        TrangThaiDonHang: "Đã giao"
      }
    });

    // Get recent transactions
    const recentTransactions = await prisma.donHang.findMany({
      take: 3,
      orderBy: {
        NgayDatHang: 'desc'
      },
      include: {
        khachHang: {
          select: {
            Hoten: true
          }
        }
      }
    });

    const recentDatCoc = await prisma.datCoc.findMany({
      take: 3,
      orderBy: {
        NgayDat: 'desc'
      },
      include: {
        khachHang: {
          select: {
            Hoten: true
          }
        },
        LichHenLayXe: { 
          select: { 
            DiaDiem: true 
          }
        }
      }
    });

    return NextResponse.json({
      totalDeposits,
      pendingDeposits,
      totalOrders,
      totalLichhen,
      pendingOrders,
      totalCustomers,
      monthlyData,
      recentTransactions,
      recentDatCoc
    });
    
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}