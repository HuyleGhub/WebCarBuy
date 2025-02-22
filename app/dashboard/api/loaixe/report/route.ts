import prisma from '@/prisma/client';
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
 // Đảm bảo bạn đã có prisma instance

export async function GET() {
  try {
    // Lấy danh sách xe từ DB
    const loaiXeList = await prisma.loaiXe.findMany({
      include: {  _count: {
        select: {
          Xe: true,
          LichHen: true
        }
      }}, // Lấy thông tin xe
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
          <h1>Báo cáo danh sách loại xe ô tô</h1>
          <p>Ngày xuất báo cáo: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên Loại</th>
                <th>Nhãn Hiệu</th>
                <th>Số Lượng Xe</th>
                <th>Số Lịch Hẹn</th>
              </tr>
            </thead>
            <tbody>
              ${loaiXeList
                .map(
                  (loaiXe, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${loaiXe.TenLoai || 'N/A'}</td>
                    <td>${loaiXe.NhanHieu || 'N/A'}</td>
                    <td>${loaiXe._count.Xe || 'N/A'}</td>
                    <td>${loaiXe._count.LichHen || 'N/A'}</td>
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
        'Content-Disposition': 'attachment; filename=LoaiXe-report.pdf',
      },
    });
  } catch (error) {
    console.error('❌ Lỗi tạo PDF:', error);
    return NextResponse.json({ message: 'Lỗi tạo PDF' }, { status: 500 });
  }
}
