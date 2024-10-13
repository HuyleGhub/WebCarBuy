import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex items-center justify-center gap-10 flex-col h-[920px] w-full object-cover bg-cover bg-[url(https://img.freepik.com/free-vector/gradient-minimalist-background_23-2149976755.jpg)]'>
    <h1 className='text-4xl font-bold mt-5 '>Register In Here</h1>
    <SignUp />
  </div>
  );
}