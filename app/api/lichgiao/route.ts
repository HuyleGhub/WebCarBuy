import { getSession } from '@/app/lib/auth';
import prisma from '@/prisma/client'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
      const { 
        idDatCoc, 
        idXe, 
        NgayGiao, 
        GioGiao, 
        TrangThai 
      } = await req.json();

      const lichGiao = await prisma.lichGiaoXe.create({
        data: {
          idDatCoc: parseInt(idDatCoc),
          idXe: parseInt(idXe),
          idKhachHang: session.idUsers,
          NgayGiao: new Date(NgayGiao),
          GioGiao: new Date(GioGiao),
          TrangThai: TrangThai
        }
      })

      return NextResponse.json(lichGiao)
    } catch (error) {
      console.error('Delivery schedule creation error:', error)
      return NextResponse.json({ error: 'Không thể tạo lịch giao xe' })
    }
}