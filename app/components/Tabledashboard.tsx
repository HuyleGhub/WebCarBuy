import React, { useEffect, useState } from 'react'
interface Xe {
    idXe: number;
    TenXe: string;
    GiaXe: number;
    idLoaiXe: number;
    MauSac: string;
    DongCo: string;
    TrangThai: string;
    HinhAnh: string;
    NamSanXuat: string;
    loaiXe?: {
      TenLoai: string;
      NhanHieu: string;
    };
}
interface LoaiXe {
    idLoaiXe: number;
    TenLoai: string;
    NhanHieu: string;
}
interface TableDashboardProps {
  onEdit: (product: Xe) => void;
  onDelete: (id: number) => void;
  reloadKey: (id: number) => void;
}
const Tabledashboard:React.FC<TableDashboardProps> = ({onEdit, onDelete, reloadKey}) => {
    const [isXeTable, setXeTable]=useState<Xe[]>([]);
    const [isLoaiXeTable, setLoaiXeTable]=useState<LoaiXe[]>([]);
    
    useEffect(()=>{
        fetch('api/xe')
        .then((response) =>{
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then((data)=>{
            setXeTable(data);
        })
        .catch((error)=>{{
            console.error('Error:', error);
        }})
    },[reloadKey]);
    
    useEffect(()=>{
        fetch('api/loaixe')
        .then((response) =>{
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          return response.json();
        })
        .then((data)=>{
            setLoaiXeTable(data);
        })
        .catch((error)=>{{
            console.error('Error:', error);
        }})
    },[])
    const getLoaiXeName = (idLoaiXe: number) => {
        const loaiXe = isLoaiXeTable.find((loai) => loai.idLoaiXe === idLoaiXe);
        return loaiXe ? loaiXe.TenLoai : 'N/A';
    };
  return (
    <div className="overflow-x-auto">
      <table className="table mt-7 w-[1000px]">
        {/* head */}
        <thead>
          <tr className="bg-blue-900 text-white text-center">
            <th>IdXe</th>
            <th>TenXe</th>
            <th>LoaiXe</th>
            <th>GiaXe</th>
            <th>Mau Sac</th>
            <th>Dong Co</th>
            <th>Trang Thai</th>
            <th>Hinh Anh</th>
            <th>Nam San Xuat</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {isXeTable.map((xetable) => (
            <tr className="text-black text-center">
              <th>{xetable.idXe}</th>
              <td>{xetable.TenXe}</td>
              <td>{getLoaiXeName(xetable.idLoaiXe)}</td>
              <td>{xetable.GiaXe}</td>
              <td>{xetable.MauSac}</td>
              <td>{xetable.DongCo}</td>
              <td>{xetable.TrangThai}</td>
              <td>
                <img src={xetable.HinhAnh} alt={xetable.TenXe} width="50" />
              </td>
              <td>{xetable.NamSanXuat}</td>
              <td className="space-x-2">
                <button
                  onClick={() => onEdit(xetable)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(xetable.idXe)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tabledashboard