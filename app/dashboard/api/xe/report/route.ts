import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
 // Đảm bảo bạn đã có prisma instance

export async function GET() {
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
                    <td>${xe.GiaXe ? xe.GiaXe.toFixed(2) + ' VND' : 'N/A'}</td>
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

    // Khởi tạo Puppeteer & xuất PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=car-report.pdf',
      },
    });
  } catch (error) {
    console.error('❌ Lỗi tạo PDF:', error);
    return NextResponse.json({ message: 'Lỗi tạo PDF' }, { status: 500 });
  }
}
