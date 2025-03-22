"use client";

import React, { useEffect, useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import TableDanhGiaTraiNghiem from "../components/Tabledanhgia";

interface ReviewData {
  idDanhGia: number;
  idLichHen: number;
  idUser: number;
  idXe: number;
  SoSao: number | null;
  NoiDung: string | null;
  NgayDanhGia: string;
  lichHen: {
    TenKhachHang: string | null;
    Sdt: string | null;
    Email: string | null;
  };
  xe: {
    TenXe: string | null;
    GiaXe: number | null;
  };
}

export default function Page() {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  const handleDelete = async (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-medium">Bạn có chắc muốn xóa đánh giá này?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await fetch(`api/danhgia/${id}`, {
                  method: "DELETE",
                });

                if (!response.ok) {
                  throw new Error("Failed to delete review");
                }

                const data = await response.json();
                toast.success(data.message);
                refreshData();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Lỗi khi xóa đánh giá");
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
          >
            Xóa
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#000',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    });
  };

  const handleView = (review: ReviewData) => {
    setReviewData(review);
    
    const dialog = document.getElementById("review_modal") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleModalClose = () => {
    setReviewData(null);
    const dialog = document.getElementById("review_modal") as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  // Function to render star rating
  const renderStarRating = (rating: number | null) => {
    if (!rating) return "Chưa đánh giá";
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-400">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">★</span>
        );
      }
    }
    return <div className="flex">{stars}</div>;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen" data-theme="light">
      <span className="loading loading-spinner text-blue-600 loading-lg"></span>
    </div>
  );

  return (
    <div className="p-2 flex-col justify-center text-center w-full h-[630px]" data-theme="light">
      <div className="flex justify-between pb-4 w-full">
        <h1 className="text-2xl font-bold  flex-grow text-black">
          Quản Lý Đánh Giá Trải Nghiệm
        </h1>
      </div>
      

      <dialog id="review_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleModalClose}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">
            Chi Tiết Đánh Giá
          </h3>
          {reviewData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Khách Hàng
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-left">
                    {reviewData.lichHen?.TenKhachHang || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Số Điện Thoại
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-left">
                    {reviewData.lichHen?.Sdt || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-left">
                    {reviewData.lichHen?.Email || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Xe
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-left">
                    {reviewData.xe?.TenXe || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Ngày Đánh Giá
                  </label>
                  <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-left">
                    {formatDate(reviewData.NgayDanhGia)}
                  </p>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    Đánh Giá Sao
                  </label>
                  <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-left">
                    {renderStarRating(reviewData.SoSao)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Nội Dung Đánh Giá
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-left min-h-32">
                  {reviewData.NoiDung || "Không có nội dung"}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </dialog>

      <div className="flex w-full justify-center">
        <TableDanhGiaTraiNghiem
          onEdit={handleView}
          onDelete={handleDelete}
          reloadKey={reloadKey}
        />
      </div>
    </div>
  );
}