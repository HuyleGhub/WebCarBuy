import React from 'react';

const TechnicalSpecs = () => {
  const specs = [
    { label: 'Động cơ', value: '01 Motor' },
    { label: 'Công suất tối đa (kW)', value: '30' },
    { label: 'Mô men xoắn cực đại (Nm)', value: '110' },
    { label: 'Tăng tốc', value: '5,3s (0-50 km/h)' },
    { label: 'Quãng đường chạy một lần sạc đầy (km)', value: '215' },
    { label: 'Thời gian nạp pin nhanh nhất', value: '36 phút (10% - 70%)' },
    { label: 'Dẫn động', value: 'RWD/Cầu sau' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-blue-100 rounded-lg shadow-sm mb-20 ">
      <h2 className="text-3xl font-medium text-gray-700 mb-6">Thông số kỹ thuật</h2>
      
      <div className="border-t border-gray-200">
        {specs.map((spec, index) => (
          <div 
            key={index} 
            className="flex py-4 px-1 border-b border-gray-200"
          >
            <div className="w-1/2 text-gray-700">{spec.label}</div>
            <div className="w-1/2 text-gray-700">{spec.value}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <button className="w-full py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition duration-200">
          XEM THÊM
        </button>
      </div>
    </div>
  );
};

export default TechnicalSpecs;