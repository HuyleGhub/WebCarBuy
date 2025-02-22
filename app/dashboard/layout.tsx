"use client";
import React, { useState } from 'react';
import Sidebardashboard from "@/app/components/Sidebardashboard";
import Navbardashboard from "../components/Navbardashboard";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "../api/uploadthing/core";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
      <Navbardashboard onToggleSidebar={toggleSidebar} />
      
      <div className="flex w-full pt-16 relative">
        <aside 
          className={`
            fixed left-0 top-16 bottom-0 z-40
            bg-white 
            transform  transition-all duration-500 ease-in-out
            ${isSidebarOpen ? 'w-72' : 'w-16'}
          `}
        >
          <Sidebardashboard isOpen={isSidebarOpen} />
        </aside>

        <main 
          className={`
            flex-1 justify-center h-[1700px] w-full bg-white 
            transition-all duration-500 
            ${isSidebarOpen ? 'ml-64' : 'ml-16'}
          `}
          data-theme="light"
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