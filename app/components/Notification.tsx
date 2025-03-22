import React, { useState, useEffect, useRef } from 'react';
import { Bell, Trash2, FileText, CreditCard } from 'lucide-react';

interface Order {
  idDonHang: number;
  TrangThaiDonHang: string;
  TongTien: number;
  NgayDatHang: string;
  khachHang: {
    Hoten: string;
    Email: string;
  };
  ChiTietDonHang: Array<{
    SoLuong: number;
    DonGia: number;
    xe: {
      TenXe: string;
    };
  }>;
}

interface Deposit {
  idDatCoc: number;
  NgayDat: string;
  SotienDat: number;
  TrangThaiDat: string;
  LichHenLayXe: {
    NgayLayXe: string;
    DiaDiem: string;
  }
  xe: {
    TenXe: string;
    GiaXe: number;
  };
  khachHang: {
    Hoten: string;
    Email: string;
    Sdt: string;
  };
}

const NotificationComponent = () => {
  const [selectedTab, setSelectedTab] = useState<'orders' | 'deposits'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const ordersResponse = await fetch('/api/thongbao');
      const ordersData = await ordersResponse.json();
      setOrders(ordersData);

      const depositsResponse = await fetch('/api/datcoc');
      const depositsData = await depositsResponse.json();
      setDeposits(depositsData);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalNotifications = () => {
    return orders.length + deposits.length;
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
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
    <div className="relative">
      <button
        ref={buttonRef}
        className="btn btn-ghost btn-circle"
        onClick={toggleDropdown}
      >
        <div className="indicator">
          <Bell className="h-5 w-5" />
          {getTotalNotifications() > 0 && (
            <span className="badge badge-sm badge-primary indicator-item">
              {getTotalNotifications()}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-3 z-[1] card w-96 bg-base-100 shadow-xl"
        >
          <div className="card-body p-0">
            <div className="tabs tabs-boxed bg-base-200 m-2">
              <a 
                className={`tab flex-1 ${selectedTab === 'orders' ? 'tab-active' : ''}`}
                onClick={() => setSelectedTab('orders')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Đơn hàng ({orders.length})
              </a>
              <a 
                className={`tab flex-1 ${selectedTab === 'deposits' ? 'tab-active' : ''}`}
                onClick={() => setSelectedTab('deposits')}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Đặt cọc ({deposits.length})
              </a>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center p-4">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : (
                <>
                  {selectedTab === 'orders' && (
                    <div>
                      {orders.length > 0 ? (
                        orders.map((order) => (
                          <div key={order.idDonHang} className="border-b">
                            <div className="collapse collapse-arrow">
                              <input type="checkbox" />
                              <div className="collapse-title p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold">
                                      Đơn hàng #{order.idDonHang}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {formatDate(order.NgayDatHang)}
                                    </p>
                                  </div>
                                  <div className={`badge ${getStatusColor(order.TrangThaiDonHang)}`}>
                                    {order.TrangThaiDonHang}
                                  </div>
                                </div>
                              </div>
                              <div className="collapse-content bg-base-200">
                                <div className="p-4">
                                  <h4 className="font-semibold mb-2">Thông tin khách hàng:</h4>
                                  <p>Tên: {order.khachHang.Hoten}</p>
                                  <p>Email: {order.khachHang.Email}</p>
                                  
                                  <h4 className="font-semibold mt-4 mb-2">Chi tiết đơn hàng:</h4>
                                  {order.ChiTietDonHang.map((item, index) => (
                                    <div key={index} className="mb-2">
                                      <p>{item.xe.TenXe} x {item.SoLuong}</p>
                                      <p className="text-sm text-gray-500">
                                        Đơn giá: {formatCurrency(Number(item.DonGia))}
                                      </p>
                                    </div>
                                  ))}
                                  
                                  <div className="divider"></div>
                                  
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold">Tổng tiền:</span>
                                    <span className="text-primary font-bold">
                                      {formatCurrency(Number(order.TongTien))}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Không có đơn hàng mới
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTab === 'deposits' && (
                     <div>
                     {deposits.length > 0 ? (
                       deposits.map((deposit) => (
                         <div key={deposit.idDatCoc} className="border-b">
                           <div className="collapse collapse-arrow">
                             <input type="checkbox" />
                             <div className="collapse-title p-4">
                               <div className="flex justify-between items-center">
                                 <div>
                                   <p className="font-semibold">
                                     Đơn đặt cọc #{deposit.idDatCoc}
                                   </p>
                                   <p className="text-sm text-gray-500">
                                     {formatDate(deposit.NgayDat)}
                                   </p>
                                 </div>
                                 <div className={`badge ${getStatusColor(deposit.TrangThaiDat)}`}>
                                   {deposit.TrangThaiDat}
                                 </div>
                               </div>
                             </div>
                             <div className="collapse-content bg-base-200">
                               <div className="p-4">
                                 <h4 className="font-semibold mb-2">Thông tin khách hàng:</h4>
                                 <p>Tên: {deposit.khachHang.Hoten}</p>
                                 <p>Email: {deposit.khachHang.Email}</p>
                                 
                                 
                                 <h4 className="font-semibold mt-4 mb-2">Thông tin đặt cọc:</h4>
                                 <p>Tên Xe: {deposit.xe.TenXe}</p>
                                 <p>Giá Xe: {deposit.xe.GiaXe}</p>
                                 <p>Ngày Lấy Xe: {formatDate(deposit.LichHenLayXe?.[0]?.NgayLayXe)} </p>
                                 <p>Địa Điểm: {deposit.LichHenLayXe?.[0]?.DiaDiem}</p>
                                 <div className="divider"></div>
                                 
                                 <div className="flex justify-between items-center">
                                   <span className="font-semibold">Số tiền đặt cọc:</span>
                                   <span className="text-primary font-bold">
                                     {formatCurrency(Number(deposit.SotienDat))}
                                   </span>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </div>
                       ))
                     ) : (
                       <div className="p-4 text-center text-gray-500">
                         Không có đơn đặt cọc mới
                       </div>
                     )}
                   </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;