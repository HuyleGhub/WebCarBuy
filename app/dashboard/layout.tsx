"use client";
import React, { useState } from 'react';
import Sidebardashboard from "@/app/components/Sidebardashboard";
import Navbardashboard from "../components/Navbardashboard";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "../api/uploadthing/core";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen" data-theme="light">
      {/* Navbar */}
      <Navbardashboard onToggleSidebar={toggleSidebar} />
      
      <div className="flex w-full pt-16 relative">
        {/* Sidebar */}
        <aside 
          className={`
            fixed left-0 top-16 bottom-0 z-40
            bg-gray-200 
            transform transition-all duration-500 ease-in-out
            ${isSidebarOpen 
              ? ' translate-x-0  w-72' 
              : '-translate-x-full w-0 overflow-hidden'}
          `}
        >
          <Sidebardashboard />
        </aside>

        {/* Main Content */}
        <main 
          className={`
            flex-1 justify-center h-full w-full bg-gray-100 
            transition-all duration-500 
            ${isSidebarOpen ? 'pl-52 ' : ' pl-0 w-full'}
          `}
        >
          <NextSSRPlugin
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          {children}
        </main>
      </div>
    </div>
  );
}