"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { GrUserManager } from "react-icons/gr";
import { FaCar } from "react-icons/fa";
import { GiCarDoor } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";

interface SidebarLink {
  icon: React.ReactElement;
  href: string;
  label: string;
}

interface SidebarDashboardProps {
  isOpen: boolean;
}

const SidebarDashboard: React.FC<SidebarDashboardProps> = ({ isOpen }) => {
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
    },
    {
      icon: <GiCarDoor />,
      href: "/dashboard/quanlydanhgia",
      label: "Đánh Giá",
    }
  ];

  const isActivePath = (path: string) => pathname === path;

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-700 ease-in-out z-[9999] ${
      isOpen ? 'w-72' : 'w-24'
    }`}>
      <div className="collapse  mt-3 shadow-md">
        <input type="checkbox" name="my-accordion-2" />
        <div className="collapse-title text-black text-base text-center mb-2 font-medium">
          <div className="absolute left-7 top-4 bg-gradient-to-tr from-[#ff0080] to-[#7928ca] rounded-sm text-white text-3xl">
            <GrUserManager />
          </div>
          {isOpen && <span className="text-slate-950 ml-12">Quản Lý</span>}
        </div>
        <div className="collapse-content">
          <ul className="space-y-4">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNavigation(link.href)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 ${
                    isActivePath(link.href)
                      ? "bg-blue-600 text-white"
                      : "text-slate-950 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <div className="text-xl">{link.icon}</div>
                  {isOpen && (
                    <span className="ml-4 text-sm">
                      {link.label}
                    </span>
                  )}
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