import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const donhang = await prisma.donHang.count()
        return NextResponse.json(donhang)
    } catch (error: any) {
        return NextResponse.json({ error: error.message})
    }
}