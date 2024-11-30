import React, { useEffect, useState } from "react";


interface LoaiXe {
  idLoaiXe: number;
  TenLoai: string;
  NhanHieu: string;
  HinhAnh: string;
}

interface TableDashboardProps {
  onEdit: (product: LoaiXe) => void;
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

const TableLoaiXe: React.FC<TableDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [isLoaiXeTable, setLoaiXeTable] = useState<LoaiXe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`api/phantrang/phantrangloaixe?page=${currentPage}&limit_size=${pageSize}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setLoaiXeTable(data.data);
        setPaginationMeta(data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentPage, pageSize, reloadKey]);

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


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
      <div className="flex">
            <div className=" space-x-2">
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
          </div>
        <table className="table h-full w-[1000px]">
          <thead>
            <tr className="bg-blue-900 text-white text-center">
              <th>Id Loại Xe</th>
              <th>Tên Loại Xe</th>
              <th>Nhãn Hiệu</th>
              <th>Hình Ảnh</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center text-black py-4">
                  Đang tải...
                </td>
              </tr>
            ) : (
              isLoaiXeTable.map((loaixetable) => (
                <tr key={loaixetable.idLoaiXe} className="text-black text-center">
                  <th>{loaixetable.idLoaiXe}</th>
                  <td>{loaixetable.TenLoai}</td>
                  <td>{loaixetable.NhanHieu}</td>
                  <td>
                    <img src={loaixetable.HinhAnh} alt={loaixetable.TenLoai} width="50" />
                  </td>
                  <td className="space-x-2">
                    <button
                      type="submit"
                      onClick={() => onEdit(loaixetable)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(loaixetable.idLoaiXe)}
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

export default TableLoaiXe;
