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
  const [pageSize, setPageSize] = useState(10);
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
            <tr className="bg-blue-900 text-white text-center">
              <th>ID</th>
              <th>Khách Hàng</th>
              <th>SĐT</th>
              <th>Email</th>
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
                  <td className="p-2 text-center">{donhang.idDatCoc}</td>
                  <td className="p-2 text-center">{donhang.khachHang?.Hoten || "Chưa xác định"}</td>
                  <td className="p-2 text-center">{donhang.khachHang?.Sdt || "N/A"}</td>
                  <td className="p-2 text-center">{donhang.khachHang?.Email || "N/A"}</td>
                  <td className="p-2 text-center">{donhang.xe?.TenXe || "Chưa chọn"}</td>
                  <td className="p-2 text-center">{formatCurrency(donhang.xe?.GiaXe || 0)}</td>
                  <td className="p-2 text-center">{donhang.TrangThaiDat}</td>
                  <td className="p-2 text-center">{formatCurrency(donhang.SotienDat)}</td>
                  <td className="p-2 text-center">{formatDateTime(donhang.NgayDat)}</td>
                  <td className="p-2 text-center">{formatDateTime(donhang.LichHenLayXe?.[0]?.NgayLayXe)}</td>
                  <td className="p-2 text-center">{donhang.LichHenLayXe?.[0]?.DiaDiem || "Chưa xác định"}</td>
                  <td className="p-2 text-center">
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