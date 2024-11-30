"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Footer from "@/app/components/Footer";
import { UserAuth } from "@/app/types/auth";

interface Car {
  idXe: number;
  TenXe: string;
  GiaXe: number;
  khachHang: {
    Hoten: string;
    Sdt: string;
    Diachi: string;
  };
}

interface DepositFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  depositAmount: number;
}

interface PickupScheduleData {
  NgayLayXe: string;
  GioHenLayXe: string;
  DiaDiem: string;
}

const CarDepositPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [car, setCar] = useState<Car | null>(null);
  const [user, setUser] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pickupSchedule, setPickupSchedule] = useState<PickupScheduleData>({
    NgayLayXe: "",
    GioHenLayXe: "",
    DiaDiem: "",
  });
  const [formData, setFormData] = useState<DepositFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    depositAmount: 0,
  });

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const sessionData = await response.json();

        if (!sessionData) {
          toast.error("Vui lòng đăng nhập");
          router.push("/login");
          return;
        }

        setUser(sessionData);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        toast.error("Vui lòng đăng nhập");
        router.push("/login");
      } finally {
        // If car details are not yet loaded, change loading state
        if (!car) setLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  // Fetch car details
  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id) {
        setError("Không tìm thấy mã xe");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/xe/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.idXe) {
          throw new Error("Không có thông tin xe");
        }

        setCar(data);
        // Set default deposit amount to 10% of car price
        setFormData((prev) => ({
          ...prev,
          depositAmount: Math.round(data.GiaXe * 0.1),
        }));
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin xe:", err);
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        setLoading(false);
        toast.error("Không thể tải thông tin xe");
      }
    };

    fetchCarDetails();
  }, [id, router]);

  // Pre-fill user data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.Hoten || "",
        phoneNumber: user.Sdt || "",
        email: user.Email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePickupScheduleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPickupSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validation checks remain the same
  
    try {
      // Submit deposit request
      const depositResponse = await fetch("/api/datcoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idXe: car?.idXe,
          idKhachHang: user?.idUsers,
          NgayDat: new Date().toISOString(),
          SotienDat: formData.depositAmount,
          TrangThaiDat: "Chờ xác nhận",
          khachHang: {
            hoTen: formData.fullName,
            soDienThoai: formData.phoneNumber,
            email: formData.email,
          },
        }),
      });
  
      if (!depositResponse.ok) {
        throw new Error("Không thể tạo đơn đặt cọc");
      }
  
      const depositData = await depositResponse.json();
  
      // Create pickup schedule
      const pickupResponse = await fetch("/api/lichhen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idDatCoc: depositData.idDatCoc,
          idXe: car?.idXe,
          idKhachHang: user?.idUsers,
          NgayLayXe: pickupSchedule.NgayLayXe,
          GioHenLayXe: pickupSchedule.GioHenLayXe,
          DiaDiem: pickupSchedule.DiaDiem,
        }),
      });
  
      if (!pickupResponse.ok) {
        throw new Error("Không thể tạo lịch hẹn lấy xe");
      }
  
      // Show success toast and redirect
      toast.success("Đặt cọc và lịch hẹn thành công!");
      router.push("/Depositform");
    } catch (error) {
      console.error("Lỗi khi đặt cọc:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  if (loading)
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
        <span className="loading loading-spinner text-blue-600 loading-lg"></span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    );

  if (!car)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-bold text-gray-800">
          Không tìm thấy thông tin xe
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
          duration: 3000,
        }}
      />
      <div className="relative mb-12 mt-24 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-indigo-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-sans font-semibold text-center text-indigo-600">
                  Đặt Cọc Xe {car.TenXe}
                </h2>
                <p className="text-center text-xl font-bold text-gray-500">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(car.GiaXe)}
                </p>
              </div>
              <form
                onSubmit={handleDepositSubmit}
                className="divide-y divide-gray-200"
              >
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="flex flex-col">
                    <label className="leading-loose">Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="px-4 py-2 border bg-white focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="leading-loose">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="px-4 py-2 border bg-white focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="leading-loose">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="px-4 py-2 border bg-white focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="leading-loose">Số tiền đặt cọc</label>
                    <input
                      type="number"
                      name="depositAmount"
                      value={formData.depositAmount}
                      onChange={handleInputChange}
                      className="px-4 py-2 border bg-white focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
                      required
                      min={Math.round(car.GiaXe * 0.1)}
                      max={Math.round(car.GiaXe * 0.5)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Số tiền đặt cọc từ{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Math.round(car.GiaXe * 0.1))}{" "}
                      đến{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Math.round(car.GiaXe * 0.5))}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <label className="leading-loose">Ngày lấy xe</label>
                    <input
                      type="date"
                      name="NgayLayXe"
                      value={pickupSchedule.NgayLayXe}
                      onChange={handlePickupScheduleChange}
                      className="px-4 py-2 border bg-white focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="leading-loose">Giờ hẹn lấy xe</label>
                    <input
                      type="time"
                      name="GioHenLayXe"
                      value={pickupSchedule.GioHenLayXe}
                      onChange={handlePickupScheduleChange}
                      className="px-4 py-2 border bg-white focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="leading-loose">Địa điểm lấy xe</label>
                    <select
                      name="DiaDiem"
                      value={pickupSchedule.DiaDiem}
                      onChange={handlePickupScheduleChange}
                      className="px-4 py-2 border bg-white focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Chọn địa điểm</option>
                      <option value="showroom">Showroom</option>
                      <option value="home">Tại nhà</option>
                      <option value="other">Địa điểm khác</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/Carcategory?id=${car.idXe}`)}
                    className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex justify-center items-center w-full bg-indigo-600 text-white px-4 py-3 rounded-md focus:outline-none hover:bg-indigo-700"
                  >
                    Đặt cọc
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CarDepositPage;
