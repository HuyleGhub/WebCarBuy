"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import Navbar from './Navbar';

const ClientNavbar = () => {
    const pathname = usePathname();
    const isDashboardPath = pathname?.startsWith('/dashboard');
  return (
    <div> {!isDashboardPath && <Navbar />}</div>
  )
}

export default ClientNavbar