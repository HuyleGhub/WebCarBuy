import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const nguoiDung = await prisma.users.count()
        return NextResponse.json(nguoiDung)
    } catch (error: any) {
        return NextResponse.json({ error: error.message})
    }
}