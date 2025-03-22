import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { compare, hash } from 'bcryptjs';
import { getSession } from '@/app/lib/auth';


export async function POST(req: Request) {
  try {
    // Get current user from session
    const session = await getSession();
    if (!session || !session.idUsers) {
      return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới' }, { status: 400 });
    }

    // Fetch user from database
    const user = await prisma.users.findUnique({
      where: { 
        idUsers: session.idUsers 
      }
    });

    if (!user || !user.Matkhau) {
      return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await compare(currentPassword, user.Matkhau);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 401 });
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update user password
    await prisma.users.update({
      where: { 
        idUsers: user.idUsers 
      },
      data: { 
        Matkhau: hashedPassword 
      }
    });

    return NextResponse.json({ message: 'Mật khẩu đã được thay đổi thành công' }, { status: 200 });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Không thể thay đổi mật khẩu' }, { status: 500 });
  }
}