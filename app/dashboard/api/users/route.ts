import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try{
    const user = await prisma.users.findMany();
    return NextResponse.json(user);
    }catch(error){
      return NextResponse.json({message: "không tìm thấy tài khoản"})
    }
}

