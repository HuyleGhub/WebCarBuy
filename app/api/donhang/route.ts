import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const donhang = await prisma.donHang.findMany()
        return NextResponse.json(donhang)
    } catch (error: any) {
        return NextResponse.json({ error: error.message})
    }
}