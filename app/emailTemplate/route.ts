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