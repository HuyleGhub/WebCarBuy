import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET() {
    try {
    //   const session = await getServerSession();
    //   if (!session) {
    //     return NextResponse.json({ count: 0 });
    //   }
  
      const count = await prisma.gioHang.count();
  
      return NextResponse.json({ count });
    } catch (error) {
      console.error('Cart count error:', error);
      return NextResponse.json({ count: 0 });
    }
  }