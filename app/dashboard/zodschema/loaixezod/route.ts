import {z} from "zod";
const loaiXeSchema = z.object({
    TenLoai: z.string().max(50, {
      message: "Tên loại xe không được vượt quá 50 ký tự"
    }).nonempty({
      message: "Tên loại xe không được để trống"
    }).optional().nullable(),
    NhanHieu: z.string().max(225, {
      message: "Nhãn hiệu xe không được vượt quá 225 ký tự"
    }).nonempty({
      message: "Nhãn hiệu xe không được để trống"
    }).optional().nullable(),
    
  })
export default loaiXeSchema;