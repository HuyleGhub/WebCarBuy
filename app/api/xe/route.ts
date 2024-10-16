import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest, res: NextResponse) {
      const body = req.json();
      const xe = await prisma.xe.create({
        data: {
            
            
        }
      })
      
}
export async function GET (req: NextRequest, res: NextResponse) {
        const xe = await prisma.xe.findMany();
       return NextResponse.json(xe);
}
