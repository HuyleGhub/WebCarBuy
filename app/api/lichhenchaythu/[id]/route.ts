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
  
      // Debug log
      console.log('Updating Schedule ID:', id);
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
      pickupDate.setHours(hours, minutes, 0, 0);
  
      console.log('pickupDateTime (combined):', pickupDate.toISOString());
  
      // Kiểm tra xem lịch hẹn có tồn tại không
      const existingLichHen = await prisma.lichHen.findUnique({
        where: { idLichHen: parseInt(id) }
      });
  
      if (!existingLichHen) {
        return NextResponse.json(
          { error: 'Không tìm thấy lịch hẹn' },
          { status: 404 }
        );
      }
  
      // Cập nhật vào cơ sở dữ liệu
      const updatedLichHen = await prisma.lichHen.update({
        where: { idLichHen: parseInt(id) },
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
          trangThai: 'PENDING',
        },
      });
  
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
      const deletedLichHen = await prisma.lichHen.delete({ where: { idLichHen: id } });
      return NextResponse.json({deletedLichHen, message: "Xóa lịch hẹn thành công"}, {status: 200});
    } catch (error: any) {
      return NextResponse.json(error.message);
    }
}