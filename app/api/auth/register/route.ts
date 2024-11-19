
import { signUp } from '@/app/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import SignupFormSchema from '../../zodschema/zodSignUp/route';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = SignupFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    const { email, username, password, fullname, phone, address,  } = result.data;


    const user = await signUp( email, username, password, fullname, phone, address );
    return NextResponse.json({user, message: "Đăng ký thành công"}, {status: 200});
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 400 }
    );
  }
}