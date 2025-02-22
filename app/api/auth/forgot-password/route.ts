

import { initiatePasswordReset } from '@/nodemailer/route';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const result = await initiatePasswordReset(email);
        return NextResponse.json(result);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}