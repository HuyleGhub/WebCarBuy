import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import puppeteer from 'puppeteer';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'excel';
    const search = searchParams.get('search') || '';

    const cars = await prisma.xe.findMany({
      where: {
        OR: [
          { TenXe: { contains: search } },
          { MauSac: { contains: search } },
          { DongCo: { contains: search } }
        ]
      },
      include: {
        loaiXe: true
      }
    });

    const exportData = cars.map(car => ({
      'ID': car.idXe,
      'Tên Xe': car.TenXe,
      'Loại Xe': car.loaiXe?.TenLoai || 'N/A',
      'Giá Xe': new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(Number(car.GiaXe)),
      'Màu Sắc': car.MauSac,
      'Động Cơ': car.DongCo,
      'Trạng Thái': car.TrangThai,
      'Hình Ảnh': car.HinhAnh,
      'Năm Sản Xuất': car.NamSanXuat
    }));

    if (format === 'pdf') {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

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
            <h1>Danh sách xe ô tô</h1>
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
                ${exportData
                  .map(
                    (car, index) => `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${car["Tên Xe"]}</td>
                      <td>${car["Loại Xe"]}</td>
                      <td>${car["Giá Xe"]}</td>
                      <td>${car["Màu Sắc"]}</td>
                      <td>${car["Động Cơ"]}</td>
                      <td>${car["Trạng Thái"]}</td>
                      <td>${car["Năm Sản Xuất"]}</td>
                    </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({ format: 'A4' });

      await browser.close();

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="cars.pdf"'
        }
      });
    }

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Cars');

      const headers = Object.keys(exportData[0]);
      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      exportData.forEach(car => {
        worksheet.addRow(Object.values(car));
      });

      worksheet.columns.forEach(column => {
        column.width = 20;
        column.alignment = { vertical: 'middle', horizontal: 'left' };
      });

      const buffer = await workbook.xlsx.writeBuffer();
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="cars.xlsx"'
        }
      });
    }

    if (format === 'doc') {
      const rows = [
        new TableRow({
          children: Object.keys(exportData[0]).map(header => 
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: header, bold: true })]
              })]
            })
          )
        }),
        ...exportData.map(car => 
          new TableRow({
            children: Object.values(car).map(value => 
              new TableCell({
                children: [new Paragraph({
                  children: [new TextRun({ text: String(value) })]
                })]
              })
            )
          })
        )
      ];

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Danh sách xe",
                  bold: true,
                  size: 32
                })
              ],
              spacing: {
                after: 200
              }
            }),
            new Table({
              rows: rows
            })
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': 'attachment; filename="cars.docx"'
        }
      });
    }

    return NextResponse.json(
      { error: 'Unsupported format' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
