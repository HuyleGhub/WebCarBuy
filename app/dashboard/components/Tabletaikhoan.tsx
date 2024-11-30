import React, { useEffect, useState } from "react";

interface User {
  idUsers: number;
  Tentaikhoan: string;
  Matkhau: string;
  Hoten: string;
  Sdt: string;
  Diachi: string;
  Email: string;
  idRole: number;
  Ngaydangky: string;
  role?: {
    TenNguoiDung: string;
  }
}

interface Role {
  idRole: number;
  TenNguoiDung: string;
}

interface TableUserProps {
  onEdit: (user: User) => void;
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

const TableUser: React.FC<TableUserProps> = ({
  onEdit,
  onDelete,
  reloadKey,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("api/role")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setRoles(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    fetch(`api/phantrang/phantranguser?page=${currentPage}&limit_size=${pageSize}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setUsers(data.data);
        setPaginationMeta(data.meta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [currentPage, pageSize, reloadKey]);

  const getRoleName = (idRole: number): string => {
    const role = roles.find(role => role.idRole === idRole);
    return role?.TenNguoiDung || "N/A";
  };

  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="w-full">
      <div className="overflow-hidden">
        <div className="">
          <div className="inline-block min-w-full align-middle">
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
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-blue-900">
                <tr>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Id User</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Họ tên</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Số điện thoại</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Địa chỉ</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Email</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Vai trò</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Ngày đăng ký</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-3 py-4 text-sm text-center">
                      <span>Đang tải...</span>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-3 py-4 text-sm text-center">
                      Không có dữ liệu người dùng
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.idUsers} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{user.idUsers}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{user.Hoten}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{user.Sdt}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{user.Diachi}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{user.Email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{getRoleName(user.idRole)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{formatDateTime(user.Ngaydangky)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEdit(user)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => onDelete(user.idUsers)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
        </div>
      </div>

      {paginationMeta && (
        <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-4">

          <div className="flex flex-wrap justify-center gap-2">
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

export default TableUser;