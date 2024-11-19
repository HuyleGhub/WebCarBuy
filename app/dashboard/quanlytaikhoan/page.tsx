"use client";

import React, { useEffect, useState } from "react";
import Tabledashboard from "@/app/components/Tabledashboard";
import { IoAddCircleOutline } from "react-icons/io5";

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadButton } from "@/app/lib/uploadthing";
import { Fileupload } from "@/app/components/Fileupload";
import { url } from "inspector";
import Tabletaikhoan from "../components/Tabletaikhoan";

interface Role {
  idRole: number;
  TenNguoiDung: string;
}

interface FormData {
  Tentaikhoan: string;
  Matkhau: string;
  Hoten: string;
  Sdt: string;
  Diachi: string;
  Email: string;
  idRole: string;
}

export default function Page() {
  const initialFormData: FormData = {
    Tentaikhoan: "",
    Matkhau: "",
    Hoten: "",
    Sdt: "",
    Diachi: "",
    Email: "",
    idRole: "",
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  

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

  useEffect(() => {
    fetch("api/role")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch loai xe data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("role data:", data);
        setRoleList(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch role data");
        console.error("Failed to fetch loai xe", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa xe này không?")) {
      return;
    }

    try {
      const response = await fetch(`api/users/${id}`, {
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
      Tentaikhoan: product.Tentaikhoan,
      Matkhau: product.Matkhau,
      Hoten: product.Hoten,
      Sdt: product.Sdt,
      Diachi: product.Diachi,
      Email: product.Email,
      idRole: product.idRole.toString(),
    });
    setIsEditing(true);
    setEditingId(product.idUsers);
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
    const url = isEditing ? `api/users/${editingId}` : 'api/users';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...formData, HinhAnh: imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
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

  if (loading) return (
    <div className="flex justify-center items-center h-screen" data-theme = "light">
      <span className="loading loading-spinner text-blue-600 loading-lg"></span>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-2xl font-bold text-red-600">{error}</div>
    </div>
  );
  
  

  return (
    <div className="p-2 w-[1100px] h-full ml-7" data-theme="light">
      <div className="flex gap-4 w-full">
        <h1 className="text-2xl font-bold mb-6 mt-1 w-56 text-black whitespace-nowrap">
          Quản Lý Tài Khoản Người Dùng
        </h1>
        <div className="flex justify-end gap-4 w-full">
         
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
            {isEditing ? "Cập Nhật Sản Phẩm" : "Thêm Mới Sản Phẩm"}
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
                        htmlFor="Tentaikhoan"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Tên tài khoản
                      </label>
                      <input
                        type="text"
                        id="Tentaikhoan"
                        name="Tentaikhoan"
                        value={formData.Tentaikhoan}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="idRole"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Vai Trò
                      </label>
                      <select
                        id="idRole"
                        name="idRole"
                        value={formData.idRole}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn loại xe</option>
                        {roleList.map((role) => (
                          <option
                            key={role.idRole}
                            value={role.idRole}
                            className="text-black"
                          >
                            {role.TenNguoiDung}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Continue with rest of the form fields... */}
                  <div className="flex w-full gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="Matkhau"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Mật Khẩu
                      </label>
                      <input
                        type="text"
                        id="Matkhau"
                        name="Matkhau"
                        value={formData.Matkhau}
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
                        type="number"
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
                        Địa chỉ
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
                    <div className="flex-1 w-14">
                    <label
                        htmlFor="Email"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Họ Tên
                      </label>
                      <input
                        type="text"
                        id="HoTen"
                        name="Hoten"
                        value={formData.Hoten}
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
        <Tabletaikhoan
          onEdit={handleEdit}
          onDelete={handleDelete}
          reloadKey={refreshData}
        />
      </div>
    </div>
  );
}