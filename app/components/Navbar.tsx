"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchModal from "./Searchmodel";
import { useRouter } from "next/navigation";
import { UserAuth } from "../types/auth";
import { useDrop } from 'react-dnd';
import toast from "react-hot-toast";

interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
  NhanHieu: string;
  HinhAnh: string;
}

interface CartItem {
  idGioHang: number;
  idXe: number;
  SoLuong: number;
  xe: {
    TenXe: string;
    GiaXe: number;
    MauSac: string;
    HinhAnh: string;
    TrangThai: string;
  };
}

interface Car {
  idXe: number;
  TenXe: string;
  GiaXe: number;
  MauSac: string;
  DongCo: string;
  TrangThai: string;
  HinhAnh: string;
  NamSanXuat: string;
  idLoaiXe: number;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loaiXe, setLoaiXe] = useState<LoaiXe[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserAuth | null>(null);
  const router = useRouter();

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: 'CAR_ITEM',
    drop: async (item: Car) => {
      try {
        const response = await fetch('/api/giohang', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idXe: item.idXe,
            SoLuong: 1,
          }),
        });

        if (!response.ok) throw new Error('Failed to add to cart');
        
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success('Thêm vào giỏ hàng thành công!');
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Không thể thêm vào giỏ hàng');
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/giohang");
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const data = await response.json();
        setCartItems(data || []);
      } catch (error) {
        console.error("Failed to fetch cart items", error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleCartUpdate = async () => {
      try {
        const response = await fetch("/api/giohang");
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const data = await response.json();
        setCartItems(data || []); 
      } catch (error) {
        console.error("Failed to fetch cart items", error);
        setCartItems([]); 
      }
    };

    if (user) {
      fetchCartItems();
    }

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("api/auth/session");
        if (!response.ok) throw new Error("Failed to fetch session");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch session", error);
        setUser(null);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchLoaiXe = async () => {
      try {
        const response = await fetch("api/loaixe");
        if (!response.ok) throw new Error("Failed to fetch loai xe");
        const data = await response.json();
        setLoaiXe(data || []);
      } catch (error) {
        console.error("Failed to fetch loai xe", error);
        setLoaiXe([]);
      }
    };
    fetchLoaiXe();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setCartItems([]);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const cartItemCount = cartItems?.length || 0;
  

  return (
    <div data-theme="light">
      <div className="navbar opacity-90 bg-base-100 shadow-sm fixed z-50">
        <div className="flex-1 px-4 py-2">
          <Link href="/">
            <Image
              className="ml-2 h-8 hover:scale-105 md:ml-6 md:text-2xl sm:text-2xl"
              alt="VinFast - Thương hiệu xe điện đầu tiên Việt Nam"
              width={100}
              height={100}
              src="https://vinfastauto.com/themes/porto/img/new-home-page/VinFast-logo.svg"
            />
          </Link>

          <div className="justify-start ml-36 xl:flex hidden items-start w-full gap-7">
            <Link href="/">
              <button className="font-semibold font-serif py-2 transition-all duration-500 text-blue-500 hover:text-red-500">
                Trang Chủ
              </button>
            </Link>
            <ul
              onMouseEnter={() => setIsMenuOpen(true)}
              className="bg-white py-2 font-semibold font-serif transition-all duration-500 text-blue-500 hover:text-red-500 cursor-pointer"
            >
              <li>
                <span>Sản Phẩm</span>
              </li>
            </ul>

            <div
              onMouseLeave={() => setIsMenuOpen(false)}
              className={`absolute z-99 top-16 border-t-2 border-blue-200 left-0 w-full bg-white flex flex-col justify-center items-center gap-10 text-lg border-b-4 shadow-2xl transform transition-all duration-75 ease-in-out ${
                isMenuOpen
                  ? "opacity-100 transform translate-y-0 transition-all duration-1000"
                  : "opacity-0 transform -translate-y-10 pointer-events-none transition-all duration-1000"
              }`}
            >
              <div className="flex flex-col h-5">
                <span className="text-xl font-serif font-bold mt-5 text-blue-600">
                  Danh Sách Loại Xe
                </span>
              </div>
              <div className="flex flex-grow">
                <ul className="flex gap-20 justify-center z-[1] w-full p-2 h-40">
                  {loaiXe.map((loai) => (
                    <li key={loai.idLoaiXe} className="mt-10">
                      <Link href={`LoaiXe?id=${loai.idLoaiXe}`}>
                        <img
                          src={loai.HinhAnh}
                          className="hover:animate-fadeleft transition-all duration-75 hover:scale-150"
                          alt={loai.TenLoai}
                        />
                        <div className="text-center mt-3 font-medium">
                          {loai.TenLoai}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className="font-semibold font-serif py-2 transition-all duration-500 text-blue-500 hover:text-red-500 bg-white">
              Giới Thiệu
            </button>
            <button className="font-semibold font-serif py-2 transition-all duration-500 text-blue-500 hover:text-red-500 bg-white">
              Liên Hệ
            </button>
          </div>
        </div>

        <div className="justify-center w-10 md:w-60 items-center mr-4 relative">
          <div className="mb-2">
            <SearchModal />
          </div>
        </div>

        <div className="flex-none">
          {!user ? (
            <div className="flex gap-2 h-14">
              <Link
                href="/Login"
                className="btn transition-all border-2 border-b-blue-950 duration-500 bg-white hover:text-red-500 px-1 w-14 h-6 sm:w-20 sm:h-10"
              >
                Login
              </Link>
              <Link
                href="/Register"
                className="btn transition-all border-2 border-b-blue-950 text-white duration-500 hover:text-red-500 bg-blue-600 px-2 w-15 h-6 sm:w-20 sm:h-10"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex relative">
              <div className="dropdown dropdown-end">
                <div
                  ref={dropRef as any}
                  tabIndex={0}
                  role="button"
                  className={`btn btn-ghost btn-circle ${isOver ? 'bg-blue-100' : ''}`}
                >
                  <Link href={"/Cart"}>
                    <div className="indicator">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="badge badge-sm indicator-item">
                        {cartItemCount}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="dropdown dropdown-end hidden xl:block">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar flex items-center justify-center"
                >
                  <div
                    className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold leading-none"
                    style={{ lineHeight: "2.5rem" }}
                  >
                    {user?.Hoten?.[0]?.toUpperCase() ||
                      user?.Tentaikhoan?.[0]?.toUpperCase() ||
                      "U"}
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <a href="/Profiles" className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a href="/Depositform">Depositform</a>
                  </li>
                  <li>
                    <a href="/Orders">Orders</a>
                  </li>
                  <li>
                    <a href="/Lichhen">Lich Hen</a>
                  </li>
                  <li>
                    <a href="/Danhgia">Revivew Car</a>
                  </li>
                  <li>
                    <a href="/Changepassword">Change Password</a>
                  </li>
                  {user.role?.TenNguoiDung === "Admin" && (
                    <li>
                      <a href="/dashboard">Dashboard</a>
                    </li>
                  )}
                  <li>
                    <a onClick={handleLogout}>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="xl:hidden">
          <button
            className="btn btn-ghost rounded-lg p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 relative">
              <span
                className={`block absolute h-0.5 w-6 bg-blue-600 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "rotate-45 top-3" : "top-1"
                }`}
              ></span>
              <span
                className={`block absolute h-0.5 w-6 bg-blue-600 top-3 transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block absolute h-0.5 w-6 bg-blue-600 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "-rotate-45 top-3" : "top-5"
                }`}
              ></span>
            </div>
          </button>
        </div>

        <div
          className={`fixed xl:hidden top-[4rem] left-0 w-full overflow-y-auto bg-white transform transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "translate-x-0 opacity-100 shadow-lg"
              : "translate-x-full opacity-0"
          }`}
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div className="flex flex-col h-full">
            <div className="border-t border-gray-200 ml-3 p-4">
              {user ? (
                <div className="flex items-center space-x-3 p-3 w-80 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {user?.Hoten?.[0]?.toUpperCase() ||
                      user?.Tentaikhoan?.[0]?.toUpperCase() ||
                      "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {user?.Hoten || user?.Tentaikhoan}
                    </p>
                    <p className="text-sm text-gray-500">{user?.Email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/Login"
                    className="btn btn-outline btn-primary w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/Register"
                    className="btn btn-primary w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
            <div className="flex flex-col p-4 space-y-4">
              <Link
                href="/"
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="font-semibold text-gray-700">Trang Chủ</span>
              </Link>

              <div className="collapse collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title flex text-base font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10 M7 7h10"
                    />
                  </svg>
                  <span className="font-semibold ml-3 text-gray-700">
                    Sản Phẩm
                  </span>
                </div>
                <div className="collapse-content">
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    {loaiXe.map((loai) => (
                      <Link
                        key={loai.idLoaiXe}
                        href={`LoaiXe?id=${loai.idLoaiXe}`}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Image
                          src={loai.HinhAnh}
                          alt={loai.TenLoai}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                        <span className="font-medium text-gray-700">
                          {loai.TenLoai}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/about"
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold text-gray-700">Giới Thiệu</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center space-x-3 p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-semibold text-gray-700">Liên Hệ</span>
              </Link>
            </div>

            {user && (
              <div className="">
                <ul className="menu menu-lg gap-2 mt-4 h-96 pt-4 font-semibold text-gray-700 text-base border-t">
                  <li>
                    <Link href="/Profiles" className="text-base" onClick={() => setIsMenuOpen(false)}>
                      Profile
                      <span className="badge badge-primary badge-sm">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/Depositform" className="text-base" onClick={() => setIsMenuOpen(false)}>
                      Depositform
                    </Link>
                  </li>
                  <li>
                    <Link href="/Orders" className="text-base" onClick={() => setIsMenuOpen(false)}>
                      Orders
                    </Link>
                  </li>
                  {user.role?.TenNguoiDung === "Admin" && (
                    <li>
                      <Link href="/dashboard" className="text-base" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <a className="text-base" onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}>
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}