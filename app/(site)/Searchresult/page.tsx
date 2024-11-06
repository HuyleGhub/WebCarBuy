"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
interface Xe {
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
const SearchResults = () => {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Xe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Get the search parameters string
        const queryString = searchParams.toString();
        
        // Make the API call
        const response = await fetch(`/api/timkiemxe${queryString ? '?' + queryString : ''}`);
        if (!response.ok) throw new Error('Failed to fetch results');
        const data = await response.json();
        setResults(data.data);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-theme="light">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" data-theme="light">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Link href="/" className="btn btn-primary">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div data-theme="light">
    <div className="container mx-auto px-4 py-24" data-theme="light">
      <h1 className="text-2xl font-bold mb-6">Kết quả tìm kiếm</h1>
      
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Không tìm thấy kết quả phù hợp</p>
          <Link href="/" className="btn btn-primary">
            Quay về trang chủ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((xe) => (
            <div key={xe.idXe} className="card bg-base-100 shadow-xl">
              <figure>
                <Image 
                  src={xe.HinhAnh} 
                  alt={xe.TenXe}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{xe.TenXe}</h2>
                <p className="text-primary font-semibold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(xe.GiaXe)}
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <p><span className="font-medium">Loại xe:</span> {xe.loaiXe.TenLoai}</p>
                  <p><span className="font-medium">Năm SX:</span> {xe.NamSanXuat}</p>
                  <p><span className="font-medium">Động cơ:</span> {xe.DongCo}</p>
                  <p><span className="font-medium">Màu sắc:</span> {xe.MauSac}</p>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link href={`Carcategory?id=${xe.idXe}`} className="btn btn-primary">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default SearchResults;