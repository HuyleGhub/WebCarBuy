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
      const csvContent = new TextDecoder().decode(data);
      // CSV handling logic here if needed
    }

    // Map the exported column names to the database field names
    const transformedRecords = records.map(record => ({
      TenLoai: record['Tên Loại'] || record.TenLoai,
      NhanHieu: record['Nhãn Hiệu'] || record.NhanHieu,
      HinhAnh: record['Hình Ảnh'] || record.HinhAnh
    }));

    // Filter out any records where required fields are missing
    const validRecords = transformedRecords.filter(record => 
      record.TenLoai && 
      record.TenLoai !== 'N/A' &&
      record.NhanHieu && 
      record.NhanHieu !== 'N/A'
    );

    if (validRecords.length === 0) {
      return NextResponse.json(
        { error: 'No valid records found in the file' },
        { status: 400 }
      );
    }

    // Batch insert using Prisma
    const result = await prisma.loaiXe.createMany({
      data: validRecords,
      skipDuplicates: true
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      totalRecords: records.length,
      validRecords: validRecords.length,
      skippedRecords: records.length - validRecords.length
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}