import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ImportExportComponent from "../dashboard/components/ImportExport";
import { get } from "http";

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

interface PaginationMeta {
  totalRecords: number;
  totalPage: number;
  page: number;
  limit_size: number;
  skip: number;
}

const TableDashboard: React.FC<TableDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [isXeTable, setXeTable] = useState<Xe[]>([]);
  const [isLoaiXeTable, setLoaiXeTable] = useState<LoaiXe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    fetch(
      `api/xe?page=${currentPage}&limit_size=${pageSize}&search=${searchText}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setXeTable(data.data);
        setPaginationMeta(data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentPage, pageSize, reloadKey, searchText]);

  useEffect(() => {
    fetch("api/loaixe")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setLoaiXeTable(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const getLoaiXeName = (idLoaiXe: number) => {
    const loaiXe = isLoaiXeTable.find((loai) => loai.idLoaiXe === idLoaiXe);
    return loaiXe ? loaiXe.TenLoai : "N/A";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-amber-400 text-gray-800"; // Màu hổ phách, chữ đen để dễ đọc
      case "Đã xác nhận":
        return "bg-blue-600 text-white"; // Màu xanh dương đậm
      case "Đang giao":
        return "bg-orange-500 text-white"; // Màu cam
      case "Đã giao":
        return "bg-emerald-500 text-white"; // Màu xanh lá ngọc bích (rõ ràng hơn so với xanh lá thông thường)
      case "Còn Hàng":
        return "bg-teal-500 text-white"; // Màu xanh cyan/ngọc lam
      case "Hết Hàng":
        return "bg-rose-500 text-white"; // Màu hồng đỏ (thay vì đỏ thông thường)
      case "Đã hủy":
        return "bg-gray-500 text-white"; // Màu xám (thay vì tím, hợp lý hơn cho trạng thái hủy)
      case "Đã đặt hàng":
        return "bg-indigo-500 text-white"; // Màu chàm/indigo (khác biệt với "Đã Giao")
      case "Đã Đặt Cọc":
        return "bg-amber-600 text-white"; // Màu nâu hổ phách đậm (thay vì stone/đá)
      default:
        return "bg-gray-300 text-gray-800"; // Mặc định xám nhạt với chữ đen
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="flex justify-between pb-5 ">
          <div className="mt-6">
            <label htmlFor="pageSize" className="text-sm">
              Số mục mỗi trang:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border rounded px-2 py-1"
            >
              <option value="5">5 </option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center gap-4  ">
             <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="input input-bordered h-10 text-sm w-full max-w-xs ml-4"
            />
            {/* <button
              onClick={handleExport}
              className="btn btn-outline btn-success"
            >
              Xuất Excel
            </button>  */}
            <ImportExportComponent/>
          </div>
        </div>
        <table className="table h-full w-[1000px]">
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
          {loading ? (
                  <tr>
                    <td colSpan={10} className="px-3 py-4 text-sm text-center">
                      <span>Đang tải...</span>
                    </td>
                  </tr>
                ) : isXeTable.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-3 py-4 text-sm text-center">
                      Không có dữ liệu người dùng
                    </td>
                  </tr>
                ) : (
              isXeTable.map((xetable) => (
                <tr key={xetable.idXe} className="text-black text-center">
                  <th>{xetable.idXe}</th>
                  <td>{xetable.TenXe}</td>
                  <td>{getLoaiXeName(xetable.idLoaiXe)}</td>
                  <td>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(xetable.GiaXe)}
                  </td>
                  <td>{xetable.MauSac}</td>
                  <td>{xetable.DongCo}</td>
                  <td className="w-40"><span className={`py-1 px-2 rounded-full text-sm ${getStatusColor(xetable.TrangThai)}`}>{xetable.TrangThai}</span></td>
                  <td>
                    {xetable.HinhAnh && (
                      <img
                        src={
                          Array.isArray(xetable.HinhAnh)
                            ? xetable.HinhAnh[0] // Lấy hình ảnh đầu tiên nếu là mảng
                            : xetable.HinhAnh.split("|")[0] // Nếu là chuỗi, split và lấy phần tử đầu
                        }
                        alt={xetable.TenXe}
                        width="50"
                      />
                    )}
                  </td>
                  <td>{xetable.NamSanXuat}</td>
                  <td className="flex gap-3">
                    <button
                      type="submit"
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginationMeta && (
        <div className="flex justify-end space-x-2 mt-4">
          <div className="flex space-x-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
            >
              Trước
            </button>

            {[...Array(paginationMeta.totalPage)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === paginationMeta.totalPage}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableDashboard;
