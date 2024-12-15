"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { GrUserManager } from "react-icons/gr";
import { FaCar } from "react-icons/fa";
import { GiCarDoor } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";

interface SidebarLink {
  icon: React.ReactElement;
  href: string;
  label: string;
}

const SidebarDashboard: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const sidebarLinks: SidebarLink[] = [
    {
      icon: <FaCar />,
      href: "/dashboard/productmangement",
      label: "Xe",
    },
    {
      icon: <GiCarDoor />,
      href: "/dashboard/loaixemanager",
      label: "Loại Xe",
    },
    {
      icon: <FaShippingFast />,
      href: "/dashboard/nhacungcapmanager",
      label: "Nhà Cung Cấp",
    },
    {
      icon: <GiCarDoor />,
      href: "/dashboard/quanlytaikhoan",
      label: "Tài Khoản Người Dùng",
    },
    {
      icon: <GiCarDoor />,
      href: "/dashboard/quanlydonhang",
      label: "Đơn Hàng",
    },
    {
      icon: <GiCarDoor />,
      href: "/dashboard/quanlydatcoc",
      label: "Đặt Cọc",
    },
    {
      icon: <GiCarDoor />,
      href: "/dashboard/quanlylichhenlayxe",
      label: "Lịch Hẹn",
    }
  ];

  const isActivePath = (path: string) => pathname === path;

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex flex-col w-30 h-full bg-slate-950 fixed">
      <div className="collapse collapse-arrow w-64 m-6 bg-slate-950">
        <input type="checkbox" name="my-accordion-2" />
        <div className="collapse-title text-white text-base text-center mb-2  font-medium">
          <div className="absolute left-9 top-4 text-xl"><GrUserManager /></div>
          Quản Lý
        </div>
        <div className="collapse-content">
        <ul className="">
        {sidebarLinks.map((link) => (
          <li key={link.href} className="my-5 pl-4">
            <button
              onClick={() => handleNavigation(link.href)}
              className={`block pl-7 pr-7 py-2 rounded-lg transition-colors ${
                isActivePath(link.href)
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
            <div className="absolute left-9">{link.icon}</div> 
            <div className="text-sm">{link.label}</div>
            </button>
          </li>
        ))}
      </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarDashboard;
