import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const chiTietDonHang = await prisma.chiTietDonHang.findMany()
        return NextResponse.json(chiTietDonHang)
    } catch (error: any) {
        return NextResponse.json(error.message);
    }
}