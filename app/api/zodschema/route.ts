import {z} from "zod";

const xeSchema = z.object({
    TenXe: z.string().optional().nullable(),
  idLoaiXe: z.number().int().positive({
    message: "Loại xe không được để trống"
  }),
  GiaXe: z.number().positive({
    message: "Giá xe phải là số dương"
  }).optional().nullable(),
  MauSac: z.string().max(50, {
    message: "Màu sắc không được vượt quá 50 ký tự"
  }).optional().nullable(),
  DongCo: z.string().max(225, {
    message: "Thông tin động cơ không được vượt quá 225 ký tự"
  }).optional().nullable(),
  TrangThai: z.string().max(50, {
    message: "Trạng thái không được vượt quá 50 ký tự"
  }).optional().nullable(),
  HinhAnh: z.string().max(225, {
    message: "Đường dẫn hình ảnh không được vượt quá 225 ký tự"
  }).optional().nullable(),
  NamSanXuat: z.string().max(45, {
    message: "Năm sản xuất không được vượt quá 45 ký tự"
  }).optional().nullable()
  })

export default xeSchema;