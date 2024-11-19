"use client";

import React, { useEffect, useState } from "react";
import Tabledashboard from "@/app/components/Tabledashboard";
import { IoAddCircleOutline } from "react-icons/io5";

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadButton } from "@/app/lib/uploadthing";
import { Fileupload } from "@/app/components/Fileupload";
import { url } from "inspector";
import TableLoaiXe from "../components/Tableloaixe";

interface FormData {
  TenLoai: string;
  NhanHieu: string;
  HinhAnh: string;
}

export default function Page() {
  const initialFormData: FormData = {
    TenLoai: "",
    NhanHieu: "",
    HinhAnh: "",
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
      const response = await fetch(`api/loaixe/${id}`, {
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
      TenLoai: product.TenLoai,
      NhanHieu: product.NhanHieu,
      HinhAnh: product.HinhAnh,
    });
    setIsEditing(true);
    setEditingId(product.idLoaiXe);
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
    const url = isEditing ? `api/loaixe/${editingId}` : 'api/loaixe';
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
          Quản Lý Loại Xe
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
            {isEditing ? "Cập Nhật Loại Xe" : "Thêm Mới Loại Xe"}
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
                        htmlFor="TenXe"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Tên Loai Xe
                      </label>
                      <input
                        type="text"
                        id="TenLoai"
                        name="TenLoai"
                        value={formData.TenLoai}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="flex-1">
                    <label
                        htmlFor="DongCo"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Nhãn Hiệu
                      </label>
                      <input
                        type="text"
                        id="NhanHieu"
                        name="NhanHieu"
                        value={formData.NhanHieu}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex w-full gap-4">

                    <div className="flex-1">
                    <label
                        htmlFor="HinhAnh"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Hình Ảnh
                      </label>
                      <Fileupload 
                  endpoint='imageUploader'
                  onChange={(url) => setImageUrl(url || '')}
                  showUpload={!imageUrl}
                />
               {imageUrl && (
                  <div className="mt-2 flex flex-col items-center">
                    <img src={imageUrl} alt="Uploaded" className="max-w-xs max-h-48" />
                    <button 
                      type="button" 
                      onClick={() => setImageUrl('')} 
                      className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
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
        <TableLoaiXe
          onEdit={handleEdit}
          onDelete={handleDelete}
          reloadKey={refreshData}
        />
      </div>
    </div>
  );
}