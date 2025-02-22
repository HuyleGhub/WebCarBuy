"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Footer from "@/app/components/Footer";
import { UserAuth } from "@/app/types/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  NgayLayXe: Date | null;
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
    NgayLayXe: null,
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
          NgayLayXe: pickupSchedule.NgayLayXe?.toISOString(),
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
    <div className="min-h-screen bg-white flex flex-col">
    <Toaster position="top-right" />
    
    <div className="flex-1 flex justify-center items-center py-12 px-4">
      <div className="card w-full max-w-2xl bg-slate-200 shadow-xl mt-9">
        <div className="card-body ">
          <h2 className="card-title text-2xl font-bold text-center justify-center  ">
            Đặt Cọc Xe {car.TenXe}
          </h2>
          <p className="text-center text-xl font-semibold text-primary mb-6">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(car.GiaXe)}
          </p>

          <form onSubmit={handleDepositSubmit} className="space-y-6">
            <div className="flex justify-between gap-6">
              <div className="flex-1">
            <div className="form-control">
              <label className="label">
                <span >Họ và tên</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="input input-bordered bg-slate-300 text-black w-full"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            </div>
             <div className="flex-1">
            <div className="form-control">
              <label className="label">
                <span >Số điện thoại</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="input input-bordered bg-slate-300 text-black w-full"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            </div>
          </div>
           <div className="flex justify-between gap-6 h-28">
            <div className="flex-1">
            <div className="form-control">
              <label className="label">
                <span >Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input input-bordered bg-slate-300 text-black w-full"
                placeholder="Nhập email"
                required
              />
            </div>
            </div>
            <div className="flex-1"> 
            <div className="form-control">
              <label className="label">
                <span >Số tiền đặt cọc</span>
              </label>
              <input
                type="number"
                name="depositAmount"
                value={formData.depositAmount}
                onChange={handleInputChange}
                className="input input-bordered bg-slate-300 text-black w-full"
                required
                min={Math.round(car.GiaXe * 0.1)}
                max={Math.round(car.GiaXe * 0.5)}
              />
              <label className="label">
                <span className="label-text-alt text-black">
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
                </span>
              </label>
            </div>
            </div>
          </div>

            <div className="flex justify-between gap-6 h-20">
              <div className="flex-1">
            <div className="form-control">
              <label className="label">
                <span >Ngày lấy xe</span>
              </label>
              <DatePicker
                selected={pickupSchedule.NgayLayXe}
                onChange={(date: Date | null) =>
                  setPickupSchedule((prev) => ({
                    ...prev,
                    NgayLayXe: date,
                  }))
                }
                minDate={new Date()}
                className="input input-bordered bg-slate-300 w-full"
                placeholderText="Chọn ngày lấy xe"
                dateFormat="dd/MM/yyyy"
                required
              />
            </div>
            </div>
            
            <div className="flex-1">
            <div className="form-control">
              <label className="label">
                <span >Giờ hẹn lấy xe</span>
              </label>
              <input
                type="time"
                name="GioHenLayXe"
                value={pickupSchedule.GioHenLayXe}
                onChange={handlePickupScheduleChange}
                className="input input-bordered bg-slate-300 w-full"
                required
              />
            </div>
            </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span >Địa điểm lấy xe</span>
              </label>
              <select
                name="DiaDiem"
                value={pickupSchedule.DiaDiem}
                onChange={handlePickupScheduleChange}
                className="select select-bordered bg-slate-300 text-black w-full"
                required
              >
                <option value="">Chọn địa điểm</option>
                <option value="showroom">Showroom</option>
                <option value="home">Tại nhà</option>
                <option value="other">Địa điểm khác</option>
              </select>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => router.push(`/Carcategory?id=${car.idXe}`)}
                className="btn  flex-1"
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary flex-1">
                Đặt cọc
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <Footer />
  </div>
);
};

export default CarDepositPage;
