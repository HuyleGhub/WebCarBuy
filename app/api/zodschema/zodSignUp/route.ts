import { z } from 'zod'

export const SignupFormSchema = z.object({
  username: z
  .string()
  .min(2, { message: 'Tên đăng nhập phải có ít nhất 2 ký tự' })
  .trim(),
email: z
  .string()
  .email({ message: 'Email không hợp lệ' })
  .trim(),
password: z
  .string()
  .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  .regex(/[A-Za-z]/, { message: 'Mật khẩu phải chứa ít nhất một chữ cái' })
  .regex(/[0-9]/, { message: 'Mật khẩu phải chứa ít nhất một số' })
  .regex(/[^A-Za-z0-9]/, { message: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt' }),
fullname: z
  .string()
  .min(2, { message: 'Họ tên phải có ít nhất 2 ký tự' })
  .trim(),
phone: z
  .string()
  .regex(/^\d{10}$/, { message: 'Số điện thoại không hợp lệ' })
  .optional(),
address: z
  .string()
  .min(5, { message: 'Địa chỉ phải có ít nhất 5 ký tự' })
  .optional()
})

export default SignupFormSchema