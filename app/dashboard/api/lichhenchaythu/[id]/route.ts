import { sendEmail } from "@/app/emailService/route";
import { deleteAppointmentEmailTemplate, updateAppointmentEmailTemplate } from "@/app/emailTemplate/route";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Lấy và log toàn bộ dữ liệu đầu vào
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (error) {
      console.error('JSON parse error:', error);
      return NextResponse.json({ 
        error: 'Định dạng JSON không hợp lệ',
        details: String(error) 
      }, { status: 400 });
    }

    // Log body để debug
    console.log('Parsed body:', body);
    
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
    } = body;

    // Kiểm tra lịch hẹn tồn tại
    const existingLichHen = await prisma.lichHen.findUnique({
      where: { idLichHen: parseInt(id) }
    });

    if (!existingLichHen) {
      console.log('Appointment not found, id:', id);
      return NextResponse.json(
        { error: 'Không tìm thấy lịch hẹn', id },
        { status: 404 }
      );
    }

    // Chuẩn bị dữ liệu cập nhật với giá trị mặc định từ lịch hẹn hiện tại
    const updateData: any = {
      TenKhachHang: TenKhachHang?.trim() ?? existingLichHen.TenKhachHang ?? '',
      Sdt: Sdt?.trim() ?? existingLichHen.Sdt ?? '',
      Email: Email?.trim() ?? existingLichHen.Email ?? '',
      DiaDiem: DiaDiem?.trim() ?? existingLichHen.DiaDiem ?? '',
      NoiDung: NoiDung?.trim() ?? existingLichHen.NoiDung ?? '',
    };
    
    // Xử lý ngày và giờ
    let appointmentDate: Date = existingLichHen.NgayHen ? 
      new Date(existingLichHen.NgayHen) : new Date();
    
    // Nếu có ngày mới, cập nhật
    if (NgayHen) {
      try {
        const newDate = new Date(NgayHen);
        if (!isNaN(newDate.getTime())) {
          // Giữ giờ cũ, chỉ cập nhật ngày tháng năm
          const oldHours = appointmentDate.getHours();
          const oldMinutes = appointmentDate.getMinutes();
          
          appointmentDate = newDate;
          appointmentDate.setHours(oldHours, oldMinutes, 0, 0);
        } else {
          console.log('Invalid NgayHen format, using existing date');
        }
      } catch (error) {
        console.log('Error parsing NgayHen:', error);
        // Không thay đổi ngày nếu có lỗi
      }
    }
    
    // Nếu có giờ mới, cập nhật
    if (GioHen) {
      try {
        // Thử nhiều định dạng giờ khác nhau
        const timeFormats = [
          // Format 24h: "14:30"
          () => {
            if (/^\d{1,2}:\d{2}$/.test(GioHen)) {
              const [hours, minutes] = GioHen.split(':').map(Number);
              if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                appointmentDate.setHours(hours, minutes, 0, 0);
                return true;
              }
            }
            return false;
          },
          // Format 12h: "02:30 PM"
          () => {
            if (GioHen.includes(' ')) {
              const [timeStr, modifier] = GioHen.split(' ');
              if (['AM', 'PM'].includes(modifier) && /^\d{1,2}:\d{2}$/.test(timeStr)) {
                let [hours, minutes] = timeStr.split(':').map(Number);
                if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 12 && minutes >= 0 && minutes < 60) {
                  if (modifier === 'PM' && hours !== 12) hours += 12;
                  if (modifier === 'AM' && hours === 12) hours = 0;
                  appointmentDate.setHours(hours, minutes, 0, 0);
                  return true;
                }
              }
            }
            return false;
          },
          // Simple hour format: "14"
          () => {
            const hour = parseInt(GioHen);
            if (!isNaN(hour) && hour >= 0 && hour < 24) {
              appointmentDate.setHours(hour, 0, 0, 0);
              return true;
            }
            return false;
          }
        ];
        
        // Thử từng định dạng cho đến khi thành công
        let timeProcessed = false;
        for (const formatHandler of timeFormats) {
          if (formatHandler()) {
            timeProcessed = true;
            break;
          }
        }
        
        if (!timeProcessed) {
          console.log('Could not parse time in any format:', GioHen);
        } else {
          console.log('Time processed successfully, result:', appointmentDate);
        }
      } catch (error) {
        console.log('Error processing time:', error);
        // Giữ giờ cũ nếu có lỗi
      }
    }
    
    // Cập nhật ngày giờ vào dữ liệu
    updateData.GioHen = appointmentDate;
    updateData.NgayHen = appointmentDate;
    
    // Xử lý idXe và idLoaiXe
    if (idXe !== undefined && idXe !== null) {
      try {
        updateData.idXe = parseInt(idXe);
        if (isNaN(updateData.idXe)) {
          delete updateData.idXe; // Bỏ qua nếu không hợp lệ
          console.log('Invalid idXe format:', idXe);
        }
      } catch (error) {
        console.log('Error parsing idXe:', error);
      }
    }
    
    if (idLoaiXe !== undefined && idLoaiXe !== null) {
      try {
        updateData.idLoaiXe = parseInt(idLoaiXe);
        if (isNaN(updateData.idLoaiXe)) {
          delete updateData.idLoaiXe; // Bỏ qua nếu không hợp lệ
          console.log('Invalid idLoaiXe format:', idLoaiXe);
        }
      } catch (error) {
        console.log('Error parsing idLoaiXe:', error);
      }
    }
    
    console.log('Final update data:', updateData);

    // Cập nhật lịch hẹn
    const updatedLichHen = await prisma.lichHen.update({
      where: { idLichHen: parseInt(id) },
      data: updateData,
      include: {
        xe: true
      }
    });

    console.log('Appointment updated successfully');

    // Gửi email thông báo
    if (updatedLichHen && updatedLichHen.Email) {
      console.log('Preparing email for:', updatedLichHen.Email);
      
      const formattedTime = updatedLichHen.GioHen ? 
        new Date(updatedLichHen.GioHen).toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        }) : '';
      
      const emailHtml = updateAppointmentEmailTemplate({
        TenKhachHang: updatedLichHen.TenKhachHang || '',
        NgayHen: updatedLichHen.NgayHen || null,
        GioHen: formattedTime,
        DiaDiem: updatedLichHen.DiaDiem || '',
        NoiDung: updatedLichHen.NoiDung || '',
        xe: {
          TenXe: updatedLichHen.xe?.TenXe || null
        }
      });

      try {
        await sendEmail(
          updatedLichHen.Email,
          'Cập nhật lịch hẹn lái thử xe',
          emailHtml
        );
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Không trả lỗi, chỉ ghi log
      }
    }

    return NextResponse.json(updatedLichHen);
  } catch (error: any) {
    console.error('Pickup schedule update error:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Không thể cập nhật lịch hẹn lái thử xe', details: error.message },
      { status: 500 }
    );
  }
}