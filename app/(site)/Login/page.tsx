'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginFormSchema from '@/app/api/zodschema/zodLogin/route';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();;
  
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setError('');
      
      const formData = new FormData(event.currentTarget);
      const formValues = {
        usernameOrEmail: formData.get('usernameOrEmail') as string,
        password: formData.get('password') as string,
      };
  
      // Kiểm tra dữ liệu phía client
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
        
        router.push('/');
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Thông tin đăng nhập không hợp lệ');
        }
      }
    }

  return (
    <div className="min-h-screen hero bg-base-200" data-theme="light">
      <div className="hero-content flex w-full bg-gradient-to-r from-pink-500 rounded-2xl to-blue-500 mt-10">
        <div className="text-center lg:text-left lg:ml-8">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">Join us to explore our amazing products and services.</p>
        </div>
        <div className="card flex shadow-2xl bg-base-100 h-auto">
          <form onSubmit={handleSubmit} className="card-body">
            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Hàng đầu tiên với Email và Username */}
            <div className="flex-col gap-4 w-96">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Email or UseName</span>
                </label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  placeholder="Email or UseName"
                  className="input input-bordered"
                  required
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
                  className="input input-bordered"
                  required
                />
              </div>
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>

            <label className="label">
              <Link href="/Register" className="label-text-alt link link-hover">
                Do you not have Account? Register Here
              </Link>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}