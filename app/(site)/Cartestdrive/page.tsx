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
  idLoaiXe: number;
  khachHang: {
    Hoten: string;
    Sdt: string;
    Diachi: string;
  };
}

interface AppointmentFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  notes: string;
}

interface TestDriveScheduleData {
  NgayHen: Date | null;
  GioHen: string;
  DiaDiem: string;
}

const CarTestDrivePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [car, setCar] = useState<Car | null>(null);
  const [user, setUser] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testDriveSchedule, setTestDriveSchedule] = useState<TestDriveScheduleData>({
    NgayHen: null,
    GioHen: "",
    DiaDiem: "",
  });
  const [formData, setFormData] = useState<AppointmentFormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    notes: "",
  });

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const sessionData = await response.json();

        if (!sessionData) {
          setUser(null); // Allow non-logged in users to book test drives
        } else {
          setUser(sessionData);
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      } finally {
        // If car details are not yet loaded, change loading state
        if (!car) setLoading(false);
      }
    };

    fetchUserInfo();
  }, [router, car]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestDriveScheduleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTestDriveSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Format the time to 12-hour format for API
      const formattedTime = testDriveSchedule.GioHen;
      const hour = parseInt(formattedTime.split(':')[0]);
      const minute = formattedTime.split(':')[1];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      const time12h = `${formattedHour}:${minute} ${ampm}`;

      // Submit test drive appointment request
      const appointmentResponse = await fetch("/api/lichhenchaythu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TenKhachHang: formData.fullName,
          Sdt: formData.phoneNumber,
          Email: formData.email,
          idXe: car?.idXe,
          idLoaiXe: car?.idLoaiXe,
          NgayHen: testDriveSchedule.NgayHen?.toISOString(),
          GioHen: time12h,
          DiaDiem: testDriveSchedule.DiaDiem,
          NoiDung: formData.notes,
        }),
      });

      if (!appointmentResponse.ok) {
        throw new Error("Không thể tạo lịch hẹn trải nghiệm xe");
      }

      // Show success toast and redirect
      toast.success("Đặt lịch hẹn trải nghiệm xe thành công!");
      router.push("/"); // Redirect to home page or appropriate page
    } catch (error) {
      console.error("Lỗi khi đặt lịch hẹn:", error);
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
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center justify-center">
              Đặt Lịch Trải Nghiệm Xe {car.TenXe}
            </h2>
            <p className="text-center text-xl font-semibold text-primary mb-6">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(car.GiaXe)}
            </p>

            <form onSubmit={handleAppointmentSubmit} className="space-y-6">
              <div className="flex justify-between gap-6">
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span>Họ và tên</span>
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
                      <span>Số điện thoại</span>
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
              <div className="flex justify-between gap-6">
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span>Email</span>
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
                      <span>Ngày hẹn</span>
                    </label>
                    <DatePicker
                      selected={testDriveSchedule.NgayHen}
                      onChange={(date: Date | null) =>
                        setTestDriveSchedule((prev) => ({
                          ...prev,
                          NgayHen: date,
                        }))
                      }
                      minDate={new Date()}
                      className="input input-bordered bg-slate-300 w-full"
                      placeholderText="Chọn ngày hẹn"
                      dateFormat="dd/MM/yyyy"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-6">
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span>Giờ hẹn</span>
                    </label>
                    <input
                      type="time"
                      name="GioHen"
                      value={testDriveSchedule.GioHen}
                      onChange={handleTestDriveScheduleChange}
                      className="input input-bordered bg-slate-300 w-full"
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span>Địa điểm trải nghiệm</span>
                    </label>
                    <select
                      name="DiaDiem"
                      value={testDriveSchedule.DiaDiem}
                      onChange={handleTestDriveScheduleChange}
                      className="select select-bordered bg-slate-300 text-black w-full"
                      required
                    >
                      <option value="">Chọn địa điểm</option>
                      <option value="showroom">Tại Showroom</option>
                      <option value="home">Tại Nhà</option>
                      <option value="other">Địa điểm khác</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Ghi chú</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered bg-slate-300 text-black w-full h-24"
                  placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt"
                ></textarea>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => router.push(`/Carcategory?id=${car.idXe}`)}
                  className="btn flex-1"
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Đặt lịch hẹn
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

export default CarTestDrivePage;