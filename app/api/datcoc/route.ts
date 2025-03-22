import { getSession } from '@/app/lib/auth'
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { createNotification } from '@/lib/create-notification';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        const body = await req.json();

        // Create deposit record
        const result = await prisma.$transaction(async (prisma) => {
            // Get vehicle details
            const vehicle = await prisma.xe.findUnique({
                where: { idXe: parseInt(body.idXe) },
                select: { TenXe: true }
            });

            // Create deposit record
            const datCoc = await prisma.datCoc.create({
                data: {
                    idXe: parseInt(body.idXe),
                    idKhachHang: session.idUsers,
                    NgayDat: new Date(body.NgayDat),
                    SotienDat: parseInt(body.SotienDat),
                    TrangThaiDat: body.TrangThaiDat
                }
            });

            // Update car status to 'Đã Đặt Cọc'
            await prisma.xe.update({
                where: { idXe: parseInt(body.idXe) },
                data: { 
                    TrangThai: 'Đã Đặt Cọc'
                }
            });

            await prisma.gioHang.deleteMany({
                where: {
                    idXe: parseInt(body.idXe),
                    idKhachHang: session.idUsers
                }
            });

            // Create notification for the customer
            await createNotification({
                userId: session.idUsers,
                type: 'deposit',
                message: `Đặt cọc thành công cho xe ${vehicle?.TenXe}. Số tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(body.SotienDat))}`
            });

            // Create notifications for staff
            const staffMembers = await prisma.users.findMany({
                where: {
                    idRole: 3 // Assuming 2 is the role ID for staff
                }
            });

            await Promise.all(staffMembers.map(staff => 
                createNotification({
                    userId: staff.idUsers,
                    type: 'deposit',
                    message: `Có đặt cọc mới cho xe ${vehicle?.TenXe}`
                })
            ));
             
            return datCoc;
        });

        return NextResponse.json(result, {status: 201});
    } catch (error) {
        console.error('Deposit creation error:', error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Không thể tạo đơn đặt cọc' }, { status: 500 });
        }
    }
}

export async function GET() { 
    const session = await getSession();
    try {
    const datCoc = await prisma.datCoc.findMany({
        where: {
            idKhachHang: session.idUsers,
        },
        include: {
            khachHang: true,
            xe: {
                select: {
                    TenXe: true,
                    GiaXe: true,
                    HinhAnh: true,
                    MauSac: true,
                }
            },
            LichHenLayXe: {
                select:{
                    NgayLayXe: true,
                    DiaDiem: true,
                },
            }
        }
    })
    return NextResponse.json(datCoc);
    }catch (error: any) {
      return NextResponse.json({ error: error.message }, { status:500})
    }
}