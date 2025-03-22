// Trong file API route (ví dụ: api/lichhenchaythu/duyet/[id]/route.ts)
import { sendEmail } from "@/app/emailService/route";
import { createAppointmentEmailTemplate } from "@/app/emailTemplate/route";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Cập nhật trạng thái duyệt (giả sử bạn cần thêm trường trangThai vào model LichHen)
    const updatedLichHen = await prisma.lichHen.update({
      where: { idLichHen: parseInt(id) },
      data: {
        trangThai: 'APPROVED' // Thêm trường này vào model Prisma của bạn
      },
      include: {
        xe: true
      }
    });

    // Ensure required data is available before sending email
    if (updatedLichHen && updatedLichHen.Email) {
      // Format giờ hẹn từ DateTime sang chuỗi giờ
      const gioHen = updatedLichHen.GioHen ? 
        new Date(updatedLichHen.GioHen).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        }) : '';
      
      const emailHtml = createAppointmentEmailTemplate({
        TenKhachHang: updatedLichHen.TenKhachHang || '',
        NgayHen: updatedLichHen.NgayHen || null,
        GioHen: gioHen,
        DiaDiem: updatedLichHen.DiaDiem || '',
        NoiDung: updatedLichHen.NoiDung || '',
        xe: {
          TenXe: updatedLichHen.xe?.TenXe || null
        }
      });

      await sendEmail(
        updatedLichHen.Email,
        'Xác nhận lịch hẹn lái thử xe',
        emailHtml
      );
    }

    return NextResponse.json({
      data: updatedLichHen,
      message: "Duyệt lịch hẹn thành công"
    });
  } catch (error: any) {
    console.error('Lỗi khi duyệt lịch hẹn:', error.message);
    return NextResponse.json(
      { error: 'Không thể duyệt lịch hẹn', details: error.message },
      { status: 500 }
    );
  }
}