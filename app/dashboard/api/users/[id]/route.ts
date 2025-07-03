import prisma from "@/prisma/client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, {params}: {params: {id: string}}) {
  try {
      const idUser = parseInt(params.id);
      
      // Check if user exists
      const userExists = await prisma.users.findUnique({
          where: { idUsers: idUser }
      });

      if (!userExists) {
          return NextResponse.json({message: "Người dùng không tồn tại"}, {status: 404});
      }

      // Begin transaction to delete related records first
      await prisma.$transaction(async (tx) => {
          // Delete related records in GioHang
          await tx.gioHang.deleteMany({
              where: { idKhachHang: idUser }
          });
          
          // Delete related records in TuVanKhachHang where user is either KhachHang or NhanVien
          await tx.tuVanKhachHang.deleteMany({
              where: {
                  OR: [
                      { idKhachHang: idUser },
                      { idNhanVien: idUser }
                  ]
              }
          });
          
          // Delete related records in Notification
          await tx.notification.deleteMany({
              where: { userId: idUser }
          });
          
          // Delete related records in DanhGiaTraiNghiem
          await tx.danhGiaTraiNghiem.deleteMany({
              where: { idUser: idUser }
          });
          
          // Delete related records in ChamCong
          
          
          // Delete related records in LichLamViec
         ;
          
          // Delete related records in LichHen
          await tx.lichHen.deleteMany({
              where: { idUser: idUser }
          });
          
          // Delete related records in LichHenLayXe
          await tx.lichHenLayXe.deleteMany({
              where: { idKhachHang: idUser }
          });
          
          // Delete related records in LichGiaoXe
          await tx.lichGiaoXe.deleteMany({
              where: { idKhachHang: idUser }
          });
          
          // Delete related records in Luong
          
          
          // Delete related records in DatCoc
          await tx.datCoc.deleteMany({
              where: { idKhachHang: idUser }
          });
          
          // Handle DonHang - this may need special handling
          // since there might be more relationships
          await tx.donHang.deleteMany({
              where: { idKhachHang: idUser }
          });
          
          // Finally delete the user
          await tx.users.delete({
              where: { idUsers: idUser }
          });
      });
      
      return NextResponse.json({message: "Xóa người dùng thành công"}, {status: 200});
  } catch (error: any) {
      console.error("Delete user error:", error);
      
      // Check if it's related to ordering/cascade issues
      if (error.message.includes("Foreign key constraint failed")) {
          return NextResponse.json({
              message: "Không thể xóa người dùng vì còn dữ liệu liên quan phức tạp", 
              hint: "Có thể cần kiểm tra và xóa dữ liệu liên quan trước"
          }, {status: 409});
      }
      
      return NextResponse.json({
          message: "Xóa không thành công",
          error: error.toString()
      }, {status: 500});
  }
}
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();
    
    // Prepare update data
    const updateData: any = {
      Tentaikhoan: data.Tentaikhoan,
      Email: data.Email,
      Hoten: data.Hoten,
      Sdt: data.Sdt,
      Diachi: data.Diachi,
    };

    // Add idRole to updateData if it exists in the request
    if (data.idRole) {
      updateData.idRole = parseInt(data.idRole);
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { 
        idUsers: id 
      },
      data: updateData,
    });

    return NextResponse.json({updatedUser, message:"Cập nhật thành công"});
  } catch (error: any) {
    console.error('Update error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Username or email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}