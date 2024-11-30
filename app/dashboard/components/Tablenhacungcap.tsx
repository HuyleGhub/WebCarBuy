import React, { useEffect, useState } from "react";

interface nhacungcap {
  idNhaCungCap: number;
  TenNhaCungCap: string;
  Sdt: number;
  Email: string;
}

interface TableDashboardProps {
  onEdit: (product: nhacungcap) => void;
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

const TableNhaCungCap: React.FC<TableDashboardProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [isXeTable, setXeTable] = useState<nhacungcap[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`api/phantrang/phantrangnhacungcap?page=${currentPage}&limit_size=${pageSize}`)
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
  }, [currentPage, pageSize, reloadKey]);

  useEffect(() => {
    fetch("api/nhacungcap")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setXeTable(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

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
              <th>Id Nhà Cung Cấp</th>
              <th>Tên Nhà Cung Cấp</th>
              <th>Số Điện Thoại</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  Đang tải...
                </td>
              </tr>
            ) : (
              isXeTable.map((xetable) => (
                <tr key={xetable.idNhaCungCap} className="text-black text-center">
                  <th>{xetable.idNhaCungCap}</th>
                  <td>{xetable.TenNhaCungCap}</td>
                  <td>{xetable.Sdt}</td>
                  <td>{xetable.Email}</td>
                  <td className="space-x-2">
                    <button
                      type="submit"
                      onClick={() => onEdit(xetable)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(xetable.idNhaCungCap)}
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

export default TableNhaCungCap;
