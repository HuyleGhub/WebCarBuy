"use client";

import React, { useEffect, useState } from "react";
import Tabledashboard from "@/app/components/Tabledashboard";
import { IoAddCircleOutline } from "react-icons/io5";

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadButton } from "@/app/lib/uploadthing";
import { Fileupload } from "@/app/components/Fileupload";
import { url } from "inspector";
import TableDonHang from "../components/Tabledonhang";
import toast, {Toaster} from "react-hot-toast";
import TableDatCoc from "../components/Tabledatcoc";

interface ChiTietDonHang {
  idChiTietDonHang: number;
  idKhacHang: string;
}

interface FormData { 
  TrangThaiDat: string;
 
}

export default function Page() {
  const initialFormData: FormData = {
  TrangThaiDat: "",
 
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loaiXeList, setLoaiXeList] = useState<ChiTietDonHang[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    setReloadKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    fetch("api/datcoc")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch loai xe data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Loai xe data:", data);
        setLoaiXeList(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to fetch loai xe data");
        console.error("Failed to fetch loai xe", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
  toast((t)=>(
    <div className="flex flex-col gap-2">
        <span className="font-medium">Bạn có chắc muốn xóa loại xe này?</span>
        <div className="flex gap-2">
    <button
    onClick={async () =>{
      toast.dismiss(t.id);
      try {
        const response = await fetch(`api/datcoc/${id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) {
          throw new Error("Failed to delete product");
        }
  
        const data = await response.json();
        toast.success(data.message);
        refreshData();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error deleting product");
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
  })
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
      TrangThaiDat: product.TrangThaiDat,
    });
    setIsEditing(true);
    setEditingId(product.idDatCoc);
    // Show the dialog after setting the form data
    const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const url = isEditing ? `api/datcoc/${editingId}` : 'api/datcoc';
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
        throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
      }

      const data = await response.json();
      toast.success(data.message);
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingId(null);
      refreshData();
     

      // Close the dialog after successful submission
      const dialog = document.getElementById("my_modal_3") as HTMLDialogElement;
      if (dialog) {
        dialog.close();
      }

    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Error ${isEditing ? 'updating' : 'creating'} product`);
      
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
  
  

  return (
    <div className="p-2 w-full h-[630px]" data-theme="light">
      <div className="flex w-full">
        <h1 className="text-2xl font-bold mb-6 mt-1 ml-20 w-56 text-black whitespace-nowrap">
          Quản Lý Đặt Cọc
        </h1>
        
      </div>
      <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        success: {
          duration: 3000,
          style: {
            background: '#22c55e',
          },
        },
        error: {
          duration: 3000,
          style: {
            background: '#ef4444',
          },
        },          
      }}
      />
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
                        htmlFor="TrangThaiDat"
                        className="block font-medium text-gray-700 mb-1"
                      >
                        Trạng Thái
                      </label>
                      <select
                        
                        name="TrangThaiDat"
                        value={formData.TrangThaiDat}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Chọn Trạng Thái</option>
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đã hủy">Đã hủy</option>
                    
                      </select>
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
      <div className="flex ml-20 w-[1170px] justify-center">
        <TableDatCoc
          onEdit={handleEdit}
          onDelete={handleDelete}
          reloadKey={refreshData}
        />
      </div>
    </div>
  );
}