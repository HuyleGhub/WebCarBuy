"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchModal from "./Searchmodel";
import { useRouter } from "next/navigation";
import { UserAuth } from "../types/auth";

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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loaiXe, setLoaiXe] = useState<LoaiXe[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserAuth | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/giohang");
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const data = await response.json();
        setCartItems(data || []); // Ensure we always have an array
      } catch (error) {
        console.error("Failed to fetch cart items", error);
        setCartItems([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    // Add event listener for cart updates
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

    // Add event listener
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Remove event listener on cleanup
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
        setLoaiXe(data || []); // Ensure we always have an array
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
      setCartItems([]); // Clear cart items on logout
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Calculate cart totals
  const cartItemCount = cartItems?.length || 0;

  return (
    <div data-theme="light">
      <div className="navbar bg-base-100 shadow-2xl fixed z-50">
        {/* Left section with logo and navigation */}
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

          {/* Navigation menu */}
          <div className="justify-start ml-36 xl:flex hidden items-start w-full gap-7">
            <Link href="/">
              <button className="font-semibold font-serif py-2 transition-all duration-500 text-blue-500 hover:text-red-500 ">
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

            {/* Product dropdown */}
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

        {/* Search section */}
        <div className="justify-center md:block hidden items-center mr-4 relative">
          <div className="mb-2">
            <SearchModal />
          </div>
        </div>

        {/* Right section with cart and user profile */}
        <div className="flex-none">
          {!user ? (
            <div className="flex gap-5 h-14">
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
              {/* Cart dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle"
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

              {/* User profile dropdown */}
              <div className="dropdown dropdown-end">
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

        {/* Mobile menu button */}
        <label className="btn btn-circle mb-2 swap swap-rotate xl:hidden">
          <input type="checkbox" onClick={() => setIsMenuOpen(!isMenuOpen)} />
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>
          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>

        {/* Mobile menu */}
        <div
          className={`absolute xl:hidden top-20 left-0 w-full bg-white flex flex-col items-center gap-10 text-lg rounded-xl transform transition-all duration-75 ${
            isMenuOpen ? "animate-fadetop" : "hidden"
          }`}
        >
          <Link href="/">
            <button className="font-semibold font-serif transition-all duration-500 hover:text-red-500 bg-slate-50">
              Trang Chủ
            </button>
          </Link>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="font-semibold font-serif hover:text-red-500 bg-white"
            >
              Sản Phẩm
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              {loaiXe.map((loai) => (
                <li key={loai.idLoaiXe}>
                  <Link href={`LoaiXe?id=${loai.idLoaiXe}`}>
                    {loai.TenLoai}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <button className="font-semibold font-serif transition-all duration-500 hover:text-red-500 bg-white">
            Giới Thiệu
          </button>
          <button className="font-semibold font-serif transition-all duration-500 hover:text-red-500 bg-white">
            Liên Hệ
          </button>
        </div>
      </div>
    </div>
  );
}