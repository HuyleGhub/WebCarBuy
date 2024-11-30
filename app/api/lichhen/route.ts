
import { getSession } from '@/app/lib/auth';
import prisma from '@/prisma/client'
import { PrismaClient } from '@prisma/client'
import { Session } from 'inspector/promises'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest) { 
  try { 
    const session = await getSession(); 
    const { idDatCoc, idXe, NgayLayXe, GioHenLayXe, DiaDiem } = await req.json()
    
    // Parse time separately
    const [hours, minutes] = GioHenLayXe.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const lichHenLay = await prisma.lichHenLayXe.create({ 
      data: { 
        idDatCoc: parseInt(idDatCoc), 
        idXe: parseInt(idXe), 
        idKhachHang: session.idUsers, 
        NgayLayXe: new Date(NgayLayXe), 
        GioHenLayXe: timeDate, 
        DiaDiem: DiaDiem 
      } 
    })
    
    return NextResponse.json(lichHenLay) 
  } catch (error) { 
    console.error('Pickup schedule creation error:', error) 
    return NextResponse.json({ error: 'Không thể tạo lịch hẹn lấy xe' }) 
  }
}


