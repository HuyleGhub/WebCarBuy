import { sendEmail } from "@/app/emailService/route";
import { deleteAppointmentEmailTemplate, updateAppointmentEmailTemplate } from "@/app/emailTemplate/route";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const {
      TenKhachHang, 
      Sdt, 
      Email, 
      idLoaiXe, 
      idXe, 
      NgayHen, 
      GioHen, 
      DiaDiem, 
      NoiDung 
    } = await req.json();

    const GioHenLayXe24h = convertTo24Hour(GioHen);
    const pickupDate = new Date(NgayHen);

    if (isNaN(pickupDate.getTime())) {
      throw new Error("Giá trị ngày không hợp lệ");
    }

    const [hours, minutes] = GioHenLayXe24h.split(':').map(Number);
    pickupDate.setHours(hours, minutes, 0, 0);

    const existingLichHen = await prisma.lichHen.findUnique({
      where: { idLichHen: parseInt(id) }
    });

    if (!existingLichHen) {
      return NextResponse.json(
        { error: 'Không tìm thấy lịch hẹn' },
        { status: 404 }
      );
    }

    const updatedLichHen = await prisma.lichHen.update({
      where: { idLichHen: parseInt(id) },
      data: {
        TenKhachHang: TenKhachHang?.trim() || '',
        Sdt: Sdt?.trim() || '',
        Email: Email?.trim() || '',
        idXe: parseInt(idXe),
        idLoaiXe: parseInt(idLoaiXe), 
        GioHen: pickupDate,  
        NgayHen: pickupDate.toISOString(),
        DiaDiem: DiaDiem?.trim() || '',
        NoiDung: NoiDung?.trim() || '',
      },
      include: {
        xe: true
      }
    });


    // Ensure required data is available before sending email
    if (updatedLichHen && updatedLichHen.Email) {
      const emailHtml = updateAppointmentEmailTemplate({
        TenKhachHang: updatedLichHen.TenKhachHang || '',
        NgayHen: updatedLichHen.NgayHen || null,
        GioHen: GioHen || '',
        DiaDiem: updatedLichHen.DiaDiem || '',
        NoiDung: updatedLichHen.NoiDung || '',
        xe: {
          TenXe: updatedLichHen.xe?.TenXe || null
        }
      });

      await sendEmail(
        updatedLichHen.Email,
        'Cập nhật lịch hẹn lái thử xe',
        emailHtml
      );
    }

    return NextResponse.json(updatedLichHen);
  } catch (error: any) {
    console.error('Pickup schedule update error:', error.message);
    return NextResponse.json(
      { error: 'Không thể cập nhật lịch hẹn lấy xe', details: error.message },
      { status: 500 }
    );
  }
}

function convertTo24Hour(time12h: string): string {
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export async function DELETE(req: NextRequest, {params}: {params: {id:string} }) {
  try {
    const id = parseInt(params.id);
    
    // Lấy thông tin lịch hẹn trước khi xóa để gửi email
    const lichHenToDelete = await prisma.lichHen.findUnique({
      where: { idLichHen: id },
      include: { xe: true }
    });
    
    if (!lichHenToDelete) {
      return NextResponse.json(
        { error: 'Không tìm thấy lịch hẹn' },
        { status: 404 }
      );
    }
    
    // Gửi email thông báo hủy lịch hẹn nếu có email
    if (lichHenToDelete.Email) {
      // Format giờ hẹn từ DateTime sang chuỗi giờ
      const gioHen = lichHenToDelete.GioHen ? 
        new Date(lichHenToDelete.GioHen).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        }) : '';
      
      const emailHtml = deleteAppointmentEmailTemplate({
        TenKhachHang: lichHenToDelete.TenKhachHang || '',
        NgayHen: lichHenToDelete.NgayHen || null,
        GioHen: gioHen,
        DiaDiem: lichHenToDelete.DiaDiem || '',
        NoiDung: lichHenToDelete.NoiDung || '',
        xe: {
          TenXe: lichHenToDelete.xe?.TenXe || null
        }
      });

      await sendEmail(
        lichHenToDelete.Email,
        'Thông báo hủy lịch hẹn lái thử xe',
        emailHtml
      );
    }
    
    // Sau khi gửi email thành công, tiến hành xóa lịch hẹn
    const deletedLichHen = await prisma.lichHen.delete({ 
      where: { idLichHen: id } 
    });
    
    return NextResponse.json(
      {deletedLichHen, message: "Xóa lịch hẹn thành công"}, 
      {status: 200}
    );
  } catch (error: any) {
    console.error('Lỗi khi xóa lịch hẹn:', error);
    return NextResponse.json(
      { error: 'Không thể xóa lịch hẹn', details: error.message },
      { status: 500 }
    );
  }
}