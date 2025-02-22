
import { resetPassword } from '@/app/lib/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();
        
        if (!token || !newPassword) {
            return NextResponse.json(
                { error: 'Token and new password are required' },
                { status: 400 }
            );
        }

        const result = await resetPassword(token, newPassword);
        return NextResponse.json(result);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}