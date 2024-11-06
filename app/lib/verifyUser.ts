import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
// Điều chỉnh đường dẫn tới Prisma client của bạn nếu cần

/**
 * Hàm verifyUser dùng để xác thực người dùng dựa trên email và password.
 * @param email - Địa chỉ email của người dùng
 * @param password - Mật khẩu của người dùng
 * @returns Trả về đối tượng người dùng nếu xác thực thành công, ngược lại trả về null
 */
export async function verifyUser(email: string, password: string) {
  const user = await prisma.users.findUnique({
    where: { Email:email },
  });

  if (user && user.Matkhau && bcrypt.compareSync(password, user.Matkhau)) {
    return user;
  }
  return null;
}
