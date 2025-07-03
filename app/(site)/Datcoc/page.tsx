"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Footer from "@/app/components/Footer";
import { UserAuth } from "@/app/types/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/app/components/Stripecomponents";
import Image from "next/image";

// Initialize Stripe (replace with your actual publishable key)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Car {
  idXe: number;
  TenXe: string;
  GiaXe: number;
  HinhAnh: string;
  MauSac: string;
  NamSanXuat: string;
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
  depositPercentage: number;
}

interface PickupScheduleData {
  NgayLayXe: Date | null;
  GioHenLayXe: string;
  DiaDiem: string;
}

interface StripePaymentData {
  clientSecret: string;
  depositAmount: number;
  totalAmount: number;
  depositPercentage: number;
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
    depositPercentage: 20, // Default to 20%
  });
  
  // Stripe payment states
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [stripePaymentData, setStripePaymentData] = useState<StripePaymentData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'CASH'>('CASH');

  // Deposit percentage options
  const DEPOSIT_PERCENTAGES = [
    { value: 10, label: '10% Trả góp' },
    { value: 20, label: '20% Trả góp' },
    { value: 30, label: '30% Trả góp' },
    { value: 40, label: '40% Trả góp' },
    { value: 50, label: '50% Trả góp' },
    { value: 100, label: 'Thanh toán toàn bộ' }
  ];

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const sessionData = await response.json();

        if (!sessionData) {
          toast.error("Vui lòng đăng nhập");
          router.push("/Login");
          return;
        }

        setUser(sessionData);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        toast.error("Vui lòng đăng nhập");
        router.push("/Login");
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
        // Set default deposit amount to 20% of car price
        setFormData((prev) => ({
          ...prev,
          depositAmount: Math.round(data.GiaXe * 0.2),
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

  const calculateDepositAmount = (percentage: number) => {
    if (!car) return 0;
    return Math.round(car.GiaXe * (percentage / 100));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'depositPercentage') {
      const percentage = Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: percentage,
        depositAmount: calculateDepositAmount(percentage)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const handlePaymentMethodChange = (method: 'STRIPE' | 'CASH') => {
    setPaymentMethod(method);
  };

  const initiateStripePayment = async () => {
    if (!car || !user) {
      toast.error("Thông tin không đầy đủ");
      return;
    }
  
    try {
      setLoading(true);
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicles: [
            {
              idXe: car.idXe,
              SoLuong: 1, // Assuming one car per deposit
            },
          ],
          depositPercentage: formData.depositPercentage / 100, // Convert to decimal
          // Include pickup schedule data
          pickupSchedule: {
            NgayLayXe: pickupSchedule.NgayLayXe?.toISOString(),
            GioHenLayXe: pickupSchedule.GioHenLayXe,
            DiaDiem: pickupSchedule.DiaDiem,
          }
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể khởi tạo thanh toán");
      }
  
      const data = await response.json();
      setStripePaymentData(data);
      setShowStripePayment(true);
    } catch (error) {
      console.error("Lỗi khởi tạo thanh toán:", error);
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.phoneNumber || !formData.email || 
        !pickupSchedule.NgayLayXe || !pickupSchedule.GioHenLayXe || !pickupSchedule.DiaDiem) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (paymentMethod === 'STRIPE') {
      initiateStripePayment();
    } else {
      handleCashDeposit();
    }
  };
  
  const handleCashDeposit = async () => {
    if (!car || !user) return;
    
    try {
      // Submit deposit request
      const depositResponse = await fetch("/api/datcoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idXe: car.idXe,
          idKhachHang: user.idUsers,
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
  
      // Create pickup schedule with user-entered data
      const pickupResponse = await fetch("/api/lichhen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idDatCoc: depositData.idDatCoc,
          idXe: car.idXe,
          idKhachHang: user.idUsers,
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
      router.push("/");
    } catch (error) {
      console.error("Lỗi khi đặt cọc:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleStripeSuccess = () => {
    toast.success("Thanh toán thành công!");
    setShowStripePayment(false);
    router.push("/");
  };

  const handleStripeCancel = () => {
    setShowStripePayment(false);
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
    <div className=" bg-gradient-to-br  from-slate-100 to-slate-200 flex flex-col" data-theme="light">
      <Toaster position="top-right" />
      
      <div className="flex-1 flex justify-center items-center py-24 px-4" >
        <div className="w-full max-w-7xl bg-white shadow-xl rounded-2xl overflow-hidden flex" data-theme="light">
          {/* Car Image Section */}
          <div className="w-1/2 relative">
          {car?.HinhAnh && car.HinhAnh.length > 0 && (
  <Image 
    src={car.HinhAnh[0]} 
    alt={car.TenXe || "Car Image"} 
    layout="fill" 
    objectFit="cover" 
    className="absolute inset-0"
  />
)}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
              <h2 className="text-2xl font-bold text-white">{car?.TenXe}</h2>
              <p className="text-slate-200">
                {car?.MauSac} · {car?.NamSanXuat}
              </p>
            </div>
          </div>

          {/* Deposit Form Section */}
          <div className="w-1/2 p-8 bg-white">
            <h2 className="text-2xl font-bold text-center mb-4">Đặt Cọc Xe</h2>
            <p className="text-center text-xl font-semibold text-primary mb-6">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(car?.GiaXe || 0)}
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex justify-between gap-4">
                <div className="form-control flex-1">
                  <label className="label">
                    <span>Họ và tên</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input input-bordered  w-full"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div className="form-control flex-1">
                  <label className="label">
                    <span>Số điện thoại</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="input input-bordered  w-full"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered  w-full"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Phương thức trả góp</span>
                </label>
                <select
                  name="depositPercentage"
                  value={formData.depositPercentage}
                  onChange={handleInputChange}
                  className="select select-bordered  w-full"
                  required
                >
                  {DEPOSIT_PERCENTAGES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(calculateDepositAmount(option.value))}
                    </option>
                  ))}
                </select>
              </div>

              <div className="alert bg-blue-100 text-black">
                <div className="flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <label>
                    Số tiền đặt cọc:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(formData.depositAmount)}
                  </label>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <div className="form-control flex-1">
                  <label className="label">
                    <span>Ngày lấy xe</span>
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
                    className="input input-bordered  w-full"
                    placeholderText="Chọn ngày lấy xe"
                    dateFormat="dd/MM/yyyy"
                    required
                  />
                </div>
                
                <div className="form-control flex-1">
                  <label className="label">
                    <span>Giờ hẹn lấy xe</span>
                  </label>
                  <input
                    type="time"
                    name="GioHenLayXe"
                    value={pickupSchedule.GioHenLayXe}
                    onChange={handlePickupScheduleChange}
                    className="input input-bordered  w-full"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Địa điểm lấy xe</span>
                </label>
                <select
                  name="DiaDiem"
                  value={pickupSchedule.DiaDiem}
                  onChange={handlePickupScheduleChange}
                  className="select select-bordered  w-full"
                  required
                >
                  <option value="">Chọn địa điểm</option>
                  <option value="showroom">Showroom</option>
                  <option value="home">Tại nhà</option>
                  <option value="other">Địa điểm khác</option>
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span>Hình thức thanh toán</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="radio radio-primary"
                      checked={paymentMethod === 'CASH'}
                      onChange={() => handlePaymentMethodChange('CASH')}
                    />
                    <span>Tiền mặt tại showroom</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="radio radio-primary"
                      checked={paymentMethod === 'STRIPE'}
                      onChange={() => handlePaymentMethodChange('STRIPE')}
                    />
                    <span>Thanh toán thẻ</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => router.push(`/Carcategory?id=${car.idXe}`)}
                  className="btn btn-outline flex-1"
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

      {/* Stripe Payment Modal */}
      {showStripePayment && stripePaymentData && stripePaymentData.clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret: stripePaymentData.clientSecret }}>
          <CheckoutForm 
            amount={stripePaymentData.depositAmount} 
            onSuccess={handleStripeSuccess} 
            onCancel={handleStripeCancel} 
          />
        </Elements>
      )}

      <Footer />
    </div>
  );
};

export default CarDepositPage;