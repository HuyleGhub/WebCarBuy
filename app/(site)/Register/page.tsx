'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SignupFormSchema from '@/app/api/zodschema/zodSignUp/route';
import toast, { ToastBar, Toaster } from 'react-hot-toast';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = {
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      fullname: formData.get('fullname') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    };
    const result = SignupFormSchema.safeParse(formValues);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(formValues),
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      const toastPromise = toast.promise(
        new Promise((resolve) => setTimeout(resolve, 4500)),
        {
          loading: 'Đang Đăng Ký...',
          success: 'Đã đăng ký thành công!',
          error: 'Có lỗi xảy ra',
        },
        {
          duration: 4000,
        }
      )
      
      await toastPromise;

      router.push('/Login');
    } catch (error: any) {
        console.error(error);
      setError(error.message);
    }
  }

  return (
    <div className="min-h-screen hero bg-base-200" data-theme="light">
       <Toaster 
              position="top-right"
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
       <div className="hero-content  flex-col lg:flex-row w-full bg-gradient-to-r from-pink-500 to-blue-500 rounded-2xl mt-20 p-4 lg:p-8 gap-8">
        {/* Hero Text Section */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl lg:text-5xl font-bold text-white">Register now!</h1>
          <p className="py-4 lg:py-6 text-white text-sm lg:text-base">
            Join us to explore our amazing products and services.
          </p>
        </div>

        {/* Card Section */}
        <div className="card shadow-2xl bg-base-100 w-full max-w-sm lg:max-w-md">
          <form onSubmit={handleSubmit} className="card-body p-4 lg:p-8">
            {/* Error Alert */}
            {error && (
              <div className="alert alert-error text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-5 w-5 lg:h-6 lg:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email and Username */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered w-full text-sm lg:text-base"
                  required
                />
              </div>

              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                  className="input input-bordered w-full text-sm lg:text-base"
                  required
                />
              </div>
            </div>

            {/* Full Name and Phone Number */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  placeholder="Full Name"
                  className="input input-bordered w-full text-sm lg:text-base"
                  required
                />
              </div>

              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Phone Number"
                  className="input input-bordered w-full text-sm lg:text-base"
                  required
                />
              </div>
            </div>

            {/* Address and Password */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Address"
                  className="textarea textarea-bordered w-full text-sm lg:text-base"
                  rows={3}
                />
              </div>

              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="input input-bordered w-full text-sm lg:text-base"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-4 lg:mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Register
              </button>
            </div>

            {/* Login Link */}
            <label className="label justify-center lg:justify-start">
              <Link
                href="/Login"
                className="label-text-alt link link-hover text-sm"
              >
                Already have an account? Login
              </Link>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}
