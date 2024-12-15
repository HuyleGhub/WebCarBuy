import prisma from "@/prisma/client"
import { NextResponse } from "next/server"

export async function GET () {
    const xe = await prisma.xe.findMany()
    return NextResponse.json(xe)
  }