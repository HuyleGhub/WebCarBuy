import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import loaiXeSchema from "../../zodschema/loaixezod/route";
import ExcelJS from "exceljs";

export async function GET() {
    const loaiXe = await prisma.loaiXe.findMany();
    return NextResponse.json(loaiXe);
}

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
  
      // Check if request is for creating a new loaiXe or exporting to Excel
      const searchParams = request.nextUrl.searchParams;
      const isExport = searchParams.get('export') === 'true';
  
      // If it's an export request
      if (isExport) {
        const searchText = body.search || '';
  
        // Construct where clause for search
        const whereClause = searchText ? {
          OR: [
            { TenLoai: { contains: searchText, mode: 'insensitive' } },
            { NhanHieu: { contains: searchText, mode: 'insensitive' } }
          ]
        } : {};
  
        // Fetch all matching records
        const data = await prisma.loaiXe.findMany({
          where: whereClause,
          orderBy: {
            idLoaiXe: 'desc'
          }
        });
  
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('LoaiXe List');
  
        // Define columns
        worksheet.columns = [
          { header: 'ID', key: 'idLoaiXe', width: 10 },
          { header: 'Tên Loại', key: 'TenLoai', width: 30 },
          { header: 'Nhãn Hiệu', key: 'NhanHieu', width: 30 }
        ];
  
        // Add rows
        data.forEach(loaiXe => {
          worksheet.addRow({
            idLoaiXe: loaiXe.idLoaiXe,
            TenLoai: loaiXe.TenLoai,
            NhanHieu: loaiXe.NhanHieu
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
            'Content-Disposition': 'attachment; filename=loaixe_list.xlsx'
          }
        });
      }
  
      // Original loaiXe creation logic
      // Check if loaiXe already exists
      const existingLoaiXe = await prisma.loaiXe.findFirst({
        where: {
          TenLoai: body.TenLoai,
        },
      });
      if (existingLoaiXe) {
        return NextResponse.json(
          { message: "Tên loại xe đã tồn tại" },
          { status: 400 }
        );
      }
  
      // Ensure HinhAnh is properly handled as an array
      const imageUrls = Array.isArray(body.HinhAnh) ? body.HinhAnh : [body.HinhAnh].filter(Boolean);
  
      const newLoaiXe = await prisma.loaiXe.create({
        data: {
          TenLoai: body.TenLoai,
          NhanHieu: body.NhanHieu,
          HinhAnh: imageUrls.join('|'), // Use a separator that won't appear in URLs
        },
      });
  
      return NextResponse.json({
        newLoaiXe,
        message: "Thêm loại xe thành công"
      }, { status: 201 });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { message: "Lỗi khi xử lý yêu cầu" },
        { status: 500 }
      );
    }
  }