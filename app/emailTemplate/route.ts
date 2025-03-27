interface AppointmentData {
  TenKhachHang: string;
  NgayHen: string | Date | null;
  GioHen: string;
  DiaDiem: string;
  NoiDung: string;
  xe: {
    TenXe: string | null;
  };
}
interface DatCocData {
  TenKhachHang: string;
  NgayLayXe: string | null;
  GioHenLayXe: string;
  DiaDiem: string;
  NoiDung: string;
  Email: string;
  Sdt: string;
  SotienDat: number;
  NgayDat: string | null;
  xe: {
    TenXe: string | null;
  };
}

export const createAppointmentEmailTemplate = (
  appointmentData: AppointmentData
) => {
  const appointmentDate = appointmentData.NgayHen ? new Date(appointmentData.NgayHen) : new Date();
  const formattedDate = appointmentDate.toLocaleDateString('vi-VN');
  const tenXe = appointmentData.xe.TenXe || 'Không xác định';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Xác nhận lịch hẹn lái thử xe</h2>
      <p>Kính gửi ${appointmentData.TenKhachHang},</p>
      <p>Chúng tôi xác nhận lịch hẹn lái thử xe của bạn với các thông tin sau:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Thông tin xe:</strong> ${tenXe}</p>
        <p><strong>Ngày hẹn:</strong> ${formattedDate}</p>
        <p><strong>Giờ hẹn:</strong> ${appointmentData.GioHen}</p>
        <p><strong>Địa điểm:</strong> ${appointmentData.DiaDiem}</p>
        <p><strong>Nội dung:</strong> ${appointmentData.NoiDung}</p>
      </div>

      <p>Nếu bạn cần thay đổi lịch hẹn, vui lòng liên hệ với chúng tôi.</p>
      <p>Xin cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi.</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
        Email này được gửi tự động, vui lòng không trả lời.
      </p>
    </div>
  `;
};

export const updateAppointmentEmailTemplate = (
  appointmentData: AppointmentData
) => {
  const appointmentDate = appointmentData.NgayHen ? new Date(appointmentData.NgayHen) : new Date();
  const formattedDate = appointmentDate.toLocaleDateString('vi-VN');
  const tenXe = appointmentData.xe.TenXe || 'Không xác định';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Cập nhật lịch hẹn lái thử xe</h2>
      <p>Kính gửi ${appointmentData.TenKhachHang},</p>
      <p>Lịch hẹn lái thử xe của bạn đã được cập nhật với các thông tin mới sau:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Thông tin xe:</strong> ${tenXe}</p>
        <p><strong>Ngày hẹn mới:</strong> ${formattedDate}</p>
        <p><strong>Giờ hẹn mới:</strong> ${appointmentData.GioHen}</p>
        <p><strong>Địa điểm:</strong> ${appointmentData.DiaDiem}</p>
        <p><strong>Nội dung:</strong> ${appointmentData.NoiDung}</p>
      </div>

      <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
      <p>Xin cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi.</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
        Email này được gửi tự động, vui lòng không trả lời.
      </p>
    </div>
  `;
};

export const deleteAppointmentEmailTemplate = (
  appointmentData: AppointmentData
) => {
  const appointmentDate = appointmentData.NgayHen ? new Date(appointmentData.NgayHen) : new Date();
  const formattedDate = appointmentDate.toLocaleDateString('vi-VN');
  const tenXe = appointmentData.xe.TenXe || 'Không xác định';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hủy lịch hẹn lái thử xe</h2>
      <p>Kính gửi ${appointmentData.TenKhachHang},</p>
      <p>Lịch hẹn lái thử xe của bạn đã bị hủy với các thông tin sau:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Thông tin xe:</strong> ${tenXe}</p>
        <p><strong>Ngày hẹn:</strong> ${formattedDate}</p>
        <p><strong>Giờ hẹn:</strong> ${appointmentData.GioHen}</p>
        <p><strong>Địa điểm:</strong> ${appointmentData.DiaDiem}</p>
        <p><strong>Nội dung:</strong> ${appointmentData.NoiDung}</p>
      </div>

      <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
      <p>Xin cảm ơn bạn đã quan tâm đến dịch vụ của chúng tôi.</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
        Email này được gửi tự động, vui lòng không trả lời.
      </p>
    </div>
  `;
};


export const createDatCocAppointmentEmailTemplate = (
  appointmentData: DatCocData
) => {
  const appointmentDate = appointmentData.NgayLayXe 
    ? new Date(appointmentData.NgayLayXe) 
    : new Date();
  const depositDate = appointmentData.NgayDat 
    ? new Date(appointmentData.NgayDat) 
    : new Date();
  
  const formattedAppointmentDate = appointmentDate.toLocaleDateString('vi-VN');
  const formattedDepositDate = depositDate.toLocaleDateString('vi-VN');
  const tenXe = appointmentData.xe.TenXe || 'Không xác định';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Xác nhận đặt cọc xe ${tenXe}</h2>
      <p>Kính gửi ${appointmentData.TenKhachHang},</p>
      <p>Chúng tôi xác nhận thông tin đặt cọc của bạn với các chi tiết sau:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Thông tin khách hàng</h3>
        <p><strong>Họ và tên:</strong> ${appointmentData.TenKhachHang}</p>
        <p><strong>Số điện thoại:</strong> ${appointmentData.Sdt}</p>
        <p><strong>Email:</strong> ${appointmentData.Email}</p>

        <h3>Thông tin xe</h3>
        <p><strong>Tên xe:</strong> ${tenXe}</p>
        <p><strong>Số tiền đặt cọc:</strong> ${appointmentData.SotienDat.toLocaleString('vi-VN')} VND</p>

        <h3>Chi tiết lịch hẹn</h3>
        <p><strong>Ngày đặt:</strong> ${formattedDepositDate}</p>
        <p><strong>Ngày hẹn:</strong> ${formattedAppointmentDate}</p>
        <p><strong>Giờ hẹn:</strong> ${appointmentData.GioHenLayXe}</p>
        <p><strong>Địa điểm:</strong> ${appointmentData.DiaDiem}</p>
      </div>

      <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
      <p>Xin cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi.</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
        Email này được gửi tự động, vui lòng không trả lời.
      </p>
    </div>
  `;
};

export const deleteManyDatCocAppointmentEmailTemplate = (
  appointmentData: DatCocData
) => {
  const appointmentDate = appointmentData.NgayLayXe 
    ? new Date(appointmentData.NgayLayXe) 
    : new Date();
  const depositDate = appointmentData.NgayDat 
    ? new Date(appointmentData.NgayDat) 
    : new Date();
  
  const formattedAppointmentDate = appointmentDate.toLocaleDateString('vi-VN');
  const formattedDepositDate = depositDate.toLocaleDateString('vi-VN');
  const tenXe = appointmentData.xe.TenXe || 'Không xác định';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Xác nhận hủy đơn đặt cọc xe ${tenXe}</h2>
      <p>Kính gửi ${appointmentData.TenKhachHang},</p>
      <p>Chúng tôi xác nhận thông tin hủy đơn đặt cọc của bạn với các chi tiết sau:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Thông tin khách hàng</h3>
        <p><strong>Họ và tên:</strong> ${appointmentData.TenKhachHang}</p>
        <p><strong>Số điện thoại:</strong> ${appointmentData.Sdt}</p>
        <p><strong>Email:</strong> ${appointmentData.Email}</p>

        <h3>Thông tin xe</h3>
        <p><strong>Tên xe:</strong> ${tenXe}</p>
        <p><strong>Số tiền đặt cọc:</strong> ${appointmentData.SotienDat.toLocaleString('vi-VN')} VND</p>

        <h3>Chi tiết lịch hẹn</h3>
        <p><strong>Ngày đặt:</strong> ${formattedDepositDate}</p>
        <p><strong>Ngày hẹn:</strong> ${formattedAppointmentDate}</p>
        <p><strong>Giờ hẹn:</strong> ${appointmentData.GioHenLayXe}</p>
        <p><strong>Địa điểm:</strong> ${appointmentData.DiaDiem}</p>
      </div>

      <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
      <p>Xin cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi.</p>
      
      <p style="color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
        Email này được gửi tự động, vui lòng không trả lời.
      </p>
    </div>
  `;
};
