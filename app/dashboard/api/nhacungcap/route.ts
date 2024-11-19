import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nhaCungCapSchema from "../../zodschema/nhacungcapzod/route";
import Email from "next-auth/providers/email";
import { parse } from "path";


export async function GET() {
    const data = await prisma.nhaCungCap.findMany()
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const checkXe = nhaCungCapSchema.safeParse({
            TenNhaCungCap: body.TenNhaCungCap,
            Sdt: body.Sdt, // Convert to number if it's coming as string
            Email: body.Email,     // Convert to number for Decimal
          });
      
          if (!checkXe.success) {
            return NextResponse.json({
                message: "Dữ liệu không hợp lệ",
                errors: checkXe.error.errors.map(error => ({
                    field: error.path.join('.'),
                    message: error.message,
                }))
            }, { status: 400 });
          }
        const data = await prisma.nhaCungCap.create(
            {
                data: {
                    TenNhaCungCap: body.TenNhaCungCap,
                    Sdt: body.Sdt,
                    Email: body.Email
                  },
            }
        )
        return NextResponse.json({data, message: "Thêm mới thành công"}, {status: 200});
    } catch (error: any) {
        console.error("Error creating nhacungcap:", error);
    
        return NextResponse.json({
          message: "Lỗi server: " + error.message
        }, { status: 500 });
    }
}