import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const role = await prisma.role.findMany()
        return NextResponse.json(role)
    } catch (error: any) {
        return NextResponse.json({message: error.message})
    }
}