import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      // const session = await getServerSession();
      // if (!session) {
      //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // }
      const { SoLuong } = await req.json();
      const idGioHang = parseInt(params.id);
  
      const updatedItem = await prisma.gioHang.update({
        where: {
          idGioHang,
        },
        data: {
          SoLuong,
        },
      });
  
      return NextResponse.json(updatedItem);
    } catch (error) {
      console.error('Update cart error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  export async function DELETE(req: NextRequest, {params}: {params: {id:string}}) {
      try {
        // const session = await getServerSession();
        // if (!session) {
        //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        // }
        const idGioHang = parseInt(params.id);
        const cartItem = await prisma.gioHang.delete({
          where: {
            idGioHang,
          },
        });
        return NextResponse.json({cartItem, message: 'Item deleted' });
      } catch (error) {
        console.error('Delete cart item error:', error);
     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
      }
  }