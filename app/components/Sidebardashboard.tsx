"use client";

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

interface SidebarLink {
  href: string;
  label: string;
}

const SidebarDashboard: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const sidebarLinks: SidebarLink[] = [
    {
      href: "/dashboard/productmangement",
      label: "Quản Lý Sản Phẩm",
    },
    {
      href: "/dashboard/productstatistics",
      label: "Quản Lý Thống Kê",
    },
  ];

  const isActivePath = (path: string) => pathname === path;

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex flex-col w-30 h-full bg-slate-950 fixed">
      <ul className="flex flex-col my-5 mx-10 w-52 h-[640px]">
        {sidebarLinks.map((link) => (
          <li key={link.href} className="my-5">
            <button
              onClick={() => handleNavigation(link.href)}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActivePath(link.href)
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarDashboard;