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
import toast, { Toaster } from "react-hot-toast";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  const handleDelete = async (id: number) => {
    // Create a promise that resolves when user makes a choice
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="font-medium">Bạn có chắc muốn xóa nhà cung cấp này?</span>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await fetch(`api/nhacungcap/${id}`, {
                  method: "DELETE",
                });
  
                if (!response.ok) {
                  throw new Error("Failed to delete supplier");
                }
  
                const data = await response.json();
                toast.success(data.message);
                refreshData();
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Lỗi khi xóa nhà cung cấp");
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
      duration: Infinity, // Don't auto-dismiss
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
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const zodErrors = errorData.errors.map((error: any) => `${error.field}: ${error.message}`).join(", ");
          toast.error(`Dữ liệu không hợp lệ: ${zodErrors}`);
        } else {
          toast.error(errorData.message || `Không thể ${isEditing ? 'cập nhật' : 'tạo'} nhà cung cấp`);
        }
        return;
      }

      const data = await response.json();
      toast.success(data.message);
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingId(null);
      refreshData();

      const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }

    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Lỗi ${isEditing ? 'cập nhật' : 'tạo'} nhà cung cấp`);
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
    <div className="p-2 flex-col justify-center text-center w-full h-[630px] " data-theme="light">
      <div className="flex justify-between pb-4  w-full">
        <h1 className="text-2xl font-bold mr-44 flex-grow text-black">
          Quản Lý Nhà Cung Cấp
        </h1>
        <div className="flex-grow">
          <button className="btn btn-accent" onClick={handleAddNewClick}>
            Thêm mới
          </button>
        </div>
      </div>

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
                        htmlFor="Email"
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