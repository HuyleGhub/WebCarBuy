import { getImageUrl } from "@/app/components/Fileupload";
import React, { useEffect, useState } from "react";
import moment from 'moment';

interface DatCoc {
  idDatCoc: number;
  idXe: number;
  idKhachHang: number;
  SotienDat: number;
  NgayDat: string;
  TrangThaiDat: string;
  khachHang?: {
    Hoten: string;
    Email: string;
    Sdt: string;
  },
  xe?: {
    TenXe: string;
    HinhAnh: string;
    GiaXe: number;
  };
  LichHenLayXe?: Array<{
    NgayLayXe: string;
    GioHenLayXe: string;
    DiaDiem: string;
  }>
}

interface TableDashboardProps {
  onEdit: (product: DatCoc) => void;
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

const TableDatCoc: React.FC<TableDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [isDatCocTable, setDatCocTable] = useState<DatCoc[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`api/phantrang/phantrangdatcoc?page=${currentPage}&limit_size=${pageSize}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setDatCocTable(data.data);
        setPaginationMeta(data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [currentPage, pageSize, reloadKey]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
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
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm font-medium">
            Số mục mỗi trang:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white h-10 text-center text-xs">
              <th>ID</th>
              <th>Khách Hàng</th>
              <th>SĐT</th>
              <th>Xe</th>
              <th>Giá Xe</th>
              <th>Trạng Thái</th>
              <th>Số Tiền Đặt</th>
              <th>Ngày Đặt</th>
              <th>Ngày Hẹn</th>
              <th>Địa Điểm</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13} className="text-center py-4">
                  Đang tải...
                </td>
              </tr>
            ) : (
              isDatCocTable.map((donhang) => (
                <tr key={donhang.idDatCoc} className="hover:bg-gray-100 border-b">
                  <td className="p-2 text-center text-sm font-bold">{donhang.idDatCoc}</td>
                  <td className="p-2 text-center text-sm">{donhang.khachHang?.Hoten || "Chưa xác định"}</td>
                  <td className="p-2 text-center text-sm">{donhang.khachHang?.Sdt || "N/A"}</td>
                  <td className="p-2 text-center text-sm">{donhang.xe?.TenXe || "Chưa chọn"}</td>
                  <td className="p-2 text-center text-sm">{formatCurrency(donhang.xe?.GiaXe || 0)}</td>
                  <td className="p-2 text-center text-sm"><span className={`px-3 py-1 rounded-full ${getStatusColor(donhang.TrangThaiDat)}`}>{donhang.TrangThaiDat}</span></td>
                  <td className="p-2 text-center text-sm">{formatCurrency(donhang.SotienDat)}</td>
                  <td className="p-2 text-center text-sm">{formatDateTime(donhang.NgayDat)}</td>
                  <td className="p-2 text-center text-sm">{formatDateTime(donhang.LichHenLayXe?.[0]?.NgayLayXe)}</td>
                  <td className="p-2 text-center text-sm">{donhang.LichHenLayXe?.[0]?.DiaDiem || "Chưa xác định"}</td>
                  <td className="p-2 text-center text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(donhang)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => onDelete(donhang.idDatCoc)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginationMeta && (
        <div className="flex justify-end items-center mt-4">          
          <div className="flex gap-2">
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

export default TableDatCoc;