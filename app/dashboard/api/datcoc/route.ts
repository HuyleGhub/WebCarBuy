

import { getSession } from '@/app/lib/auth'
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        const body = await req.json();

        // Create deposit record
        const datCoc = await prisma.datCoc.create({
            data: {
                idXe: parseInt(body.idXe),
                idKhachHang: session.idUsers,
                NgayDat: new Date(body.NgayDat),
                SotienDat: parseInt(body.SotienDat),
                TrangThaiDat: body.TrangThaiDat
            }
        });

        return NextResponse.json(datCoc);
    } catch (error) {
        console.error('Deposit creation error:', error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Không thể tạo đơn đặt cọc' }, { status: 500 });
        }
    }
}

export async function GET() { 
    const session = await getSession();
    try {
    const datCoc = await prisma.datCoc.findMany({
        where: {
            idKhachHang: session.idUsers,
        },
        include: {
            xe: {
                select: {
                    TenXe: true,
                    GiaXe: true,
                    HinhAnh: true,
                    MauSac: true,
                }
            },
            LichHenLayXe: {
                select:{
                    NgayLayXe: true,
                    GioHenLayXe: true,
                    DiaDiem: true,
                },
            }
        }
    })
    return NextResponse.json(datCoc);
    }catch (error: any) {
      return NextResponse.json({ error: error.message }, { status:500})
    }
}