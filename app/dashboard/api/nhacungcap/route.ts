import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nhaCungCapSchema from "../../zodschema/nhacungcapzod/route";
import Email from "next-auth/providers/email";
import { parse } from "path";
import ExcelJS from "exceljs";

export async function GET() {
    const data = await prisma.nhaCungCap.findMany()
    return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
  
      // Check if request is for creating a new supplier or exporting to Excel
      const searchParams = request.nextUrl.searchParams;
      const isExport = searchParams.get('export') === 'true';
  
      // If it's an export request
      if (isExport) {
        const searchText = body.search || '';
  
        // Construct where clause for search
        const whereClause = searchText ? {
          OR: [
            { TenNhaCungCap: { contains: searchText, mode: 'insensitive' } },
            { Email: { contains: searchText, mode: 'insensitive' } },
            { Sdt: { contains: searchText, mode: 'insensitive' } }
          ]
        } : {};
  
        // Fetch all matching records
        const data = await prisma.nhaCungCap.findMany({
          where: whereClause,
          orderBy: {
            idNhaCungCap: 'desc'
          }
        });
  
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('NhaCungCap List');
  
        // Define columns
        worksheet.columns = [
          { header: 'ID', key: 'idNhaCungCap', width: 10 },
          { header: 'Tên Nhà Cung Cấp', key: 'TenNhaCungCap', width: 30 },
          { header: 'Số Điện Thoại', key: 'Sdt', width: 20 },
          { header: 'Email', key: 'Email', width: 30 }
        ];
  
        // Add rows
        data.forEach(nhaCungCap => {
          worksheet.addRow({
            idNhaCungCap: nhaCungCap.idNhaCungCap,
            TenNhaCungCap: nhaCungCap.TenNhaCungCap,
            Sdt: nhaCungCap.Sdt,
            Email: nhaCungCap.Email
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
        });
  
        // Generate Excel file
        const buffer = await workbook.xlsx.writeBuffer();
  
        // Return the Excel file
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename=nhacungcap_list.xlsx'
          }
        });
      }
  
      // Validate input data
      const checkNhaCungCap = nhaCungCapSchema.safeParse({
        TenNhaCungCap: body.TenNhaCungCap,
        Sdt: body.Sdt,
        Email: body.Email,
      });
  
      if (!checkNhaCungCap.success) {
        return NextResponse.json({
          message: "Dữ liệu không hợp lệ",
          errors: checkNhaCungCap.error.errors.map(error => ({
            field: error.path.join('.'),
            message: error.message,
          }))
        }, { status: 400 });
      }
  
      // Check if supplier already exists
      const existingNhaCungCap = await prisma.nhaCungCap.findFirst({
        where: {
          OR: [
            { TenNhaCungCap: body.TenNhaCungCap },
            { Email: body.Email },
            { Sdt: body.Sdt }
          ]
        },
      });
  
      if (existingNhaCungCap) {
        return NextResponse.json(
          { message: "Nhà cung cấp đã tồn tại (tên, email hoặc số điện thoại trùng lặp)" },
          { status: 400 }
        );
      }
  
      // Create new supplier
      const newNhaCungCap = await prisma.nhaCungCap.create({
        data: {
          TenNhaCungCap: body.TenNhaCungCap,
          Sdt: body.Sdt,
          Email: body.Email
        },
      });
  
      return NextResponse.json({
        data: newNhaCungCap,
        message: "Thêm nhà cung cấp thành công"
      }, { status: 201 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { message: "Lỗi khi xử lý yêu cầu: " + (error as Error).message },
        { status: 500 }
      );
    }
  }