import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  try {
    // Lấy danh sách xe từ DB
    const xeList = await prisma.xe.findMany({
      include: { loaiXe: true }, // Lấy thông tin loại xe
    });

    // Tạo HTML bảng báo cáo
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: blue; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Báo cáo danh sách xe ô tô</h1>
          <p>Ngày xuất báo cáo: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên Xe</th>
                <th>Loại Xe</th>
                <th>Giá Xe</th>
                <th>Màu Sắc</th>
                <th>Động Cơ</th>
                <th>Trạng Thái</th>
                <th>Năm SX</th>
              </tr>
            </thead>
            <tbody>
              ${xeList
                .map(
                  (xe, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${xe.TenXe || 'N/A'}</td>
                    <td>${xe.loaiXe?.TenLoai || 'N/A'}</td>
                    <td>${xe.GiaXe ? new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(Number(xe.GiaXe)) : 'N/A'}</td>
                    <td>${xe.MauSac || 'N/A'}</td>
                    <td>${xe.DongCo || 'N/A'}</td>
                    <td>${xe.TrangThai || 'N/A'}</td>
                    <td>${xe.NamSanXuat || 'N/A'}</td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Khởi tạo Puppeteer & xuất PDF - sử dụng cấu hình tương tự như export endpoint
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    // Sử dụng NextResponse giống như trong export endpoint
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="car-report.pdf"',
        'Content-Length': pdfBuffer.length.toString()
      }
    });
  } catch (error: any) {
    console.error('❌ Lỗi tạo PDF:', error);
    return NextResponse.json({ message: 'Lỗi tạo PDF' }, { status: 500 });
  }
}