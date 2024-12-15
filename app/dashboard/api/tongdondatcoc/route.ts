import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const datCoc = await prisma.datCoc.count()
        
        return NextResponse.json(datCoc)
    } catch (error: any) {
        return NextResponse.json({ error: error.message})
    }
}