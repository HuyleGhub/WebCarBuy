"use client"
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/app/components/Footer';
import { useDrag } from 'react-dnd';

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

interface DraggableCarItemProps {
  car: Xe;
}

const DraggableCarItem = ({ car }: DraggableCarItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CAR_ITEM',
    item: car,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      drag(itemRef.current);
    }
  }, [drag]);

  return (
    <li 
      ref={itemRef} 
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-move"
    >
      <div
        className={`card bg-base-100 w-full sm:w-[90%] md:w-72 xl:w-72 h-auto md:h-80 xl:h-80 mx-auto md:ml-6 mb-5 shadow-sm relative ${
          isHovered ? "animate-borderrun" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`absolute bg-gradient-to-bl from-orange-600 to-orange-400 w-full sm:w-[303px] h-full sm:h-[335px] z-[-1] -top-2 -left-2 rounded-2xl ${
            isHovered ? "animate-spinrun" : "hidden"
          }`}
        ></div>
        <div className="w-full sm:w-[303px] h-auto sm:h-[303px] p-4 sm:p-0">
          <figure className="px-4 sm:px-10 w-full">
            <Image
              src={
                Array.isArray(car.HinhAnh)
                  ? car.HinhAnh[0]
                  : car.HinhAnh.split("|")[0]
              }
              alt={car.TenXe}
              width={100}
              height={100}
              className="rounded-xl w-full sm:w-64 h-auto sm:h-32 object-cover"
            />
          </figure>
          <div className="card-body items-center text-center p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between w-full gap-2">
              <h2 className="card-title text-lg sm:text-xl w-full">{car.TenXe}</h2>
              {car.loaiXe && (
                <p className="text-gray-600 text-sm sm:text-base">{car.loaiXe.TenLoai}</p>
              )}
            </div>
            
            <p className="flex justify-start w-full mt-2">
              <span className="text-purple-600 text-xl sm:text-2xl font-semibold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(car.GiaXe)}
              </span>
            </p>
            <div className="card-actions flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mt-2">
              <button className="btn bg-[#1464F4] w-full sm:w-24 text-white text-sm">
                <Link href={`Datcoc?id=${car.idXe}`}>Đặt Cọc</Link>
              </button>
              <Link
                href={`Carcategory?id=${car.idXe}`}
                className="btn btn-outline w-full sm:w-auto text-sm"
              >
                Xem Chi Tiết
              </Link>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const SearchResults = () => {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<Xe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayedCars, setDisplayedCars] = useState<Xe[]>([]);
  const carsPerPage = 4;

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
        setDisplayedCars(data.data.slice(0, carsPerPage));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" data-theme="light">
        <div className="loading loading-spinner text-blue-600 loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen" data-theme="light">
        <div className="text-2xl font-bold text-red-600">{error}</div>
        <Link href="/" className="btn btn-primary ml-4">
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  const loadMore = () => {
    const currentLength = displayedCars.length;
    const newCars = results.slice(currentLength, currentLength + carsPerPage);
    setDisplayedCars(prevCars => [...prevCars, ...newCars]);
  };

  const showLess = () => {
    setDisplayedCars(results.slice(0, carsPerPage));
  };

  return (
    <div data-theme="light">
      <div className="px-4 sm:px-10 md:px-16 lg:px-24 py-8 md:py-16 lg:py-24" data-theme="light">
        <h1 className="text-2xl font-bold mb-6">Kết quả tìm kiếm</h1>
        
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg mb-4">Không tìm thấy kết quả phù hợp</p>
            <Link href="/" className="btn btn-primary">
              Quay về trang chủ
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap">
            <div className="border-b-4 border-blue-500 pt-5 w-full mb-8"></div>
            
            <ul className="grid grid-cols-1 sm:flex sm:flex-wrap w-full mt-8 sm:mt-12 gap-4 sm:gap-4 xl:gap-1 min-[1920px]:gap-32 xl:animate-appear px-5  sm:px-2">
              {displayedCars.map((car) => (
                <DraggableCarItem key={car.idXe} car={car} />
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5 px-4 sm:px-0 mt-8 w-full">
              {displayedCars.length < results.length && (
                <button
                  onClick={loadMore}
                  className="btn bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
                >
                  Load more
                </button>
              )}
              {displayedCars.length > carsPerPage && (
                <button
                  onClick={showLess}
                  className="btn bg-blue-500 text-white hover:bg-blue-600 w-full sm:w-auto"
                >
                  Show less
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;