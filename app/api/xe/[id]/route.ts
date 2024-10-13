import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

    export async function GET(
        request: NextRequest,
        { params }: { params: { id: string } }
      ) {
        try {
          const xe = await prisma.xe.findUnique({
            where: {
              idXe: parseInt(params.id),
            },
            include: {
              loaiXe: true,
            },
          });
      
          if (!xe) {
            return NextResponse.json(
              { error: 'Không tìm thấy xe' },
              { status: 404 }
            );
          }
      
          return NextResponse.json(xe);
        } catch (error) {
          return NextResponse.json(
            { error: 'Lỗi khi lấy thông tin xe' },
            { status: 500 }
          );
        }
}