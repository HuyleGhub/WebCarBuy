import { getSession } from "@/app/lib/auth"
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

export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const { idDatCoc, idXe, NgayLayXe, GioHenLayXe, DiaDiem } = await req.json();
    const id = parseInt(params.id);

    // Similar conversion logic as in POST method
    const pickupDate = new Date(NgayLayXe);
    const [hours, minutes] = GioHenLayXe.split(':').map(Number);
    pickupDate.setHours(hours, minutes, 0, 0);

    // Update in database
    const updatedLichHenLay = await prisma.lichHenLayXe.update({
      where: { idLichHenLayXe: id },
      data: {
        idDatCoc: parseInt(idDatCoc),
        idXe: parseInt(idXe),
        NgayLayXe: pickupDate.toISOString(),
        GioHenLayXe: pickupDate,
        DiaDiem: DiaDiem,
      },
    });

    return NextResponse.json(updatedLichHenLay);
  } catch (error: any) {
    console.error('Pickup schedule update error:', error.message);
    return NextResponse.json(
      { error: 'Không thể cập nhật lịch hẹn lấy xe', details: error.message },
      { status: 500 }
    );
  }
}