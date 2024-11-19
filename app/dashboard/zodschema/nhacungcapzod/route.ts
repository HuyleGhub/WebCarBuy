import Email from "next-auth/providers/email";
import {z} from "zod";
const nhaCungCapSchema = z.object({
    TenNhaCungCap: z.string().min(1, "Tên nhà cung cấp không được để trống"),
    Sdt: z.string().min(10, "Số điện thoại không hợp lệ").max(15, "Số điện thoại quá dài").regex(/^[0-9]{10,15}$/, "Số điện thoại chỉ chứa số từ 10-15 ký tự"),  // Kiểm tra độ dài Sdt
    Email: z.string().email("Email không hợp lệ"),
  })
export default nhaCungCapSchema;