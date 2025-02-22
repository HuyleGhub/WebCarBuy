'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginFormSchema from '@/app/api/zodschema/zodLogin/route';
import toast, {Toaster} from 'react-hot-toast';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    
    const formData = new FormData(event.currentTarget);
    const formValues = {
      usernameOrEmail: formData.get('usernameOrEmail') as string,
      password: formData.get('password') as string,
    };

    // Client-side validation
    const result = LoginFormSchema.safeParse(formValues);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại');
      }

      // Log the response to debug
      console.log('Login response:', data);
      const toastPromise = toast.promise(
        new Promise(resolve => setTimeout(resolve, 3500)),
        {
          loading: 'Đang Đăng Nhập...',
          success: 'Đã đăng nhập thành công!',
          error: 'Có lỗi xảy ra',
        },
        {
          duration: 4000,
        }
      )
  
      await toastPromise
      
      // Check user role and redirect accordingly
      if (data.user?.role === 'Admin') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }

      // Force a page refresh to ensure the session is updated
      router.refresh();
      
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Thông tin đăng nhập không hợp lệ');
      }
    }
  }

  // Rest of the component remains the same...
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
       <div className="hero-content flex-col lg:flex-row w-full bg-gradient-to-r from-pink-500 to-blue-500 rounded-2xl mt-10 p-4 lg:p-8 gap-8">
        {/* Hero Text Section */}
        <div className="text-center lg:text-left max-w-md">
          <h1 className="text-3xl lg:text-5xl font-bold text-white">Login now!</h1>
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

            {/* Form Fields */}
            <div className="flex flex-col gap-4 w-full">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email or Username</span>
                </label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  placeholder="Email or Username"
                  className="input input-bordered w-full text-sm lg:text-base"
                  required
                />
              </div>

              <div className="form-control">
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
                Login
              </button>
            </div>

            {/* Register Link */}
            <label className="label justify-center lg:justify-start">
              <Link
                href="/Register"
                className="label-text-alt link link-hover text-sm"
              >
                Don't have an account? Register Here
              </Link>
            </label>

             {/* Forgot Password Link */}
             <label className="label justify-center lg:justify-end">
                <Link
                  href="/Forgotpassword"
                  className="label-text-alt link link-hover text-sm"
                >
                  Forgot Password?
                </Link>
              </label>
          </form>
        </div>
      </div>
    </div>
  );
}