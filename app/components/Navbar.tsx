"use client";
// import { userInfo } from "os";
import React from "react";
import { IoIosSearch } from "react-icons/io";
import { useEffect, useState } from "react";
// import {
//   ClerkProvider,
//   SignInButton,
//   SignIn,
//   SignedIn,
//   SignedOut,
//   UserButton,
//   useAuth,
// } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
  NhanHieu: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loaiXe, setLoaiXe] = useState<LoaiXe[]>([]);
  useEffect(()=>{
     fetch("api/loaixe")
     .then(response=>{
      if(!response.ok)
        throw new Error("Failed to fetch loai xe");
       return response.json();
     })
     .then(data=>{
       setLoaiXe(data);
     })
     .catch(error=>{
       console.error("Failed to fetch loai xe", error);
     })
  },[])
 
  return (
    <div data-theme="light">
      <div className="navbar bg-base-100 shadow-2xl fixed z-50">
        <div className="flex-1 px-4 py-2">
          <Link href="/">
            <Image
              className="ml-2 h-8 hover:scale-105 md:ml-6 md:text-2xl sm:text-2xl "
              alt="VinFast - Thương hiệu xe điện đầu tiên Việt Nam"
              width={100}
              height={100}
              src="https://vinfastauto.com/themes/porto/img/new-home-page/VinFast-logo.svg"
            />
          </Link>
          <div className="justify-start ml-36 xl:flex hidden items-start w-full gap-7">
            <Link href="/">
              <button className="font-semibold font-serif py-2 transition-all duration-500 text-blue-500 hover:text-red-500 bg-slate-50 ">
                Trang Chủ
              </button>
            </Link>
            <ul 
            onMouseEnter={() => setIsMenuOpen(true)}
              className="bg-white  py-2 font-semibold font-serif transition-all duration-500 text-blue-500 hover:text-red-500 cursor-pointer">
            <li >
              <span >Sản Phẩm</span>
            </li>
            </ul>
            <div
        onMouseLeave={() => setIsMenuOpen(false)}
        className={`absolute z-99 top-16 border-t-2 border-blue-200 left-0 w-full bg-white flex flex-col justify-center items-center gap-10 text-lg border-b-4 shadow-2xl  transform transition-all duration-75 ease-in-out ${
          isMenuOpen ? "opacity-100 transform translate-y-0 transition-all duration-1000" : "opacity-0 transform -translate-y-10 pointer-events-none transition-all duration-1000"
        }`}
      >
        <div className="flex flex-col h-5">
          <span className="text-xl font-serif font-bold mt-5 text-blue-600">Danh Sách Loại Xe</span>
        </div>
        <div className="flex flex-grow">
          <ul className="flex gap-20 justify-center z-[1] w-full p-2 h-40">
            {loaiXe.map((loai) => (
              <li key={loai.idLoaiXe} className="mt-10">
                <Link href={`/LoaiXe?id=${loai.idLoaiXe}`}>
                  <img
                    src="https://static-cms-prod.vinfastauto.com/vf3-thumb_1715586838.png"
                    className="hover:animate-fadeleft transition-all duration-75 hover:scale-150"
                    alt={loai.TenLoai}
                  />
                  <div className="text-center mt-3 font-medium">{loai.TenLoai}</div>
                </Link>
              </li>
            ))}
          
                {/* <li className="mt-10">
                  <a href="">
                    <img src="https://static-cms-prod.vinfastauto.com/VF5_1711360061.png"
                      className="hover:animate-fadeleft transition-all duration-75 hover:scale-150 " alt={""}   
                                   
                      />
                    <div className="text-center mt-3 font-medium">VF 5 Plus</div>
                  </a>
                </li>
                <li className="mt-10">
                  <a href="">
                    <img src="https://static-cms-prod.vinfastauto.com/VF6_1711360087.png"
                      className="hover:animate-fadeleft transition-all duration-75 hover:scale-150 " alt={""}  
                                      
                      />
                    <div className="text-center mt-3 font-medium">VF 6</div>
                  </a>
                </li>
                <li className="mt-10">
                  <a href="">
                    <img src="https://static-cms-prod.vinfastauto.com/VF7_1711360187.png"
                      className="hover:animate-fadeleft transition-all duration-75 hover:scale-150 " alt={""}  
                                       
                      />
                    <div className="text-center mt-3 font-medium">VF 7</div>
                  </a>
                </li>
                <li className="mt-10">
                  <a href="">
                    <img src="https://static-cms-prod.vinfastauto.com/VF8_0.png"
                      className="hover:animate-fadeleft transition-all duration-75 hover:scale-150 " alt={""}  
                                      
                      />
                    <div className="text-center mt-3 font-medium">VF 8</div>
                  </a>
                </li>
                <li className="mt-10">
                  <a href="">
                    <img src="https://static-cms-prod.vinfastauto.com/VF9_1711360238.png"
                      className="hover:animate-fadeleft transition-all duration-75 hover:scale-150 " alt={""} 
                                        
                      />
                    <div className="text-center mt-3 font-medium">VF 9</div>
                  </a>
                </li> */}
              </ul>
              </div>
            </div>
            <button className=" font-semibold font-serif py-2 transition-all duration-500 text-blue-500 hover:text-red-500 bg-white">
              Giới Thiệu
            </button>
            <button className="font-semibold font-serif py-2 transition-all duration-500 text-blue-500 hover:text-red-500 bg-white">
              Liên Hệ
            </button>
          </div>
        </div>
        <div className=" justify-center md:block hidden items-center mr-4 relative">
          <div className="dropdown">
            <IoIosSearch className="text-2xl absolute left-2 top-1" />
            <input
              type="text"
              className="rounded-xl border-2 border-blue-400 py-1 pl-10 focus:outline-blue-400"
              placeholder="Search.."
            />
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow "
            >
              <li>
                <a>VF 3</a>
              </li>
              <li>
                <a>VF 5 Plus</a>
              </li>
              <li>
                <a>VF 6</a>
              </li>
              <li>
                <a>VF e34</a>
              </li>
              <li>
                <a>VF 7</a>
              </li>
              <li>
                <a>VF 8</a>
              </li>
              <li>
                <a>VF 9</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-none">
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          {/* <Link href='/sign-up' className="btn transition-all duration-500 bg-green-400 hover:text-red-500 px-4 w-20 sm:w-28 " onClick={() => document.getElementById('my_modal_2').showModal()} href={''}>
Login
</Link> */}

          {/* <dialog id="my_modal_2" className="modal">
  
  <div className="modal-box border-4 border-green-400">
   <span className='text-3xl'>Login</span>
  <label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
  </svg>
  <input type="text" className="grow" placeholder="Username" />
</label>
<label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      fillRule="evenodd"
      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
      clipRule="evenodd" />
  </svg>
  <input type="password" className="grow" value="password" />
</label>
<button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg">Login</button>
    </div>
  
  <div className='absolute bg-gradient-to-t from-emerald-400 to-blue-400 '></div>
  <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>
</dialog> */}
          {/* <div>
            {userId ? (
              <div>
                <UserButton />
              </div>
            ) : ( */}
              <div className="flex gap-5 h-14">
                <Link
                  href="/sign-in"
                  className="btn transition-all duration-500 bg-white hover:text-red-500 px-1 w-14 h-6 sm:w-20 sm:h-10 "
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="btn transition-all text-white duration-500 hover:text-red-500 bg-blue-600 px-2 w-15 h-6 sm:w-20 sm:h-10"
                >
                  Register
                </Link>
              </div>
             {/* )} 
          </div> */}
        </div>
        <label className="btn btn-circle swap swap-rotate xl:hidden">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" onClick={() => setIsMenuOpen(!isMenuOpen)} />

          {/* hamburger icon */}
          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          {/* close icon */}
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

        <div
          className={`absolute xl:hidden top-20 left-0 w-full bg-white flex flex-col items-center gap-10 text-lg rounded-xl transform transition-all duration-75 ${
            isMenuOpen ? "animate-fadetop" : "hidden"
          }`}
        >
          <a href="">
            <button className="font-semibold font-serif transition-all duration-500 hover:text-red-500 bg-slate-50 ">
              Trang Chủ
            </button>
          </a>
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
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow "
            >
              <li>
                <a>VF 3</a>
              </li>
              <li>
                <a>VF 5 Plus</a>
              </li>
              <li>
                <a>VF 6</a>
              </li>
              <li>
                <a>VF e34</a>
              </li>
              <li>
                <a>VF 7</a>
              </li>
              <li>
                <a>VF 8</a>
              </li>
              <li>
                <a>VF 9</a>
              </li>
            </ul>
          </div>
          <button className=" font-semibold font-serif transition-all duration-500  hover:text-red-500 bg-white">
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
