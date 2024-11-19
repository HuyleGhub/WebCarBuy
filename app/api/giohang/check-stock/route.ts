import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
      const { idXe } = await req.json();
  
      const xe = await prisma.xe.findUnique({
        where: {
          idXe: parseInt(idXe),
        },
        select: {
          TrangThai: true,
        },
      });
  
      if (!xe) {
        return NextResponse.json(
          { error: 'Xe không tồn tại' },
          { status: 404 }
        );
      }
  
      const isAvailable = xe.TrangThai === 'Còn Hàng';
  
      return NextResponse.json({
        available: isAvailable,
        status: xe.TrangThai,
      });
    } catch (error) {
      console.error('Check stock error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }