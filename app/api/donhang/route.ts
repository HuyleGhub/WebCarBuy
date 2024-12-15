import { getSession } from "@/app/lib/auth";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();
        const donhang = await prisma.donHang.findMany({
            where:{
                idKhachHang: session.idUsers
            },
            include: {
                ChiTietDonHang:{
                    include: {
                        xe: {
                            select: {
                                TenXe: true,
                                GiaXe: true,
                                HinhAnh: true,
                                MauSac: true,
                            }
                        }
                    }
                },
                LichGiaoXe:{
                    select: {
                        NgayGiao: true,
                        TrangThai: true,
                    }
                }
            }
        })
        return NextResponse.json(donhang)
    } catch (error: any) {
        return NextResponse.json({ error: error.message})
    }
}