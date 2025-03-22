// app/api/notifications/all/route.ts

import { getSession } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = typeof session.idUsers === 'string' ? parseInt(session.idUsers, 10) : session.idUsers;

    // Delete all notifications for the current user
    await prisma.notification.deleteMany({
      where: { userId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    return NextResponse.json(
      { error: 'Failed to delete all notifications' },
      { status: 500 }
    );
  }
}