import { getImageUrl } from "@/app/components/Fileupload";
import { LichGiaoXe } from "@prisma/client";
import React, { useEffect, useState } from "react";
import ReportHopDongComponent from "./ReportHopDong";
import { CheckBox } from "docx";
import { Check } from "lucide-react";

interface DonHang {
  idDonHang: number;
  idKhackHang: number;
  TrangThaiDonHang: string;
  TongTien: number;
  NgayDatHang: string;
  khachHang?: {
    Hoten: string;
    Email: string;
    Sdt: string;
  } 
  LichGiaoXe?: Array<{
    NgayGiao: string;
  }>
}

interface ChiTietDonHang {
  idChiTietDonHang: number;
  idDonHang: number;
  idXe: number;
  SoLuong: number;
  DonGia: number;
  xe?: {
    TenXe: string;
    HinhAnh: string;
    GiaXe: number;
  };
}

interface TableDashboardProps {
  onEdit: (product: DonHang) => void;
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

const TableDonHang: React.FC<TableDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [isDonHangTable, setDonHangTable] = useState<DonHang[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isChiTietDonHang, setChiTietDonHang] = useState<ChiTietDonHang[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (orderId: number) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      }
      return [...prev, orderId];
    });
  };

  // New function to handle the "Check All" functionality
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      // If select all is true, select all orders in the current page
      const allOrderIds = isDonHangTable.map(order => order.idDonHang);
      setSelectedOrders(allOrderIds);
    } else {
      // If select all is false, clear all selections
      setSelectedOrders([]);
    }
  };

  // Effect to update selectAll state when selectedOrders changes
  useEffect(() => {
    // Check if all orders on the current page are selected
    if (isDonHangTable.length > 0) {
      const allSelected = isDonHangTable.every(order => 
        selectedOrders.includes(order.idDonHang)
      );
      setSelectAll(allSelected);
    }
  }, [selectedOrders, isDonHangTable]);

  useEffect(() => {
    setLoading(true);
    fetch(`api/phantrang/phantrangdonhang?page=${currentPage}&limit_size=${pageSize}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setDonHangTable(data.data);
        setPaginationMeta(data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [currentPage, pageSize, reloadKey]);

  const handleViewDetail = async (orderId: number) => {
    setCurrentOrderId(orderId);
    try {
      const response = await fetch(`api/chitietdonhang/${orderId}`);
      if (!response.ok) throw new Error("Failed to fetch order details");
      const data = await response.json();
      setChiTietDonHang(data);
      const dialog = document.getElementById("my_modal_4") as HTMLDialogElement;
      if (dialog) {
        dialog.showModal();
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

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
    <div className="space-y-4">
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-11/12 max-w-3xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">Chi tiết đơn hàng </h3>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {isChiTietDonHang.map((detail) => (
              <div
                key={detail.idChiTietDonHang}
                className="border rounded-lg p-4 flex items-center gap-4 bg-white shadow-sm"
              >
                {detail.xe?.HinhAnh && (
                  <img
                    src={getImageUrl(detail.xe?.HinhAnh.split("|")[0])}
                    alt={detail.xe?.TenXe || "Product image"}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{detail.xe?.TenXe}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <p className="text-gray-600">Số lượng: {detail.SoLuong}</p>
                    <p className="text-gray-600">Đơn giá: {formatCurrency(detail.DonGia)}</p>
                    <p className="text-gray-600 font-semibold col-span-2">
                      Thành tiền: {formatCurrency(detail.DonGia * detail.SoLuong)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </dialog>

      <div className="overflow-x-auto">
      <div className="flex items-center gap-2 w-full ">
            <label htmlFor="pageSize" className="text-sm w-36">
              Số mục mỗi trang:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border rounded px-2 py-1 text-xs"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <div className="flex w-full justify-end pb-3">
            <ReportHopDongComponent selectedOrders={selectedOrders} />
          </div>
          </div>
         
        <table className="table w-[1000px]">
          <thead>
            <tr className="bg-blue-900 text-white text-center">
              <th className="flex justify-evenly">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm ml-5 bg-white"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <span className="pt-1 ml-1">All</span>
              </th>
              <th>Id</th>
              <th>Tên Khách Hàng</th>
              <th>Số điện Thoại</th>
              <th>Trạng Thái Đơn Hàng</th>
              <th>Tổng Tiền</th>
              <th>Ngày Đặt Hàng</th>
              <th>Lịch Giao Xe</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  Đang tải...
                </td>
              </tr>
            ) : (
              isDonHangTable.map((donhang) => (
                <tr key={donhang.idDonHang} className="text-black text-center">
                  <th>
                    <input 
                      type="checkbox"
                      checked={selectedOrders.includes(donhang.idDonHang)}
                      onChange={() => handleCheckboxChange(donhang.idDonHang)}
                      className="checkbox checkbox-sm"
                    />
                  </th>
                  <th>{donhang.idDonHang}</th>
                  <td>{donhang.khachHang?.Hoten || "Undefine"}</td>
                  <td>{donhang.khachHang?.Sdt || "Undefine"}</td>
                  <td><span className={`px-3 py-1 rounded-full ${getStatusColor(donhang.TrangThaiDonHang)}`}>{donhang.TrangThaiDonHang}</span></td>
                  <td>{formatCurrency(donhang.TongTien)}</td>
                  <td>{formatDateTime(donhang.NgayDatHang)}</td>
                  <td>{formatDateTime(donhang.LichGiaoXe?.[0]?.NgayGiao)}</td>
                
                  <td className="flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(donhang)}
                      className="px-2 py-1  bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => onDelete(donhang.idDonHang)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Xóa
                    </button>
                    <button 
                      onClick={() => handleViewDetail(donhang.idDonHang)}
                      className="px-3 py-1 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors"
                    >
                      Detail
                    </button>
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

export default TableDonHang;