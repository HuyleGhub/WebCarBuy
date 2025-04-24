import prisma from '@/prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server'
import { createDatCocAppointmentEmailTemplate, deleteManyDatCocAppointmentEmailTemplate } from "@/app/emailTemplate/route";
import { sendEmail } from '@/app/emailService/route';

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
      include: { 
        xe: true, 
        khachHang: true, 
        LichHenLayXe: true 
      }
    });

    if (!datCoc || !datCoc.khachHang) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin đặt cọc' }, { status: 404 })
    }

    // Delete associated pickup and delivery schedules
    await prisma.lichHenLayXe.deleteMany({ where: { idDatCoc: id } })
    await prisma.lichGiaoXe.deleteMany({ where: { idDatCoc: id } })

    // Set idDatCoc to null for the specific ChiTietDatCoc record
    await prisma.chiTietDatCoc.updateMany({ 
      where: { idDatCoc: id }, 
      data: { idDatCoc: null } 
    })

    // Delete the deposit
    await prisma.datCoc.deleteMany({ where: { idDatCoc: id } })

    // Update vehicle status
    if(datCoc?.idXe) {
      await prisma.xe.update({ 
        where: { idXe: datCoc.idXe}, 
        data: { TrangThai: 'Còn Hàng' } 
      })
    }

    // Prepare email data
    const emailTemplate = deleteManyDatCocAppointmentEmailTemplate({
      TenKhachHang: datCoc.khachHang.Hoten || 'Khách hàng',
      NgayLayXe: datCoc.LichHenLayXe[0]?.NgayLayXe?.toISOString() || null,
      GioHenLayXe: datCoc.LichHenLayXe[0]?.GioHenLayXe || '',
      DiaDiem: datCoc.LichHenLayXe[0]?.DiaDiem || '',
      NoiDung: 'Hủy đơn đặt cọc',
      Email: datCoc.khachHang.Email || '',
      Sdt: datCoc.khachHang.Sdt || '',
      SotienDat: datCoc.SotienDat?.toNumber() || 0,
      NgayDat: datCoc.NgayDat?.toISOString() || null,
      xe: {
        TenXe: datCoc.xe?.TenXe || null
      }
    });

    // Send cancellation email
    if (datCoc.khachHang.Email) {
      await sendEmail(
        datCoc.khachHang.Email, 
        'Thông báo hủy đơn đặt cọc', 
        emailTemplate
      );
    }

    return NextResponse.json({ message: 'Hủy đơn đặt cọc thành công' })
  } catch (error) {
    console.error('Cancel deposit error:', error)
    return NextResponse.json({ error: 'Không thể hủy đơn đặt cọc' }, { status: 500 })
  }
}
export async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
  try {
    const id = parseInt(params.id)
    const body = await req.json()
    
    const datCoc = await prisma.datCoc.findUnique({
      where: { idDatCoc: id },
      include: {
        xe: true,
        khachHang: true,
        LichHenLayXe: true
      }
    });

    if (!datCoc || !datCoc.khachHang) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin đặt cọc' }, { status: 404 })
    }

    const updatedDatCoc = await prisma.datCoc.update({
      where: { 
        idDatCoc: id 
      },
      data: {
        TrangThaiDat: body.TrangThaiDat,
      }
    })
   
    // Prepare email data
    const emailTemplate = createDatCocAppointmentEmailTemplate({
      TenKhachHang: datCoc.khachHang.Hoten || 'Khách hàng',
      NgayLayXe: datCoc.LichHenLayXe[0]?.NgayLayXe?.toISOString() || null,
      GioHenLayXe: datCoc.LichHenLayXe[0]?.GioHenLayXe || '',
      DiaDiem: datCoc.LichHenLayXe[0]?.DiaDiem || '',
      NoiDung: `Cập nhật trạng thái: ${body.TrangThaiDat}`,
      Email: datCoc.khachHang.Email || '',
      Sdt: datCoc.khachHang.Sdt || '',
      SotienDat: datCoc.SotienDat?.toNumber() || 0,
      NgayDat: datCoc.NgayDat?.toISOString() || null,
      xe: {
        TenXe: datCoc.xe?.TenXe || null
      }
    });

    // Send update email
    if (datCoc.khachHang.Email) {
      await sendEmail(
        datCoc.khachHang.Email, 
        'Cập nhật trạng thái đơn đặt cọc', 
        emailTemplate
      );
    }

    return NextResponse.json({ 
      datCoc: updatedDatCoc, 
      message: 'Cập nhật trạng thái đơn đặt cọc thành công' 
    })
  } catch (error: any) {
    console.error('Update deposit error:', error)
    return NextResponse.json({error: error.message}, { status: 500 })
  }
}