"use client"

import DashboardLayout from '@/app/components/Dashboardlayout';
import Sidebardashboard from '@/app/components/Sidebardashboard';
import Tabledashboard from '@/app/components/Tabledashboard';
import React, { useEffect, useState } from 'react';


interface LoaiXe {
  
  idLoaiXe: number;
  TenLoai: string;
}

interface FormData {
  TenXe: string;
  idLoaiXe: string;
  GiaXe: string;
  MauSac: string;
  DongCo: string;
  TrangThai: string;
  HinhAnh: string;
  NamSanXuat: string;
}

export default function page() {
  const initialFormData: FormData = {
    TenXe: '',
    idLoaiXe: '',
    GiaXe: '',
    MauSac: '',
    DongCo: '',
    TrangThai: '',
    HinhAnh: '',
    NamSanXuat: '',
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loaiXeList, setLoaiXeList] = useState<LoaiXe[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const refreshData = () => {
    setReloadKey(prevKey => prevKey + 1);
  };
  useEffect(() => {
        fetch('/api/loaixe')
        .then((response)=>{
           if (!response.ok) {
          throw new Error('Failed to fetch loai xe data');
        }
        return response.json();
        })
        .then((data) => {
        console.log("Loai xe data:", data);
        setLoaiXeList(data);
      })
      .catch((err) => {
        setError('Failed to fetch loai xe data');
        console.error("Failed to fetch loai xe", err);
      })

  }, []);
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa xe này không?')) {
      return;
    }

    try {
      const response = await fetch(`/api/xe/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      const data = await response.json();
      setSuccess(data.message);
      // Refresh your table data here if needed
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting product');
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
      TenXe: product.TenXe,
      idLoaiXe: product.idLoaiXe.toString(),
      GiaXe: product.GiaXe.toString(),
      MauSac: product.MauSac,
      DongCo: product.DongCo,
      TrangThai: product.TrangThai,
      HinhAnh: product.HinhAnh,
      NamSanXuat: product.NamSanXuat.toString(),
    });
    setIsEditing(true);
    setEditingId(product.idXe);
  };
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const url = isEditing ? `/api/xe/${editingId}` : '/api/xe';
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
      setSuccess(data.message);
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingId(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : `Error ${isEditing ? 'updating' : 'creating'} product`);
    }
  };

  return (
    
    <div className="p-6 w-[1100px] ml-7" data-theme="light" >
      <h1 className="text-2xl font-bold mb-6 mt-8 text-black">
      {isEditing ? 'Cập Nhật Sản Phẩm' : 'Quản Lý Sản Phẩm'}
      </h1>
      
      <div className='flex w-full'>
        <div className="pt-6 w-[20000px]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            <div className="flex justify-center w-full flex-wrap gap-4">
            <div className="flex w-full gap-4">
              <div className='flex-1'>
                <label htmlFor="TenXe" className="block font-medium text-gray-700 mb-1">
                  Tên Xe
                </label>
                <input
                  type="text"
                  id="TenXe"
                  name="TenXe"
                  value={formData.TenXe}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className='flex-1'>
                <label htmlFor="idLoaiXe" className="block font-medium text-gray-700 mb-1">
                  Loại Xe
                </label>
                <select
                  id="idLoaiXe"
                  name="idLoaiXe"
                  value={formData.idLoaiXe}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn loại xe</option>
                  {loaiXeList.map((loaiXe) => (
                    <option key={loaiXe.idLoaiXe} value={loaiXe.idLoaiXe} className='text-black'>
                      {loaiXe.TenLoai}
                    </option>
                  ))}
                </select>
              </div>
             </div>
              
             <div className="flex w-full gap-4">
              <div className='flex-1'>
                <label htmlFor="GiaXe" className="block font-medium text-gray-700 mb-1">
                  Giá Xe
                </label>
                <input
                  type="number"
                  id="GiaXe"
                  name="GiaXe"
                  value={formData.GiaXe}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className='flex-1'>
                <label htmlFor="MauSac" className="block font-medium text-gray-700 mb-1">
                  Màu Sắc
                </label>
                <input
                  type="text"
                  id="MauSac"
                  name="MauSac"
                  value={formData.MauSac}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex w-full gap-4">
              <div className='flex-1'>
                <label htmlFor="DongCo" className="block font-medium text-gray-700 mb-1">
                  Động Cơ
                </label>
                <input
                  type="text"
                  id="DongCo"
                  name="DongCo"
                  value={formData.DongCo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className='flex-1'>
                <label htmlFor="NamSanXuat" className="block font-medium text-gray-700 mb-1">
                  Năm Sản Xuất
                </label>
                <input
                  type="number"
                  id="NamSanXuat"
                  name="NamSanXuat"
                  value={formData.NamSanXuat}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex w-full gap-4">
              <div className='flex-1'>
                <label htmlFor="TrangThai" className="block font-medium text-gray-700 mb-1">
                  Trạng Thái
                </label>
                <select
                  id="TrangThai"
                  name="TrangThai"
                  value={formData.TrangThai}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn trạng thái</option>
                  <option value="Còn Hàng">Còn Hàng</option>
                  <option value="Hết Hàng">Hết Hàng</option>
                </select>
              </div>

              <div className='flex-1'>
                <label htmlFor="HinhAnh" className="block font-medium text-gray-700 mb-1">
                  Hình Ảnh URL
                </label>
                <input
                  type="url"
                  id="HinhAnh"
                  name="HinhAnh"
                  value={formData.HinhAnh}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-black bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            </div>

            <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => {
            setFormData(initialFormData);
            setIsEditing(false);
            setEditingId(null);
          }}
          className={`px-6 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 ${isEditing ? '': 'hidden'}`}
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {isEditing ? 'Cập Nhật' : 'Thêm Mới'}
        </button>
      </div>
          </form>
          <Tabledashboard onEdit={handleEdit}
        onDelete={handleDelete}
        reloadKey={refreshData}/>
        </div>
      </div>
    </div>
  );
}