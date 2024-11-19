"use client";
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
  return (
    <div className="flex flex-col min-h-screen" data-theme="light">
      {/* Navbar */}
      <Navbardashboard/>
      <div className="flex w-full pt-16">
        
        {/* Sidebar */}
        <aside className="w-72 bg-gray-200">
          <Sidebardashboard />
        </aside>

        {/* Main Content */}
        <main className="flex-1 pl-6 justify-center h-full w-full bg-gray-100">
        <NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
          {children}
        </main>
      </div>
    </div>
  );
}
