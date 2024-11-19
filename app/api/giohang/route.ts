import { getSession } from "@/app/lib/auth";
import prisma from "@/prisma/client";

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
      const session = await getSession();
      // if (!session || !session.idUsers) {
      //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // }

      // Verify user role
      // const user = await prisma.users.findUnique({
      //     where: { idUsers: session.idUsers },
      //     include: { role: true }
      // });

      // if (!user || user.role?.TenNguoiDung !== 'KhachHang') {
      //     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      // }

      const cartItem = await prisma.gioHang.findMany({
          where: {
              idKhachHang: session.idUsers // Filter by user ID
          },
          include: {
              xe: {
                  select: {
                      TenXe: true,
                      GiaXe: true,
                      MauSac: true,
                      HinhAnh: true,
                      TrangThai: true
                  }
              }
          }
      });
      return NextResponse.json(cartItem);
  } catch (error) {
      console.error('Cart fetch error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
      const session = await getSession();
      // if (!session || !session.idUsers) {
      //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      // }
        const { idXe, SoLuong } = await req.json();
      //   const user = await prisma.users.findUnique({
      //     where: { idUsers: session.idUsers },
      //     include: { role: true }
      // });

      // if (!user || user.role?.TenNguoiDung !== 'KhachHang') {
      //     return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      // }

        // Check if item already exists in cart
        const existingItem = await prisma.gioHang.findFirst({
          where: {
            idXe,
            idKhachHang: session.idUsers,
          },
        });
    
        if (existingItem) {
          // Update quantity if item exists
          const updatedItem = await prisma.gioHang.update({
            where: {
              idGioHang: existingItem.idGioHang,
            },
            data: {
              SoLuong: existingItem.SoLuong + SoLuong,
            },
          });
          return NextResponse.json(updatedItem);
        
        }
        const cartItem = await prisma.gioHang.create({
            data: {
              idXe,
              SoLuong,
              idKhachHang: session.idUsers, // Add user ID to the cart item
            },
          });
          return NextResponse.json(cartItem);
        } catch (error) {
          console.error('Add to cart error:', error);
          return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}