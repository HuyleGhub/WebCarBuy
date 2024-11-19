// components/ShoppingCart.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  idGioHang: number;
  idXe: number;
  SoLuong: number;
  xe: {
    TenXe: string;
    GiaXe: number;
    MauSac: string;
    HinhAnh: string;
    TrangThai: string;
  };
}

export const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/giohang");
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      alert("Có lỗi xảy ra khi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (idGioHang: number) => {
    try {
      const response = await fetch(`/api/giohang/${idGioHang}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };
  
  const updateItemQuantity = async (idGioHang: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      if (confirm("Bạn có chắc muốn xóa xe sản phẩm này không")) {
        await removeItem(idGioHang);
      }
      return;
    }
    try {
      const response = await fetch(`/api/giohang/${idGioHang}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ SoLuong: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item quantity");
      }

      await fetchCartItems();
    } catch (error) {
      console.error("Error updating item quantity:", error);
      alert("Có lỗi xảy ra khi cập nhật số lượng");
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch("/api/thanhtoan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const result = await response.json();
      alert("Đặt hàng thành công!");
      router.push("/"); // Redirect to orders page or home
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.xe.GiaXe) * item.SoLuong,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <span>Quay lại</span>
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl mb-4">Giỏ hàng trống</p>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.idGioHang}
                className="flex flex-col md:flex-row items-center gap-4 border-b py-4"
              >
                <img
                  src={item.xe.HinhAnh}
                  alt={item.xe.TenXe}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.xe.TenXe}</h3>
                  <p className="text-gray-600">{item.xe.MauSac}</p>
                  <p className="font-bold text-indigo-600 text-lg">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.xe.GiaXe)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateItemQuantity(item.idGioHang, item.SoLuong - 1)
                    }
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="text-lg">{item.SoLuong}</span>
                  <button
                    onClick={() =>
                      updateItemQuantity(item.idGioHang, item.SoLuong + 1)
                    }
                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.idGioHang)}
                  className="text-red-500 hover:text-red-700"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Tổng đơn hàng</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(total)}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="font-semibold flex justify-between">
                    <span>Tổng cộng:</span>
                    <span className="text-xl text-indigo-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(total)}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phương thức thanh toán
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border rounded-md py-2 px-3"
                  >
                    <option value="">Chọn phương thức thanh toán</option>
                    <option value="CASH">Tiền mặt</option>
                    <option value="CARD">Thẻ tín dụng</option>
                  </select>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className={`w-full mt-4 py-2 px-4 rounded-md text-white ${
                    processing
                      ? "bg-gray-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {processing ? "Đang xử lý..." : "Thanh toán"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};