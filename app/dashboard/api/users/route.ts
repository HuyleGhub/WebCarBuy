import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function GET() {
    try{
    const user = await prisma.users.findMany();
    return NextResponse.json(user);
    }catch(error){
      return NextResponse.json({message: "không tìm thấy tài khoản"})
    }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isExport = searchParams.get('export') === 'true';
    
    if (!isExport) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const body = await request.json();
    const searchText = body.search || '';

    // Construct where clause for search
    const whereClause = searchText ? {
      OR: [
        { Hoten: { contains: searchText, mode: 'insensitive' } },
        { Email: { contains: searchText, mode: 'insensitive' } },
        { Sdt: { contains: searchText, mode: 'insensitive' } },
        { Diachi: { contains: searchText, mode: 'insensitive' } },
        { role: { TenNguoiDung: { contains: searchText, mode: 'insensitive' } } }
      ]
    } : {};

    // Fetch users with required fields including idUsers
    const users = await prisma.users.findMany({
      select: {
        idUsers: true, // Added idUsers
        Hoten: true,
        Sdt: true,
        Diachi: true,
        Email: true,
        role: {
          select: {
            TenNguoiDung: true
          }
        }
      },
      where: whereClause,
      orderBy: {
        idUsers: 'desc'
      }
    });

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách người dùng');

    // Define columns with Vietnamese headers, now including ID
    worksheet.columns = [
      { header: 'ID', key: 'idUsers', width: 10 },
      { header: 'Họ Tên', key: 'Hoten', width: 30 },
      { header: 'Số Điện Thoại', key: 'Sdt', width: 15 },
      { header: 'Địa Chỉ', key: 'Diachi', width: 40 },
      { header: 'Email', key: 'Email', width: 30 },
      { header: 'Vai Trò', key: 'Role', width: 20 }
    ];

    // Add rows with ID
    users.forEach(user => {
      worksheet.addRow({
        idUsers: user.idUsers,
        Hoten: user.Hoten || '',
        Sdt: user.Sdt || '',
        Diachi: user.Diachi || '',
        Email: user.Email || '',
        Role: user.role?.TenNguoiDung || ''
      });
    });

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F0F0F0' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        row.eachCell((cell, colNumber) => {
          // Center align the ID column, left align others
          cell.alignment = { 
            vertical: 'middle', 
            horizontal: colNumber === 1 ? 'center' : 'left' 
          };
        });
      }
      // Set row height
      row.height = 25;
    });

    // Auto-filter for all columns
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: 6 } // Updated to include ID column
    };

    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return the Excel file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=danh_sach_nguoi_dung.xlsx'
      }
    });

  } catch (error) {
    console.error("Error exporting users:", error);
    return NextResponse.json(
      { message: "Lỗi khi xuất file: " + (error as Error).message },
      { status: 500 }
    );
  }
}