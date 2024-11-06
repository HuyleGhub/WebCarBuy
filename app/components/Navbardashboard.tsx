import Link from 'next/link'
import React from 'react'

const Navbardashboard = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-base-100 border-b z-50 w-full">
    <div className="navbar w-full bg-slate-950">
      <div className="flex-none">
        <button className="btn btn-square text-white btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <Link href="/dashboard" className="btn btn-ghost text-white text-xl">
          Dashboard
        </Link>
      </div>
      <div className="flex-none">
        <button className="btn btn-square text-white btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </nav>
  )
}

export default Navbardashboard