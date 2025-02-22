
import prisma from '@/prisma/client';
import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { Resend } from 'resend'


const secretKey = process.env.JWT_SECRET_KEY ;
const key = new TextEncoder().encode(secretKey);
// const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = 'nodejs';
export async function signUp(
  email: string,
  username: string,
  password: string,
  fullname?: string,
  phone?: string,
  address?: string  
) {
  try {
      // Check if user already exists
      const existingUser = await prisma.users.findFirst({
          where: {
              OR: [
                  { Email: email },
                  { Tentaikhoan: username }
              ]
          }
      });

      if (existingUser) {
          throw new Error('Email or username already exists');
      }

      // Validate fullname
      if (!fullname || fullname.trim() === '') {
          throw new Error('Full name is required');
      }

      // Validate address length
      if (address && address.length > 255) {
          throw new Error('Address is too long');
      }

      // Hash password
      const hashedPassword = await hash(password, 12);

      // First, ensure the default role exists
      const defaultRole = await prisma.role.upsert({
          where: { idRole: 1 },
          update: {},
          create: {
              idRole: 1,
              TenNguoiDung: 'KhachHang',
          },
      });

      // Create the user with the confirmed default role
      const user = await prisma.users.create({
          data: {
              Email: email,
              Tentaikhoan: username,
              Matkhau: hashedPassword,
              Hoten: fullname ? fullname.trim():"", // Ensure fullname is trimmed
              Sdt: phone || '',
              Diachi: address || '',
              idRole: defaultRole.idRole,
              Ngaydangky: new Date(),
          },
          select: {
              idUsers: true,
              Email: true,
              Tentaikhoan: true,
              Hoten: true,
              Sdt: true,
              Diachi: true,
              idRole: true,
              role: {
                  select: {
                      TenNguoiDung: true
                  }
              }
          }
      });

      // Log the created user for debugging
      console.log('Created user:', user);

      return user

  } catch (error: any) {
      console.error('Signup error:', error);
      
      if (error.code === 'P2000') {
          throw new Error('One or more fields exceed maximum length');
      }
      
      if (error.code === 'P2002') {
          if (error.meta?.target?.includes('Email')) {
              throw new Error('Email already in use');
          }
          if (error.meta?.target?.includes('Tentaikhoan')) {
              throw new Error('Username already in use');
          }
          throw new Error('Registration failed: Duplicate value');
      }
      
      if (error.code === 'P2003') {
          throw new Error('Invalid role assignment');
      }
      
      throw error; // Throw the original error for better debugging
  }
}
  

export async function login(
  usernameOrEmail: string,
  password: string
) {
  try {
    // Find user by username or email
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { Email: usernameOrEmail },
          { Tentaikhoan: usernameOrEmail }
        ]
      },
      include: {
        role: {
          select: {
            TenNguoiDung: true
          }
        }
      }
    });

    if (!user || !user.Matkhau) {
      throw new Error('User not found');
    }

    // Verify password
    const isValid = await compare(password, user.Matkhau);
    if (!isValid) {
      throw new Error('Sai mật khẩu');
    }

    // Create session token
    const token = await new SignJWT({
      idUsers: user.idUsers,
      email: user.Email,
      role: user.role?.TenNguoiDung,
      name: user.Hoten
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(key);

    // Set cookie
    cookies().set('session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });

    return {
      idUsers: user.idUsers,
      email: user.Email,
      username: user.Tentaikhoan,
      fullName: user.Hoten,
      role: user.role?.TenNguoiDung
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Authentication failed');
  }
}
export async function logout() {
    cookies().delete('session-token');
  }

export async function getSession() {
  try {
    const token = cookies().get('session-token')?.value;
    if (!token) return null;

    const verified = await jwtVerify(token, key);
    return verified.payload as any;
  } catch (error) {
    return null;
  }
}
//quen mat khau
// export async function initiatePasswordReset(email: string) {
//   try {
//       // Check if user exists
//       const user = await prisma.users.findUnique({
//           where: { Email: email }
//       });

//       if (!user) {
//           throw new Error('User not found');
//       }

//       // Create a password reset token
//       const resetToken = await new SignJWT({
//           userId: user.idUsers,
//           email: user.Email,
//           purpose: 'password-reset'
//       })
//           .setProtectedHeader({ alg: 'HS256' })
//           .setExpirationTime('1h') // Token expires in 1 hour
//           .sign(key);

//       // Store the reset token in the database
//       await prisma.users.update({
//           where: { idUsers: user.idUsers },
//           data: {
//               resetToken: resetToken,
//               resetTokenExpiry: new Date(Date.now() + 3600000) // 1 hour from now
//           }
//       });

//       // Create reset password URL
//       const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/Resetpassword?token=${resetToken}`;

//       // Send email using Resend with verified email
//       await resend.emails.send({
//           from: 'onboarding@resend.dev', // Sử dụng email mặc định đã được xác thực
//           to: 'lehuytran89@gmail.com', // S
//           subject: 'Yêu cầu đặt lại mật khẩu',
//           html: `
//               <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                   <h2>Yêu cầu đặt lại mật khẩu</h2>
//                   <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để tiếp tục:</p>
//                   <div style="margin: 20px 0;">
//                       <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
//                           Đặt lại mật khẩu
//                       </a>
//                   </div>
//                   <p>Link này sẽ hết hạn sau 1 giờ.</p>
//                   <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
//                   <p style="color: #666; font-size: 12px; margin-top: 20px;">
//                       Email này được gửi tự động, vui lòng không trả lời.
//                   </p>
//               </div>
//           `
//       });

//       return { message: 'Password reset email sent successfully' };

//   } catch (error) {
//       console.error('Password reset initiation error:', error);
//       throw new Error('Failed to initiate password reset');
//   }
// }



export async function resetPassword(token: string, newPassword: string) {
  try {
      // Find user with valid reset token
      const user = await prisma.users.findFirst({
          where: {
              resetToken: token,
              resetTokenExpiry: {
                  gt: new Date() // Token hasn't expired
              }
          }
      });

      if (!user) {
          throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await hash(newPassword, 12);

      // Update user's password and clear reset token
      await prisma.users.update({
          where: { idUsers: user.idUsers },
          data: {
              Matkhau: hashedPassword,
              resetToken: null,
              resetTokenExpiry: null
          }
      });

      return { message: 'Password reset successful' };

  } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Failed to reset password');
  }
}