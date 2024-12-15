import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

export async function GET(req: NextApiRequest, {params}:{params: {id:string}}) {
    try {
        const id = parseInt(params.id)
      const datCoc = await prisma.datCoc.findUnique({
        where: { 
          idDatCoc: id
        },
        include: {
          xe: true,
          khachHang: true,
          LichHenLayXe: true,
          LichGiaoXe: true
        }
      })

      if (!datCoc) {
        return NextResponse.json({ error: 'Không tìm thấy thông tin đặt cọc' })
      }

      return NextResponse.json({datCoc, message: "đặt cọc thành công"})
    } catch (error) {
      console.error('Deposit details error:', error)
      return NextResponse.json({ error: 'Không thể lấy thông tin đặt cọc' })
    }
}

export async function DELETE(req: NextApiRequest, {params}:{params: {id:string}}) {
    try {
        const id = parseInt(params.id)
        const datCoc = await prisma.datCoc.findUnique({
          where: { idDatCoc: id },
          select: { idXe: true }
        });
        // Check if deposit exists


        // Delete associated pickup and delivery schedules
        await prisma.lichHenLayXe.deleteMany({
            where: { idDatCoc: id }
        })

        await prisma.lichGiaoXe.deleteMany({
            where: { idDatCoc: id }
        })

        // Delete the deposit
        await prisma.datCoc.delete({
            where: { idDatCoc: id }
        })
        if(datCoc?.idXe)
        await prisma.xe.update({
          where: { idXe: datCoc.idXe},
          data: {
            TrangThai: 'Còn Hàng',
          }
        })

        return NextResponse.json({ message: 'Hủy đơn đặt cọc thành công' })
    } catch (error) {
        console.error('Cancel deposit error:', error)
        return NextResponse.json({ error: 'Không thể hủy đơn đặt cọc' }, { status: 500 })
    }
}