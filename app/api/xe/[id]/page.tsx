import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Xe } from '@/types/xe';

export default function ChiTietXe({ params }: { params: { id: string } }) {
  const [xe, setXe] = useState<Xe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchXe = async () => {
      try {
        const response = await fetch(`/api/xe/${params.id}`);
        if (!response.ok) throw new Error('Lỗi khi lấy thông tin xe');
        const data = await response.json();
        setXe(data);
      } catch (error) {
        console.error('Lỗi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchXe();
  }, [params.id]);

  if (loading) return <div>Đang tải...</div>;
  if (!xe) return <div>Không tìm thấy thông tin xe</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4 mb-8">
          {xe.HinhAnh && (
            <Image
              src={xe.HinhAnh}
              alt={xe.TenXe || 'Hình ảnh xe'}
              width={500}
              height={300}
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
        <div className="w-full md:w-1/2 px-4">
          <h1 className="text-3xl font-bold mb-4">{xe.TenXe}</h1>
          {xe.loaiXe && (
            <div className="mb-4">
              <p className="text-xl">Loại xe: {xe.loaiXe.TenLoai}</p>
              <p className="text-xl">Nhãn hiệu: {xe.loaiXe.NhanHieu}</p>
            </div>
          )}
          <p className="text-2xl text-blue-600 font-bold mb-4">
            Giá xe: {xe.GiaXe?.toLocaleString('vi-VN')} VNĐ
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">Màu sắc:</h3>
              <p>{xe.MauSac}</p>
            </div>
            <div>
              <h3 className="font-semibold">Động cơ:</h3>
              <p>{xe.DongCo}</p>
            </div>
            <div>
              <h3 className="font-semibold">Trạng thái:</h3>
              <p>{xe.TrangThai}</p>
            </div>
            <div>
              <h3 className="font-semibold">Năm sản xuất:</h3>
              <p>{xe.NamSanXuat}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="btn bg-blue-600 text-white">Đặt Cọc</button>
            <button className="btn btn-outline">Xem Chi Tiết</button>
          </div>
        </div>
      </div>
    </div>
  );
}