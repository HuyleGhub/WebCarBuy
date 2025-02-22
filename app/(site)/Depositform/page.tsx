"use client"
import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Footer from "@/app/components/Footer";

interface LichHenLayXe {
    idLichHenLayXe: number;
    NgayLayXe: string;
    GioHenLayXe: string;
    DiaDiem: string;
}

interface ChiTietDatCoc {
    idDatCoc: number;
    NgayDat: string;
    SotienDat: number;
    TrangThaiDat: string;
    LichHenLayXe: LichHenLayXe[];
    xe: {
        TenXe: string;
        HinhAnh: string;
        GiaXe: number;
        MauSac: string;
    };
}

const DepositOrderPage = () => {
    const [datCocs, setDatCocs] = useState<ChiTietDatCoc[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDatCocs();
    }, []);

    const fetchDatCocs = async () => {
        try {
            const response = await fetch("/api/datcoc");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Fetch pickup schedules for each deposit order

            setDatCocs(data);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
            setError("Không thể tải danh sách đơn đặt cọc");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelDeposit = async (id: number) => {
        const confirmed = await new Promise((resolve) => {
            toast.custom(
                (t) => (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex flex-col gap-2">
                            <p className="font-medium">Bạn có chắc muốn hủy đơn đặt cọc này?</p>
                            <div className="flex gap-2">
                                <button
                                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    onClick={() => {
                                        toast.dismiss(t.id);
                                        resolve(true);
                                    }}
                                >
                                    Hủy đơn
                                </button>
                                <button
                                    className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                    onClick={() => {
                                        toast.dismiss(t.id);
                                        resolve(false);
                                    }}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                ),
                {
                    duration: Infinity,
                }
            );
        });
    
        if (confirmed) {
            try {
                const response = await fetch(`/api/datcoc/${id}`, {
                    method: "DELETE"
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Update local state by filtering out the deleted deposit order
                setDatCocs((prevDatCocs) =>
                    prevDatCocs.map((datCoc) =>
                        datCoc.idDatCoc === id
                            ? { ...datCoc, TrangThaiDat: 'Đã hủy' }
                            : datCoc
                    )
                );
                
                toast.success("Đã hủy đơn đặt cọc thành công");
            } catch (error) {
                console.error('Error cancelling deposit order:', error);
                toast.error("Không thể hủy đơn đặt cọc");
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'chờ xác nhận':
                return 'bg-yellow-100 text-yellow-800';
            case 'đã xác nhận':
                return 'bg-green-100 text-green-800';
            case 'đã hủy':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen" data-theme="light">
                <span className="loading loading-spinner text-blue-600 loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
      <div data-theme="light">
        <Toaster position="top-center" />
        <div className="container mx-auto px-16 py-28 ">
          <h1 className="text-2xl font-bold mb-6">Đơn Đặt Cọc</h1>

          {datCocs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Bạn chưa có đơn đặt cọc nào
            </div>
          ) : (
            <div className="flex flex-wrap flex-shrink justify-stretch gap-12">
              {datCocs.map((datCoc) => (
                <div
                  key={datCoc.idDatCoc}
                  className="bg-white rounded-2xl shadow-xl p-6 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-600">Mã đơn đặt cọc: </span>
                      <span className="font-semibold">#{datCoc.idDatCoc}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        datCoc.TrangThaiDat
                      )}`}
                    >
                      {datCoc.TrangThaiDat}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 border-t pt-4">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={datCoc.xe.HinhAnh.split("|")[0]}
                        alt={datCoc.xe.TenXe}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {datCoc.xe.TenXe}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        Màu sắc: <span>{datCoc.xe.MauSac}</span>
                      </p>
                      <p className="text-gray-600">
                        Giá xe:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(datCoc.xe.GiaXe))}
                      </p>
                    </div>
                    <div>
                      {datCoc.LichHenLayXe &&
                        datCoc.LichHenLayXe.length > 0 && (
                          <div className="bg-white p-4 rounded-lg">
                            <h4 className="text-lg font-semibold mb-2 text-blue-800">
                              Lịch Hẹn Lấy Xe
                            </h4>
                            {datCoc.LichHenLayXe.map((schedule) => (
                              <div
                                key={schedule.idLichHenLayXe}
                                className="mb-2"
                              >
                                <div className="flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-600"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h1zm5 0a1 1 0 011 1v3a1 1 0 01-1 1h-1a1 1 0 01-1-1V8a1 1 0 011-1h1z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="font-medium text-blue-800">
                                    {new Date(
                                      schedule.NgayLayXe
                                    ).toLocaleDateString("vi-Vn", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-blue-600"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-blue-700">
                                    {schedule.DiaDiem}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-gray-600">Ngày đặt cọc: </span>
                      <span className="font-bold text-lg">
                        {new Date(datCoc.NgayDat).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 mr-2">
                        Số tiền đặt cọc:{" "}
                      </span>
                      <span className="font-bold text-lg">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(datCoc.SotienDat))}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-end">
                      {datCoc.TrangThaiDat === "Chờ xác nhận" && (
                        <button
                          onClick={() => handleCancelDeposit(datCoc.idDatCoc)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
};

export default DepositOrderPage;