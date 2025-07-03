import { sendEmail } from "@/app/emailService/route";
import { createAppointmentEmailTemplate } from "@/app/emailTemplate/route";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {TenKhachHang, Sdt, Email, idLoaiXe, idXe, NgayHen, GioHen, DiaDiem, NoiDung, trangThai } = await req.json();
    
    console.log('Received appointment data:', { 
      NgayHen, 
      GioHen, 
      idXe, 
      idLoaiXe 
    });

    // Handle the primary date (NgayHen)
    const pickupDate = new Date(NgayHen);
    if (isNaN(pickupDate.getTime())) {
      throw new Error("Giá trị ngày không hợp lệ");
    }
    console.log('Parsed date:', pickupDate);

    // Handle GioHen - special case for ISO format
    if (GioHen && typeof GioHen === 'string') {
      try {
        // Check if GioHen is a full ISO date-time string
        if (GioHen.includes('T') && GioHen.includes('-')) {
          console.log('Detected ISO datetime format for GioHen');
          const timeDate = new Date(GioHen);
          
          if (!isNaN(timeDate.getTime())) {
            // Extract just the time portion from the ISO string
            pickupDate.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);
            console.log('Successfully extracted time from ISO datetime:', 
              { hours: timeDate.getHours(), minutes: timeDate.getMinutes() });
          } else {
            throw new Error("Không thể parse giá trị thời gian ISO");
          }
        } 
        // Standard time format handling
        else {
          const convertedTime = convertTo24Hour(GioHen);
          console.log('Converted time:', convertedTime);
          
          if (!convertedTime) {
            throw new Error("Định dạng giờ không được hỗ trợ");
          } else {
            const [hours, minutes] = convertedTime.split(':').map(Number);
            pickupDate.setHours(hours, minutes, 0, 0);
          }
        }
      } catch (timeError) {
        console.error('Time parsing error:', timeError);
        throw new Error(`Không thể xử lý giá trị giờ: ${GioHen}`);
      }
    } else if (!GioHen) {
      console.log('GioHen is missing, using noon');
      // Default to noon if no time provided
      pickupDate.setHours(12, 0, 0, 0);
    }

    // Ensure IDs are valid integers
    const safeIdXe = idXe !== undefined && idXe !== null ? parseInt(String(idXe)) : null;
    const safeIdLoaiXe = idLoaiXe !== undefined && idLoaiXe !== null ? parseInt(String(idLoaiXe)) : null;

    if ((safeIdXe !== null && isNaN(safeIdXe)) || (safeIdLoaiXe !== null && isNaN(safeIdLoaiXe))) {
      throw new Error("ID xe hoặc ID loại xe không hợp lệ");
    }

    console.log('Final datetime for database:', pickupDate);
    
    // Lưu vào cơ sở dữ liệu
    const lichHenLay = await prisma.lichHen.create({
      data: {
        TenKhachHang: TenKhachHang?.trim() || '',
        Sdt: Sdt?.trim() || '',
        Email: Email?.trim() || '',
        idXe: safeIdXe,
        idLoaiXe: safeIdLoaiXe, 
        GioHen: pickupDate,  
        NgayHen: pickupDate,
        DiaDiem: DiaDiem?.trim() || '',
        NoiDung: NoiDung?.trim() || '',
        trangThai: trangThai || 'PENDING'
      },
      include: {
        xe: true
      }
    });

    // Ensure required data is available before sending email
    if (lichHenLay && lichHenLay.Email) {
      let formattedTime = '';
      try {
        // Format the time for email in a user-friendly way
        const hours = pickupDate.getHours();
        const minutes = pickupDate.getMinutes();
        formattedTime = `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
      } catch (e) {
        formattedTime = GioHen || '';
      }

      const emailHtml = createAppointmentEmailTemplate({
        TenKhachHang: lichHenLay.TenKhachHang || '',
        NgayHen: lichHenLay.NgayHen || null,
        GioHen: formattedTime,
        DiaDiem: lichHenLay.DiaDiem || '',
        NoiDung: lichHenLay.NoiDung || '',
        xe: {
          TenXe: lichHenLay.xe?.TenXe || null
        }
      });

      await sendEmail(
        lichHenLay.Email,
        'Xác nhận lịch hẹn lái thử xe',
        emailHtml
      );
    }

    return NextResponse.json(lichHenLay);
  } catch (error: any) {
    console.error('Pickup schedule creation error:', error.message);
    return NextResponse.json(
      { error: 'Không thể tạo lịch hẹn lấy xe', details: error.message },
      { status: 500 }
    );
  }
}

function convertTo24Hour(time12h: string): string | null {
  if (!time12h || typeof time12h !== 'string') {
    console.log('Invalid time format (empty or not string):', time12h);
    return null;
  }

  // Log the original time input for debugging
  console.log('Original time input:', time12h);
  
  // Try to handle various time formats
  try {
    // Case 1: Already in 24-hour format (HH:MM)
    if (!time12h.toLowerCase().includes('am') && !time12h.toLowerCase().includes('pm')) {
      const timeParts = time12h.split(':');
      if (timeParts.length === 2) {
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        
        if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
      }
    } 
    // Case 2: 12-hour format with space (HH:MM AM/PM)
    else if (time12h.includes(' ')) {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
        console.log('Invalid hour or minute values:', {hours, minutes});
        return null;
      }

      if (hours < 0 || hours > 12 || minutes < 0 || minutes > 59) {
        console.log('Hours or minutes out of range:', {hours, minutes});
        return null;
      }

      const mod = modifier.toUpperCase();
      if (mod === 'PM' && hours !== 12) {
        hours += 12;
      } else if (mod === 'AM' && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    // Case 3: 12-hour format without space (HH:MMAM/PM)
    else {
      // Extract AM/PM
      const hasAM = time12h.toLowerCase().includes('am');
      const hasPM = time12h.toLowerCase().includes('pm');
      
      if (hasAM || hasPM) {
        let timeWithoutAmPm = time12h.toLowerCase().replace('am', '').replace('pm', '');
        const timeParts = timeWithoutAmPm.split(':');
        
        if (timeParts.length === 2) {
          let hours = parseInt(timeParts[0]);
          let minutes = parseInt(timeParts[1]);
          
          if (isNaN(hours) || isNaN(minutes)) {
            console.log('Invalid hour or minute values in no-space format:', {hours, minutes});
            return null;
          }
          
          if (hasPM && hours !== 12) {
            hours += 12;
          } else if (hasAM && hours === 12) {
            hours = 0;
          }
          
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }
      }
    }

    // If we got here, the format wasn't recognized
    console.log('Unrecognized time format:', time12h);
    return null;
  } catch (error) {
    console.error('Error parsing time:', error);
    return null;
  }
}

export async function GET() {
  try {
    const pickupSchedules = await prisma.lichHen.findMany({
      include: {
        xe: true,
      }
    });
    
    return NextResponse.json(pickupSchedules);
  } catch (error) {
    console.error('Pickup schedules fetch error:', error);
    return NextResponse.json({ error: 'Không thể tải lịch hẹn lấy xe' }, { status: 500 });
  }
}