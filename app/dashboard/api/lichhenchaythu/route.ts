import { getSession } from "@/app/lib/auth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {TenKhachHang, Sdt, Email, idLoaiXe, idXe, NgayHen, GioHen, DiaDiem, NoiDung } = await req.json();

    // Debug log
    console.log('NgayLayXe:', NgayHen);
    console.log('GioHenLayXe:', GioHen);

    // Chuyển đổi giờ sang 24-hour
    const GioHenLayXe24h = convertTo24Hour(GioHen);
    console.log('GioHenLayXe (24-hour):', GioHenLayXe24h);

    // Tạo đối tượng Date từ NgayLayXe (ISO 8601)
    const pickupDate = new Date(NgayHen);

    if (isNaN(pickupDate.getTime())) {
      throw new Error("Giá trị ngày không hợp lệ");
    }

    // Tách giờ và phút từ GioHenLayXe24h
    const [hours, minutes] = GioHenLayXe24h.split(':').map(Number);

    // Gán giờ và phút vào đối tượng Date theo giờ địa phương
    pickupDate.setHours(hours, minutes, 0, 0); // Sử dụng setHours thay vì setUTCHours

    console.log('pickupDateTime (combined):', pickupDate.toISOString());

    // Lưu vào cơ sở dữ liệu
    const lichHenLay = await prisma.lichHen.create({
      data: {
        TenKhachHang: TenKhachHang.trim(),
        Sdt: Sdt.trim(),
        Email: Email.trim(),
        idXe: parseInt(idXe),
        idLoaiXe: parseInt(idLoaiXe), 
        GioHen: pickupDate,  
        NgayHen: pickupDate.toISOString(),
        DiaDiem: DiaDiem.trim(),
        NoiDung: NoiDung.trim(),
      },
    });

    return NextResponse.json(lichHenLay);
  } catch (error: any) {
    console.error('Pickup schedule creation error:', error.message);
    return NextResponse.json(
      { error: 'Không thể tạo lịch hẹn lấy xe', details: error.message },
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


  export async function GET() {
    try {
      
      // Fetch pickup schedules for the current user
      const pickupSchedules = await prisma.lichHen.findMany({
        include: {
            xe: true,
             // Optional: include vehicle details if needed
          }
      });
      
      return NextResponse.json(pickupSchedules);
    } catch (error) {
      console.error('Pickup schedules fetch error:', error);
      return NextResponse.json({ error: 'Không thể tải lịch hẹn lấy xe' }, { status: 500 });
    }
  }
  