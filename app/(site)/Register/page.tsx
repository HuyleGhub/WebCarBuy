'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SignupFormSchema from '@/app/api/zodschema/zodSignUp/route';

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

      router.push('/Login');
    } catch (error: any) {
        console.error(error);
      setError(error.message);
    }
  }

  return (
    <div className="min-h-screen hero bg-base-200" data-theme="light">
      <div className="hero-content flex w-full bg-gradient-to-r from-pink-500 rounded-2xl to-blue-500 mt-10">
        <div className="text-center lg:text-left lg:ml-8">
          <h1 className="text-5xl font-bold">Register now!</h1>
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
            <div className="flex gap-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered"
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
                  className="input input-bordered"
                  required
                />
              </div>
            </div>

            {/* Hàng thứ hai với Full Name và Phone Number */}
            <div className="flex gap-4">
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  placeholder="Full Name"
                  className="input input-bordered"
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
                  className="input input-bordered"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
            {/* Trường Address */}
            <div className="form-control flex-1">
              <label className="label w-56">
                <span className="label-text">Address</span>
              </label>
              <textarea
                id="address"
                name="address"
                placeholder="Address"
                className="textarea textarea-bordered"
                rows={3}
              />
            </div>

            {/* Trường Password */}
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
              <button type="submit" className="btn btn-primary">Register</button>
            </div>

            <label className="label">
              <Link href="/Login" className="label-text-alt link link-hover">
                Already have an account? Login
              </Link>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}
