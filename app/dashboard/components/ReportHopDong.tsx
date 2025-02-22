import React, { useState } from 'react';
import { Upload, FileType, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReportHopDongComponent = () => {

  const handleReport = async () => {
    try {
      const response = await fetch('api/donhang/reports');
      
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
      
      toast.success('Report generated successfully');
    } catch (error:any) {
      toast.error(`Report generation failed: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-6">
        {/* Import Section */}

            <button
              onClick={handleReport}
              className="inline-flex items-center px-1 py-1 pr-5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FileText className="h-5 w-5 mr-2 ml-2" />
              Generate Report
            </button>
          </div>
        </div>

  );
};

export default ReportHopDongComponent;