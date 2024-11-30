import prisma from "@/prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, {params}:{params:{id: string}}) {
    try {
    const idDatCoc = parseInt(params.id)
    const data = await prisma.lichHenLayXe.findMany({
      where: {
        idDatCoc: idDatCoc,
      }
    })
    return NextResponse.json(data)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ message: 'Error fetching data' })
    } 
}