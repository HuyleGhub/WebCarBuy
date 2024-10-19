import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    const loaiXe = await prisma.loaiXe.findMany();
    return NextResponse.json(loaiXe);
}