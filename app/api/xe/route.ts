import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export function POST (req: NextRequest, res: NextResponse) {
      const body = req.json();
      const xe = prisma.xe.create({
        data: {
            

            
        }
      })
}