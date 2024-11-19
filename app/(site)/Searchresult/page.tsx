"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/app/components/Footer';
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
    <div className=" mx-20 px-4 py-24" data-theme="light">
      <h1 className="text-2xl font-bold ">Kết quả tìm kiếm</h1>
      
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Không tìm thấy kết quả phù hợp</p>
          <Link href="/" className="btn btn-primary">
            Quay về trang chủ
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap">
        <div className="border-b-4 border-blue-500 pt-5 w-full "> </div>
        <ul className="flex w-full py-12 min-[1530px]:gap-28 xl:gap-2 xl:h-full h-full flex-wrap list-none">
          {results.map((car) => (
            <li key={car.idXe}>
              <div
                className="card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 ml-6 mb-5 shadow-xl relative"
              >
                <div
                  className="absolute  w-[303px] h-[303px] z-[-1] -top-2 -left-2 rounded-2xl"
                ></div>
                <div className="w-[303px] h-[303px]">
                  <figure className="px-10">
                    <Image
                      src={car.HinhAnh}
                      alt={car.TenXe}
                      width={100}
                      height={100}
                      className="rounded-xl w-64 h-32"
                    />
                  </figure>
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">{car.TenXe}</h2>
                    <p className='text-purple-600 font-semibold'><span className='text-black font-medium'>Giá Xe: </span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(car.GiaXe)}</p>
                    <div className="card-actions">
                      <button className="btn bg-[#1464F4] text-white">
                        Đặt Cọc
                      </button>
                      <Link href={`/Carcategory?id=${car.idXe}`} passHref>
                        <button className="btn btn-outline">
                          Xem Chi Tiết
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        </div>
      )}
    </div>
    <Footer></Footer>
    </div>
  );
};

export default SearchResults;