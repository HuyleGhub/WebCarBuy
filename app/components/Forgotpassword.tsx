export const runtime = 'nodejs';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast, Toaster } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();


      

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra');
      }

      const toastPromise = toast.promise(
        new Promise(resolve => setTimeout(resolve, 3500)),
        {
          loading: 'Đang gửi...',
          success: 'Email hướng dẫn đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
          error: 'Có lỗi xảy ra',
        },
        {
          duration: 4000,
        }
      )

      await toastPromise;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Toaster
      position='top-right'
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
      <Card className="w-full max-w-xl h-full max-h-92">
        <CardHeader>
          <CardTitle>Quên mật khẩu</CardTitle>
          <CardDescription>
            Nhập email của bạn để nhận link đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
          

         
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi link đặt lại mật khẩu'
                )}
              </Button>
              <div className="text-center">
                <a href="/Login" className="text-sm text-blue-600 hover:text-blue-800">
                  Quay lại đăng nhập
                </a>
              </div>
            </form>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;