import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function GET(request: NextRequest) {
    try {
      const searchParams = request.nextUrl.searchParams;
      
      // Pagination parameters
      const page: number = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
      const limit_size: number = searchParams.get('limit_size') ? Number(searchParams.get('limit_size')) : 10;
  
      const skip = (page - 1) * limit_size;
  
      // Search parameter
      const searchText = searchParams.get('search') || '';
  
      // Construct where clause for search
      const whereClause = searchText ? {
        OR: [
          { TenXe: { contains: searchText } },
          { MauSac: { contains: searchText } },
          { DongCo: { contains: searchText } },
          { TrangThai: { contains: searchText } },
          { 
            loaiXe: { 
              TenLoai: { contains: searchText } 
            } 
          }
        ]
      } : {};
  
      // Count total records with search filter
      const totalRecords = await prisma.xe.count({
        where: whereClause
      });
      
      const totalPage = Math.ceil(totalRecords / limit_size);
  
      // Fetch data with search and pagination
      const data = await prisma.xe.findMany({
        where: whereClause,
        skip: skip,
        take: limit_size,
        include: {
          loaiXe: true
        },
        orderBy: {
          idXe: 'desc'
        }
      });
      
      return NextResponse.json(
        {
          data,
          meta: {
            totalRecords,
            totalPage, 
            page, 
            limit_size, 
            skip,
          }
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data', details: error instanceof Error ? error.message : error },
        { status: 500 }
      );
    }
  }

// POST route for creating new xe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if request is for creating a new xe or exporting to Excel
    const searchParams = request.nextUrl.searchParams;
    const isExport = searchParams.get('export') === 'true';

    // If it's an export request
    if (isExport) {
      const searchText = body.search || '';

      // Construct where clause for search
      const whereClause = searchText ? {
        OR: [
          { TenXe: { contains: searchText, mode: 'insensitive' } },
          { MauSac: { contains: searchText, mode: 'insensitive' } },
          { DongCo: { contains: searchText, mode: 'insensitive' } },
          { TrangThai: { contains: searchText, mode: 'insensitive' } },
          { loaiXe: { TenLoai: { contains: searchText, mode: 'insensitive' } } }
        ]
      } : {};

      // Fetch all matching records
      const data = await prisma.xe.findMany({
        where: whereClause,
        include: {
          loaiXe: true
        },
        orderBy: {
          idXe: 'desc'
        }
      });

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Xe List');

      // Define columns
      worksheet.columns = [
        { header: 'ID', key: 'idXe', width: 10 },
        { header: 'Tên Xe', key: 'TenXe', width: 30 },
        { header: 'Loại Xe', key: 'LoaiXe', width: 20 },
        { header: 'Giá Xe', key: 'GiaXe', width: 20 },
        { header: 'Màu Sắc', key: 'MauSac', width: 15 },
        { header: 'Động Cơ', key: 'DongCo', width: 20 },
        { header: 'Trạng Thái', key: 'TrangThai', width: 15 },
        { header: 'Năm Sản Xuất', key: 'NamSanXuat', width: 15 }
      ];

      // Add rows
      data.forEach(xe => {
        worksheet.addRow({
          idXe: xe.idXe,
          TenXe: xe.TenXe,
          LoaiXe: xe.loaiXe?.TenLoai || 'N/A',
          GiaXe: xe.GiaXe !== null 
      ? new Intl.NumberFormat('vi-VN', { 
          style: 'currency', 
          currency: 'VND' 
        }).format(xe.GiaXe.toNumber()) // Use toNumber() for Decimal
      : 'N/A',
          MauSac: xe.MauSac,
          DongCo: xe.DongCo,
          TrangThai: xe.TrangThai,
          NamSanXuat: xe.NamSanXuat
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
          'Content-Disposition': 'attachment; filename=xe_list.xlsx'
        }
      });
    }

    // Original xe creation logic
    // Check if xe already exists
    const existingXe = await prisma.xe.findFirst({
      where: {
        TenXe: body.TenXe,
      },
    });
    if (existingXe) {
      return NextResponse.json(
        { message: "Tên xe đã tồn tại" },
        { status: 400 }
      );
    }
    
    // Ensure HinhAnh is properly handled as an array
    const imageUrls = Array.isArray(body.HinhAnh) ? body.HinhAnh : [body.HinhAnh].filter(Boolean);

    const newXe = await prisma.xe.create({
      data: {
        TenXe: body.TenXe,
        idLoaiXe: parseInt(body.idLoaiXe),
        GiaXe: parseFloat(body.GiaXe),
        MauSac: body.MauSac,
        DongCo: body.DongCo,
        TrangThai: body.TrangThai,
        HinhAnh: imageUrls.join('|'), // Use a separator that won't appear in URLs
        NamSanXuat: body.NamSanXuat
      },
    });
    
    return NextResponse.json({
      newXe,
      message: "Thêm xe thành công"
    }, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Lỗi khi xử lý yêu cầu" },
      { status: 500 }
    );
  }
}