"use client";

import React, { useEffect, useState } from "react";
import Tabledashboard from "@/app/components/Tabledashboard";
import { IoAddCircleOutline } from "react-icons/io5";

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadButton } from "@/app/lib/uploadthing";
import { Fileupload } from "@/app/components/Fileupload";
import { url } from "inspector";
import TableLoaiXe from "../components/Tableloaixe";
import TableNhaCungCap from "../components/Tablenhacungcap";

interface FormData {
  TenNhaCungCap: string;
  Sdt: string;
  Email: string;
}

export default function Page() {
  const initialFormData: FormData = {
    TenNhaCungCap: "",
    Sdt: "",
    Email: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };
 
  useEffect(() => {
    if (error || success) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        // Clear messages
        setError("");
        setSuccess("");
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [error, success]);


  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa loại xe này không?")) {
      return;
    }

    try {
      const response = await fetch(`api/nhacungcap/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      const data = await response.json();
      setSuccess(data.message);
      refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting product");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (product: any) => {
    setFormData({
      TenNhaCungCap: product.TenNhaCungCap,
      Sdt: product.Sdt,
      Email: product.Email,
    });
    setIsEditing(true);
    setEditingId(product.idNhaCungCap);
    // Show the dialog after setting the form data
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const url = isEditing ? `api/nhacungcap/${editingId}` : 'api/nhacungcap';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Kiểm tra xem API có trả về lỗi từ Zod không
        if (errorData.errors && Array.isArray(errorData.errors)) {
            const zodErrors = errorData.errors.map((error: any) => `${error.field}: ${error.message}`).join(", ");
            setError(`Dữ liệu không hợp lệ: ${zodErrors}`);
        } else {
            // Nếu không có lỗi Zod, sử dụng thông báo lỗi chung
            setError(errorData.message || `Không thể ${isEditing ? 'cập nhật' : 'tạo'} nhà cung cấp`);
        }
        return; // Dừng lại nếu có lỗi
      }

      const data = await response.json();
      setSuccess(data.message);
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingId(null);
      setImageUrl('');
      refreshData();

      // Close the dialog after successful submission
      const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : `Error ${isEditing ? 'updating' : 'creating'} product`);
    }
  };

  const handleModalClose = () => {
    if (!isEditing) {
      setFormData(initialFormData);
    }
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  const handleAddNewClick = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setEditingId(null);
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  return (
    <div className="p-2 w-[1100px] h-full ml-7" data-theme="light">
      <div className="flex gap-4 w-full">
        <h1 className="text-2xl font-bold mb-6 mt-1 w-56 text-black whitespace-nowrap">
          Quản Lý Nhà Cung Cấp
        </h1>
        <div className="flex justify-end gap-4 w-full">
          <button className="btn btn-accent" onClick={handleAddNewClick}>
            Thêm mới
          </button>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-end mt-16 z-[9999]">
          {error && (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div role="alert" className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}
        </div>
      )}
      <dialog id="my_modal_3" className="modal">
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
            {isEditing ? "Cập Nhật Nhà Cung Cấp" : "Thêm Mới Nhà Cung Cấp"}
          </h3>
          <div className="flex w-full">
            <div className="pt-6 w-[20000px]">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rest of the form content remains the same */}
                {/* Form fields... */}
                <div className="flex justify-center w-full flex-wrap gap-4">
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="TenNhaCungCap"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Tên Nhà Cung Cấp
                      </label>
                      <input
                        type="text"
                        id="TenNhaCungCap"
                        name="TenNhaCungCap"
                        value={formData.TenNhaCungCap}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                    <label
                        htmlFor="Sdt"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        id="Sdt"
                        name="Sdt"
                        value={formData.Sdt}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-4">

                    <div className="flex-1">
                    
                    <label
                        htmlFor="Sdt"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="Email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    {isEditing ? "Cập Nhật" : "Thêm Mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </dialog>
      <div className="flex w-full justify-center">
        <TableNhaCungCap
          onEdit={handleEdit}
          onDelete={handleDelete}
          reloadKey={refreshData}
        />
      </div>
    </div>
  );
}