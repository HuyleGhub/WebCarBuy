import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    
    let records: any[] = [];

    if (fileType === 'excel') {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      records = XLSX.utils.sheet_to_json(worksheet);
    } else if (fileType === 'csv') {
      return NextResponse.json(
        { error: 'CSV format is not supported' },
        { status: 400 }
      );
    }

    // First, fetch all loaiXe to map names to IDs
    const loaiXeList = await prisma.loaiXe.findMany();
    const loaiXeMap = new Map(loaiXeList.map(loai => [loai.TenLoai, loai.idLoaiXe]));

    // Transform and validate the records
    const transformedRecords = await Promise.all(records.map(async (record) => {
      // Get loaiXe ID from name
      const loaiXeName = record['Loại Xe'];
      const idLoaiXe = loaiXeMap.get(loaiXeName);
      
      if (!idLoaiXe) {
        throw new Error(`Invalid Loại Xe: ${loaiXeName}`);
      }

      // Parse price from formatted string (remove currency symbol and commas)
      const priceString = record['Giá Xe']
        .replace(/[^\d,]/g, '') // Remove currency symbol and any non-digit characters except commas
        .replace(/,/g, '');     // Remove commas
      const giaXe = parseInt(priceString, 10);

      // Transform the record to match database schema
      return {
        TenXe: record['Tên Xe'],
        idLoaiXe: idLoaiXe,
        GiaXe: giaXe,
        MauSac: record['Màu Sắc'],
        DongCo: record['Động Cơ'],
        TrangThai: record['Trạng Thái'],
        NamSanXuat: record['Năm Sản Xuất'],
        // Preserve existing HinhAnh if available in the database
        HinhAnh: await getExistingHinhAnh(record['Tên Xe'])
      };
    }));

    // Batch insert using Prisma
    const result = await prisma.xe.createMany({
      data: transformedRecords,
      skipDuplicates: true
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      data: transformedRecords
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to get existing HinhAnh for a car
async function getExistingHinhAnh(tenXe: string): Promise<string | null> {
  const existingCar = await prisma.xe.findFirst({
    where: { TenXe: tenXe }
  });
  return existingCar?.HinhAnh || null;
}