"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

interface Car {
  idXe: number;
  TenXe: string;
  GiaXe: number;
  MauSac: string;
  DongCo: string;
  TrangThai: string;
  HinhAnh: string;
  NamSanXuat: string;
  loaiXe: {
    TenLoai: string;
    NhanHieu: string;
  };
}

const category = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); 
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/cars/${id}`)
        .then(res => res.json())
        .then(data => {
          setCar(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Lỗi khi lấy thông tin xe:', err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!car) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-2xl font-bold text-gray-800">Không tìm thấy thông tin xe</div>
    </div>
  );
  return (
    <div className='w-full h-full px-4 py-24' data-theme="light">
        <div className='px-24 w-full h-full flex '>
            <p>trang chi tiết</p>
            <div>
            <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-full w-full object-cover md:w-48" src={car.HinhAnh} alt={car.TenXe} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{car.loaiXe.NhanHieu}</div>
            <h1 className="block mt-1 text-3xl leading-tight font-bold text-black">{car.TenXe}</h1>
            <p className="mt-2 text-gray-500">{car.loaiXe.TenLoai}</p>
          </div>
        </div>
        <div className="px-8 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Thông số kỹ thuật</h2>
              <ul className="mt-2 space-y-2">
                <li className="flex items-center">
                  <span className="font-medium text-gray-600 mr-2">Động cơ:</span>
                  <span>{car.DongCo}</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium text-gray-600 mr-2">Màu sắc:</span>
                  <span>{car.MauSac}</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium text-gray-600 mr-2">Năm sản xuất:</span>
                  <span>{car.NamSanXuat}</span>
                </li>
                <li className="flex items-center">
                  <span className="font-medium text-gray-600 mr-2">Trạng thái:</span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    car.TrangThai === 'Còn hàng' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {car.TrangThai}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Giá bán</h2>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{car.GiaXe.toLocaleString()} VNĐ</p>
              <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
                Đặt hàng ngay
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <button
          onClick={() => router.push('/')}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" />
          </svg>
          <span>Quay lại trang chủ</span>
        </button>
      </div>
    </div>
            </div>
        </div>
    </div>
  )
}

export default category