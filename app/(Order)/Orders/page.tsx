"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Footer from "@/app/components/Footer";

interface ChiTietDonHang {
  idChiTietDonHang: number;
  SoLuong: number;
  DonGia: number;
  xe: {
    TenXe: string;
    HinhAnh: string;
    GiaXe: number;
    MauSac: string;
    TrangThai: string;
  };
}

interface LichGiaoXe {
  NgayGiao: string;
  TrangThai: string;
}

interface DonHang {
  idDonHang: number;
  TrangThaiDonHang: string;
  TongTien: number;
  NgayDatHang: string;
  ChiTietDonHang: ChiTietDonHang[];
  LichGiaoXe: LichGiaoXe[];
}

const OrderPage = () => {
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonHangs();
  }, []);

  const fetchDonHangs = async () => {
    try {
      const response = await fetch("api/donhang");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDonHangs(data);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      setError("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col gap-2">
              <p className="font-medium">Bạn có chắc muốn hủy đơn hàng này?</p>
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
        const response = await fetch(`api/donhang/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local state by filtering out the deleted order
        setDonHangs((prevDonHangs) =>
          prevDonHangs.map((donHang) => {
            if (donHang.idDonHang === id) {
              return {
                ...donHang,
                TrangThaiDonHang: "Đã hủy",
              };
            }
            return donHang;
          })
        );

        toast.success("Đã hủy đơn hàng thành công");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Không thể hủy đơn hàng");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "đang xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "đã xác nhận":
        return "bg-blue-100 text-blue-800";
      case "đang giao":
        return "bg-purple-100 text-purple-800";
      case "đã giao":
        return "bg-green-100 text-green-800";
      case "đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // const formatDeliveryStatus = (status: string) => {
  //   switch (status) {
  //     case "Chờ giao":
  //       return "Chờ giao";
  //     case "Đang giao":
  //       return "Đang giao";
  //     case "Đã giao":
  //       return "Đã giao";
  //     default:
  //       return "Chưa xác định";
  //   }
  // };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        data-theme="light"
      >
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
      <div className="container mx-auto px-36 py-28 ml-9 ">
        <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

        {donHangs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Bạn chưa có đơn hàng nào
          </div>
        ) : (
          <div className="flex flex-wrap flex-shrink justify-stretch gap-12">
            {donHangs.map((donHang) => (
              <div
                key={donHang.idDonHang}
                className="bg-white rounded-2xl shadow-xl p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-600">Mã đơn hàng: </span>
                    <span className="font-semibold">#{donHang.idDonHang}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      donHang.TrangThaiDonHang
                    )}`}
                  >
                    {donHang.TrangThaiDonHang}
                  </span>
                </div>

                {donHang.ChiTietDonHang.map((chiTiet) => (
                  <div
                    key={chiTiet.idChiTietDonHang}
                    className="flex items-center gap-4 border-t pt-4"
                  >
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={chiTiet.xe.HinhAnh.split("|")[0]}
                        alt={chiTiet.xe.TenXe}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {chiTiet.xe.TenXe}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        Màu sắc: <span>{chiTiet.xe.MauSac}</span>
                      </p>
                      <p className="text-gray-600">
                        Đơn giá:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(chiTiet.DonGia))}
                      </p>
                      <p className="text-sm text-gray-600">
                        Số lượng: {chiTiet.SoLuong}
                      </p>
                    </div>
                    <div>
                      {donHang.LichGiaoXe && donHang.LichGiaoXe.length > 0 && (
                        <div className="bg-white p-4 rounded-lg  border-blue-500">
                          <h4 className="text-lg font-semibold mb-2 text-blue-800">
                            Lịch Giao Xe
                          </h4>
                          {donHang.LichGiaoXe.map((lichGiao, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 mb-2"
                            >
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
                                {new Date(lichGiao.NgayGiao).toLocaleString(
                                  "vi-VN",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center border-t pt-4">
                  <div>
                    <span className="text-gray-600">Tổng tiền: </span>
                    <span className="font-bold text-lg">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(donHang.TongTien))}
                    </span>
                  </div>
                  {donHang.TrangThaiDonHang === "Chờ xác nhận" && (
                    <button
                      onClick={() => handleDelete(donHang.idDonHang)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Hủy đơn
                    </button>
                  )}
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

export default OrderPage;
