import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

    export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
        try {
          const xe = await prisma.xe.findUnique({
            where: {
              idXe: parseInt(params.id),
            },
            include: {
              loaiXe: true,
            },
          }); 
      
          if (!xe) {
            return NextResponse.json({ error: 'Không tìm thấy xe' },{ status: 404 });
          }
          return NextResponse.json(xe);
        } catch (error) {
          return NextResponse.json({ error: 'Lỗi khi lấy thông tin xe' },{ status: 500 });
        }
      }
    
    export async function DELETE(request: NextRequest, {params}:{params:{id:string}}) {
      try {
        const idxe = parseInt(params.id);
        const xe = await prisma.xe.delete({
          where: {
            idXe: idxe,
          },
        });
      
        return NextResponse.json({xe, message: 'Xe đã được xóa' }, {status:200});
      } catch (e:any) {
        return NextResponse.json({ error: 'Lổi khi xóa xe' },{ status: 500 });
      }
    }
    export async function PUT(request: NextRequest, {params}: {params: {id:string}}) {
        const body = await request.json();
        const idXe = parseInt(params.id);
        const xe = await prisma.xe.findFirst({
          where: {
            TenXe: body.TenXe,    
            NOT: {
              idXe: idXe, // Loại trừ xe hiện tại đang được cập nhật
          },
          },
        });
        try {
        if (xe) {
          return NextResponse.json({xe, message: "Tên xe đã tồn tại"},{status: 400});
        }else {
          const updateXe = await prisma.xe.update({
            where: {
              idXe: idXe,
            },
            data: {
              TenXe: body.TenXe,
              idLoaiXe: body.idLoaiXe,
              GiaXe: body.GiaXe,
              MauSac: body.MauSac,
              DongCo: body.DongCo,
              TrangThai: body.TrangThai,
              HinhAnh: body.HinhAnh,
              NamSanXuat: body.NamSanXuat
            },
          })
          return NextResponse.json({updateXe, message: `Cập nhật xe từ id ${params.id} thành công` }, {status:200});
        }
        } catch (e:any) {
          return NextResponse.json({ error: 'Lỗi khi cập nhật xe' },{ status: 500 });
        }
    
    }



