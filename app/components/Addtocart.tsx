"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AddToCartProps {
  idXe: number;
  currentStock: number;
}

export const AddToCart = ({ idXe, currentStock }: AddToCartProps) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/giohang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idXe,
          SoLuong: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể thêm vào giỏ hàng');
      }

      const result = await response.json();
      router.refresh();
      // Show success toast or notification
      alert('Đã thêm vào giỏ hàng thành công!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md">
          <button
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            -
          </button>
          <span className="px-3 py-1">{quantity}</span>
          <button
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-black transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};