"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useEffect, useState } from "react";
import ClientNavbar from "./components/ClientNavbar";
import { Toaster } from 'react-hot-toast';

// Font definitions need to stay outside the component
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata should be moved to a separate file when using "use client" in the layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Add client-side rendering protection
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body>
          <div className="min-h-screen bg-gray-100">
            {/* Loading state or fallback UI */}
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <DndProvider backend={HTML5Backend}>
        <Toaster position="top-right" 
         toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
          duration: 3000,
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          },
        }}
        />
          <div className="min-h-screen ">
            <ClientNavbar />
            <main>{children}</main>
          </div>
        </DndProvider>
      </body>
    </html>
  );
}