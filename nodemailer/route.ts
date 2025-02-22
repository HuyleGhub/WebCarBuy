import prisma from '@/prisma/client';
import nodemailer from 'nodemailer';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET_KEY ;
const key = new TextEncoder().encode(secretKey);

const transporter = nodemailer.createTransport({
    service: 'gmail', // or configure your own SMTp
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD // Use app-specific password for Gmail
    }
  });

  export async function initiatePasswordReset(email: string) {
    try {
        // Check if user exists
        const user = await prisma.users.findUnique({
            where: { Email: email }
        });
  
        if (!user) {
            throw new Error('User not found');
        }
  
        // Create a password reset token
        const resetToken = await new SignJWT({
            userId: user.idUsers,
            email: user.Email,
            purpose: 'password-reset'
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(key);
  
        // Store the reset token in the database
        await prisma.users.update({
            where: { idUsers: user.idUsers },
            data: {
                resetToken: resetToken,
                resetTokenExpiry: new Date(Date.now() + 3600000)
            }
        });
  
        // Create reset password URL
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/Resetpassword?token=${resetToken}`;
  
        // Email template
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Yêu cầu đặt lại mật khẩu</h2>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để tiếp tục:</p>
                    <div style="margin: 20px 0;">
                        <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                            Đặt lại mật khẩu
                        </a>
                    </div>
                    <p>Link này sẽ hết hạn sau 1 giờ.</p>
                    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">
                        Email này được gửi tự động, vui lòng không trả lời.
                    </p>
                </div>
            `
        };
  
        // Send email
        await transporter.sendMail(mailOptions);
  
        return { message: 'Password reset email sent successfully' };
  
    } catch (error) {
        console.error('Password reset initiation error:', error);
        throw new Error('Failed to initiate password reset');
    }
  }