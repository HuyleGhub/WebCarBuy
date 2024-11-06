"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { GrUserManager } from "react-icons/gr";
import { FaCar } from "react-icons/fa";
import { GiCarDoor } from "react-icons/gi";

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
      label: "Quản Lý Sản Phẩm",
    },
    {
      icon: <GiCarDoor />,
      href: "/dashboard/productstatistics",
      label: "Quản Lý Loại Xe",
    },
  ];
  const [link, setlink] = useState<SidebarLink[]>([]);

  const isActivePath = (path: string) => pathname === path;

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex flex-col w-30 h-full bg-slate-950 fixed">
      <div className="collapse collapse-arrow w-64 m-6 bg-slate-950">
        <input type="checkbox" name="my-accordion-2" />
        <div className="collapse-title text-white text-xl text-center mb-2 font-medium">
          <div className="absolute left-9 top-5"><GrUserManager /></div>
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
            <div className="absolute left-9 ">{link.icon}</div> 
            <div >{link.label}</div>
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
