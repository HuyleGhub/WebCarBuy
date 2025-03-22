import { getSession } from '@/app/lib/auth';
import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { read } = body;

    const notification = await prisma.notification.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        read,
      },
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Error updating notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notificationId = parseInt(params.id, 10);
    
    // Verify the notification belongs to the current user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });
    
    if (!notification || notification.userId !== session.idUsers) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the notification
    await prisma.notification.delete({
      where: { id: notificationId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}