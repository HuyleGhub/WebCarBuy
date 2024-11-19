import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}:{params: {id: string}}) {
    try {
        const idChiTiet = parseInt(params.id)
        const chiTietDonHang = await prisma.chiTietDonHang.findMany({
            where: {
                idDonHang: idChiTiet
            },
            include: {
                donHang: true,
                xe:true
            }
        })
        return NextResponse.json(chiTietDonHang)
    } catch (error: any) {
        return NextResponse.json(error.message)
    }
} 