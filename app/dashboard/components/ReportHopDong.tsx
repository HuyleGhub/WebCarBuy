import React from 'react';
import { FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ReportHopDongComponentProps {
  selectedOrders: number[];
}

const ReportHopDongComponent: React.FC<ReportHopDongComponentProps> = ({ selectedOrders }) => {
  const handleGenerateReport = async () => {
    if (selectedOrders.length === 0) {
      toast.error('Vui lòng chọn ít nhất một đơn hàng');
      return;
    }

    try {
      const orderIds = selectedOrders.join(',');
      const response = await fetch(`api/donhang/reports?orderIds=${orderIds}`);
      
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hopdong-mua-ban.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
    } catch (error: any) {
      
    }
  };

  return (
    <button
      onClick={handleGenerateReport}
      disabled={selectedOrders.length === 0}
      className={`inline-flex items-center px-3 py-2 text-white rounded-lg transition-colors ${
        selectedOrders.length === 0 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-red-500 hover:bg-red-600'
      }`}
    >
      <FileText className="h-5 w-5 mr-2" />
      Xuất hợp đồng ({selectedOrders.length})
    </button>
  );
};

export default ReportHopDongComponent;