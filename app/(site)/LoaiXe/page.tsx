"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Footer from "@/app/components/Footer";

interface Xe {
  idXe: number;
  TenXe: string;
  idLoaiXe: number;
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
const LoaiXe = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const searchParams = useSearchParams();
  const idLoaiXe = searchParams.get("id");
  const [cars, setCars] = useState<Xe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (idLoaiXe) {
      fetch(`api/loaixe/${idLoaiXe}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          setCars(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [idLoaiXe]);

  if (loading)
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col " data-theme="light">
      <div className="xl:mx-28 md:mx-10 mt-24 ">
        <div className="pb-4">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" />
            </svg>
            <span>Quay lại trang chủ</span>
          </button>
        </div>
        <span
          className="font-bold xl:text-3xl md:text-4xl text-3xl w-full text-black animate-appeartop 
        [animation-timeline:view()]  animation-range-entry"
        >
          Danh sách xe {cars[0]?.loaiXe.TenLoai}
        </span>
        <br />
        <div className="border-b-4 border-blue-500 pt-5 "> </div>
        {cars.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không có thông tin loại xe này
          </div>
        ) : (
          <ul className="flex w-full py-12 min-[1530px]:gap-28 xl:gap-2 xl:h-full h-full flex-wrap animate-appear [animation-timeline:view()] animation-range-entry list-none">
            {cars.map((car) => (
              <li key={car.idXe}>
                <div
                  className={`card bg-base-100 xl:w-72 xl:h-72 w-full md:w-72 md:h-72 ml-6 mb-5 shadow-xl relative ${
                    isHovered ? "" : ""
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <div
                    className={`absolute  w-[303px] h-[303px] z-[-1] -top-2 -left-2 rounded-2xl ${
                      isHovered ? "" : ""
                    }`}
                  ></div>
                  <div className="w-[303px] h-[303px]">
                    <figure className="px-10">
                      <Image
                        src={
                          car.HinhAnh.split("|")[0] // Nếu là chuỗi thì split và lấy phần tử đầu
                        }
                        alt={car.TenXe}
                        width={100}
                        height={100}
                        className="rounded-xl w-64 h-32"
                      />
                    </figure>
                    <div className="card-body items-center text-center">
                      <h2 className="card-title">{car.TenXe}</h2>
                      <p>
                        Giá xe:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(car.GiaXe)}
                      </p>
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
        )}
      </div>

      <Footer></Footer>
    </div>
  );
};

export default LoaiXe;
